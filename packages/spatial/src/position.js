import {
  degToRad,
  radToDeg
} from './util';

import {
  EARTH_RADIUS
} from './constants';

export const positionToGeographic = (position) => {
  const x = position[0];
  const y = position[1];
  return [radToDeg(x / EARTH_RADIUS) - (Math.floor((radToDeg(x / EARTH_RADIUS) + 180) / 360) * 360), radToDeg((Math.PI / 2) - (2 * Math.atan(Math.exp(-1.0 * y / EARTH_RADIUS))))];
};

export const positionToMercator = (position) => {
  const lng = position[0];
  const lat = Math.max(Math.min(position[1], 89.99999), -89.99999);
  return [degToRad(lng) * EARTH_RADIUS, EARTH_RADIUS / 2.0 * Math.log((1.0 + Math.sin(degToRad(lat))) / (1.0 - Math.sin(degToRad(lat))))];
};
