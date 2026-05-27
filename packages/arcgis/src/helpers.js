/* Copyright (c) 2012-2019 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { pointsEqual } from '@terraformer/common';

// checks if the first and last points of a ring are equal and closes the ring
export const closeRing = (coordinates) => {
  if (!pointsEqual(coordinates[0], coordinates[coordinates.length - 1])) {
    coordinates.push(coordinates[0]);
  }
  return coordinates;
};

// determine if polygon ring coordinates are clockwise. clockwise signifies outer ring, counter-clockwise an inner ring
// or hole. this logic was found at http://stackoverflow.com/questions/1165647/how-to-determine-if-a-list-of-polygon-
// points-are-in-clockwise-order
export const ringIsClockwise = (ringToTest) => {
  let total = 0;
  let i = 0;
  const rLength = ringToTest.length;
  let pt1 = ringToTest[i];
  let pt2;
  for (i; i < rLength - 1; i++) {
    pt2 = ringToTest[i + 1];
    total += (pt2[0] - pt1[0]) * (pt2[1] + pt1[1]);
    pt1 = pt2;
  }
  return (total >= 0);
};

// This function ensures that rings are oriented in the right directions
// outer rings are clockwise, holes are counterclockwise
// used for converting GeoJSON Polygons to ArcGIS Polygons
export const orientRings = (poly) => {
  const output = [];
  const polygon = poly.slice(0);
  const outerRing = closeRing(polygon.shift().slice(0));
  if (outerRing.length >= 4) {
    if (!ringIsClockwise(outerRing)) {
      outerRing.reverse();
    }

    output.push(outerRing);

    for (let i = 0; i < polygon.length; i++) {
      const hole = closeRing(polygon[i].slice(0));
      if (hole.length >= 4) {
        if (ringIsClockwise(hole)) {
          hole.reverse();
        }
        output.push(hole);
      }
    }
  }

  return output;
};

// This function flattens holes in multipolygons to one array of polygons
// used for converting GeoJSON Polygons to ArcGIS Polygons
export const flattenMultiPolygonRings = (rings) => {
  const output = [];
  for (let i = 0; i < rings.length; i++) {
    const polygon = orientRings(rings[i]);
    for (let x = polygon.length - 1; x >= 0; x--) {
      const ring = polygon[x].slice(0);
      output.push(ring);
    }
  }
  return output;
};

// shallow object clone for feature properties and attributes
// from http://jsperf.com/cloning-an-object/2
export const shallowClone = (obj) => {
  const target = {};
  for (const i in obj) {
    // both arcgis attributes and geojson props are just hardcoded keys
    if (obj.hasOwnProperty(i)) { // eslint-disable-line no-prototype-builtins
      target[i] = obj[i];
    }
  }
  return target;
};
