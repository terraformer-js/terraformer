import { pointsEqual } from '@terraformer/common';

import {
  DEGREES_PER_RADIAN,
  RADIANS_PER_DEGREE,
  MercatorCRS
} from './constants';

import { positionToMercator, positionToGeographic } from './position';

/*
Internal: used for sorting
*/
export const compSort = (p1, p2) => {
  if (p1[0] > p2[0]) {
    return -1;
  } else if (p1[0] < p2[0]) {
    return 1;
  } else if (p1[1] > p2[1]) {
    return -1;
  } else if (p1[1] < p2[1]) {
    return 1;
  } else {
    return 0;
  }
};

/*
  Internal: -1,0,1 comparison function
  */
const cmp = (a, b) => {
  if (a < b) {
    return -1;
  } else if (a > b) {
    return 1;
  } else {
    return 0;
  }
};

/*
  Internal: used to determine turn
  */
const turn = (p, q, r) => {
  // Returns -1, 0, 1 if p,q,r forms a right, straight, or left turn.
  return cmp((q[0] - p[0]) * (r[1] - p[1]) - (r[0] - p[0]) * (q[1] - p[1]), 0);
};

/*
  Internal: used to determine euclidean distance between two points
  */
const euclideanDistance = (p, q) => {
  // Returns the squared Euclidean distance between p and q.
  const dx = q[0] - p[0];
  const dy = q[1] - p[1];

  return dx * dx + dy * dy;
};

const nextHullPoint = (points, p) => {
  // Returns the next point on the convex hull in CCW from p.
  let q = p;
  for (let r in points) {
    const t = turn(p, q, points[r]);
    if (t === -1 || (t === 0 && euclideanDistance(p, points[r]) > euclideanDistance(p, q))) {
      q = points[r];
    }
  }
  return q;
};

export const coordinateConvexHull = (points) => {
  // implementation of the Jarvis March algorithm
  // adapted from http://tixxit.wordpress.com/2009/12/09/jarvis-march/

  if (points.length === 0) {
    return [];
  } else if (points.length === 1) {
    return points;
  }

  // Returns the points on the convex hull of points in CCW order.
  let hull = [points.sort(compSort)[0]];

  for (var p = 0; p < hull.length; p++) {
    const q = nextHullPoint(points, hull[p]);

    if (q !== hull[0]) {
      hull.push(q);
    }
  }

  return hull;
};

/*
Internal: Returns a copy of coordinates for a closed polygon
*/
export const closedPolygon = (coordinates) => {
  let outer = [];

  for (let i = 0; i < coordinates.length; i++) {
    let inner = coordinates[i].slice();
    if (pointsEqual(inner[0], inner[inner.length - 1]) === false) {
      inner.push(inner[0]);
    }

    outer.push(inner);
  }

  return outer;
};

/*
Internal: safe warning
*/
export function warn () {
  const args = Array.prototype.slice.apply(arguments);

  if (typeof console !== 'undefined' && console.warn) {
    console.warn.apply(console, args);
  }
}

export const hasHoles = (geojson) => geojson.coordinates.length > 1;

/*
Internal: Convert radians to degrees. Used by spatial reference converters.
*/
export const radToDeg = (rad) => {
  return rad * DEGREES_PER_RADIAN;
};

/*
Internal: Convert degrees to radians. Used by spatial reference converters.
*/
export const degToRad = (deg) => {
  return deg * RADIANS_PER_DEGREE;
};

/*
Internal: Loop over each array in a geojson object and apply a function to it. Used by spatial reference converters.
*/
const eachPosition = (coordinates, func) => {
  for (let i = 0; i < coordinates.length; i++) {
    // we found a number so lets convert the pair
    if (typeof coordinates[i][0] === 'number') {
      coordinates[i] = func(coordinates[i]);
    }
    // we found an coordinates array it again and run the function against it
    if (typeof coordinates[i] === 'object') {
      coordinates[i] = eachPosition(coordinates[i], func);
    }
  }
  return coordinates;
};

/*
Apply a function agaist all positions in a geojson object. Used by spatial reference converters.
*/
export const applyConverter = (geojson, converter, noCrs) => {
  if (geojson.type === 'Point') {
    geojson.coordinates = converter(geojson.coordinates);
  } else if (geojson.type === 'Feature') {
    geojson.geometry = applyConverter(geojson.geometry, converter, true);
  } else if (geojson.type === 'FeatureCollection') {
    for (let f = 0; f < geojson.features.length; f++) {
      geojson.features[f] = applyConverter(geojson.features[f], converter, true);
    }
  } else if (geojson.type === 'GeometryCollection') {
    for (let g = 0; g < geojson.geometries.length; g++) {
      geojson.geometries[g] = applyConverter(geojson.geometries[g], converter, true);
    }
  } else {
    geojson.coordinates = eachPosition(geojson.coordinates, converter);
  }

  if (!noCrs) {
    if (converter === positionToMercator) {
      geojson.crs = MercatorCRS;
    }
  }

  if (converter === positionToGeographic) {
    delete geojson.crs;
  }

  return geojson;
};

export const coordinatesEqual = (a, b) => {
  if (a.length !== b.length) {
    return false;
  }

  const na = a.slice().sort(compSort);
  const nb = b.slice().sort(compSort);

  for (let i = 0; i < na.length; i++) {
    if (na[i].length !== nb[i].length) {
      return false;
    }
    for (let j = 0; j < na.length; j++) {
      if (na[i][j] !== nb[i][j]) {
        return false;
      }
    }
  }

  return true;
};
