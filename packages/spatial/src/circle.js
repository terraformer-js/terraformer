import { applyConverter, closedPolygon } from './util';

import {
  positionToGeographic, positionToMercator
} from './position';

export const toGeographic = (geojson) => applyConverter(geojson, positionToGeographic);

export const toCircle = (center, radius, interpolate) => {
  const steps = interpolate || 64;
  const rad = radius || 250;

  if (!center || center.length < 2 || !rad || !steps) {
    throw new Error('Terraformer: missing parameter for Terraformer.Circle');
  }

  return {
    type: 'Feature',
    geometry: createCircle(center, rad, steps),
    properties: {
      radius: rad,
      center: center,
      steps: steps
    }
  };
};

const createCircle = (center, radius, interpolate) => {
  const mercatorPosition = positionToMercator(center);
  const steps = interpolate || 64;
  const polygon = {
    type: 'Polygon',
    coordinates: [[]]
  };
  for (var i = 1; i <= steps; i++) {
    const radians = i * (360 / steps) * Math.PI / 180;
    polygon.coordinates[0].push([mercatorPosition[0] + radius * Math.cos(radians), mercatorPosition[1] + radius * Math.sin(radians)]);
  }
  polygon.coordinates = closedPolygon(polygon.coordinates);

  return toGeographic(polygon);
};
