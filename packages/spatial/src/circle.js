import { applyConverter, closedPolygon } from './util';

import {
  positionToGeographic
} from './position';

const VINCENTY = {
  a: 6378137,
  b: 6356752.3142,
  f: 1 / 298.257223563
};

export const toGeographic = (geojson) => applyConverter(geojson, positionToGeographic);

export const toCircle = (center, radius, interpolate) => {
  const steps = interpolate || 64;
  const rad = radius || 250;

  if (!center || center.length < 2 || !rad || !steps) {
    throw new Error('Terraformer: missing parameter for Terraformer.Circle');
  }

  return {
    type: 'Feature',
    geometry: createGeodesicCircle(center, rad, steps),
    properties: {
      radius: rad,
      center,
      steps
    }
  };
};

/* cribbed from
  http://stackoverflow.com/questions/24145205/writing-a-function-to-convert-a-circle-to-a-polygon-using-leaflet-js
*/
const createGeodesicCircle = (center, radius, interpolate) => {
  const steps = interpolate || 64;
  const polygon = {
    type: 'Polygon',
    coordinates: [[]]
  };

  let angle;
  for (let i = 0; i < steps; i++) {
    angle = (i * 360 / steps);
    polygon.coordinates[0].push(destinationVincenty(center, angle, radius));
  }

  polygon.coordinates = closedPolygon(polygon.coordinates);

  return polygon;
};

const destinationVincenty = (coords, brng, dist) => {
  let cos2SigmaM, sinSigma, cosSigma, deltaSigma;
  const a = VINCENTY.a; const b = VINCENTY.b; const f = VINCENTY.f;
  const lon1 = coords[0];
  const lat1 = coords[1];
  const s = dist;
  const pi = Math.PI;
  const alpha1 = brng * pi / 180; // converts brng degrees to radius
  const sinAlpha1 = Math.sin(alpha1);
  const cosAlpha1 = Math.cos(alpha1);
  const tanU1 = (1 - f) * Math.tan(lat1 * pi / 180 /* converts lat1 degrees to radius */);
  const cosU1 = 1 / Math.sqrt((1 + tanU1 * tanU1)); const sinU1 = tanU1 * cosU1;
  const sigma1 = Math.atan2(tanU1, cosAlpha1);
  const sinAlpha = cosU1 * sinAlpha1;
  const cosSqAlpha = 1 - sinAlpha * sinAlpha;
  const uSq = cosSqAlpha * (a * a - b * b) / (b * b);
  const A = 1 + uSq / 16384 * (4096 + uSq * (-768 + uSq * (320 - 175 * uSq)));
  const B = uSq / 1024 * (256 + uSq * (-128 + uSq * (74 - 47 * uSq)));
  let sigma = s / (b * A); let sigmaP = 2 * Math.PI;
  while (Math.abs(sigma - sigmaP) > 1e-12) {
    cos2SigmaM = Math.cos(2 * sigma1 + sigma);
    sinSigma = Math.sin(sigma);
    cosSigma = Math.cos(sigma);
    deltaSigma = B * sinSigma * (cos2SigmaM + B / 4 * (cosSigma * (-1 + 2 * cos2SigmaM * cos2SigmaM) -
          B / 6 * cos2SigmaM * (-3 + 4 * sinSigma * sinSigma) * (-3 + 4 * cos2SigmaM * cos2SigmaM)));
    sigmaP = sigma;
    sigma = s / (b * A) + deltaSigma;
  }
  const tmp = sinU1 * sinSigma - cosU1 * cosSigma * cosAlpha1;
  const lat2 = Math.atan2(sinU1 * cosSigma + cosU1 * sinSigma * cosAlpha1,
    (1 - f) * Math.sqrt(sinAlpha * sinAlpha + tmp * tmp));
  const lambda = Math.atan2(sinSigma * sinAlpha1, cosU1 * cosSigma - sinU1 * sinSigma * cosAlpha1);
  const C = f / 16 * cosSqAlpha * (4 + f * (4 - 3 * cosSqAlpha));
  const lam = lambda - (1 - C) * f * sinAlpha *
      (sigma + C * sinSigma * (cos2SigmaM + C * cosSigma * (-1 + 2 * cos2SigmaM * cos2SigmaM)));
  const lamFunc = lon1 + (lam * 180 / pi); // converts lam radius to degrees
  const lat2a = lat2 * 180 / pi; // converts lat2a radius to degrees

  return [lamFunc, lat2a];
};
