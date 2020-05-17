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
  var total = 0;
  var i = 0;
  var rLength = ringToTest.length;
  var pt1 = ringToTest[i];
  var pt2;
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
  var output = [];
  var polygon = poly.slice(0);
  var outerRing = closeRing(polygon.shift().slice(0));
  if (outerRing.length >= 4) {
    if (!ringIsClockwise(outerRing)) {
      outerRing.reverse();
    }

    output.push(outerRing);

    for (var i = 0; i < polygon.length; i++) {
      var hole = closeRing(polygon[i].slice(0));
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
  var output = [];
  for (var i = 0; i < rings.length; i++) {
    var polygon = orientRings(rings[i]);
    for (var x = polygon.length - 1; x >= 0; x--) {
      var ring = polygon[x].slice(0);
      output.push(ring);
    }
  }
  return output;
};

// shallow object clone for feature properties and attributes
// from http://jsperf.com/cloning-an-object/2
export const shallowClone = (obj) => {
  var target = {};
  for (var i in obj) {
    // both arcgis attributes and geojson props are just hardcoded keys
    if (obj.hasOwnProperty(i)) { // eslint-disable-line no-prototype-builtins
      target[i] = obj[i];
    }
  }
  return target;
};
