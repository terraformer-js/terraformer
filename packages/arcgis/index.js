/* Copyright (c) 2012-2019 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

/** @module @terraformer/arcgis */

import {
  pointsEqual,
  arrayIntersectsArray,
  coordinatesContainPoint
} from '@terraformer/common';

// checks if the first and last points of a ring are equal and closes the ring
const closeRing = (coordinates) => {
  if (!pointsEqual(coordinates[0], coordinates[coordinates.length - 1])) {
    coordinates.push(coordinates[0]);
  }
  return coordinates;
};

// determine if polygon ring coordinates are clockwise. clockwise signifies outer ring, counter-clockwise an inner ring
// or hole. this logic was found at http://stackoverflow.com/questions/1165647/how-to-determine-if-a-list-of-polygon-
// points-are-in-clockwise-order
const ringIsClockwise = (ringToTest) => {
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

const coordinatesContainCoordinates = (outer, inner) => {
  var intersects = arrayIntersectsArray(outer, inner);
  var contains = coordinatesContainPoint(outer, inner[0]);
  if (!intersects && contains) {
    return true;
  }
  return false;
};

// do any polygons in this array contain any other polygons in this array?
// used for checking for holes in arcgis rings
const convertRingsToGeoJSON = (rings) => {
  var outerRings = [];
  var holes = [];
  var x; // iterator
  var outerRing; // current outer ring being evaluated
  var hole; // current hole being evaluated

  // for each ring
  for (var r = 0; r < rings.length; r++) {
    var ring = closeRing(rings[r].slice(0));
    if (ring.length < 4) {
      continue;
    }
    // is this ring an outer ring? is it clockwise?
    if (ringIsClockwise(ring)) {
      var polygon = [ ring.slice().reverse() ]; // wind outer rings counterclockwise for RFC 7946 compliance
      outerRings.push(polygon); // push to outer rings
    } else {
      holes.push(ring.slice().reverse()); // wind inner rings clockwise for RFC 7946 compliance
    }
  }

  var uncontainedHoles = [];

  // while there are holes left...
  while (holes.length) {
    // pop a hole off out stack
    hole = holes.pop();

    // loop over all outer rings and see if they contain our hole.
    var contained = false;
    for (x = outerRings.length - 1; x >= 0; x--) {
      outerRing = outerRings[x][0];
      if (coordinatesContainCoordinates(outerRing, hole)) {
        // the hole is contained push it into our polygon
        outerRings[x].push(hole);
        contained = true;
        break;
      }
    }

    // ring is not contained in any outer ring
    // sometimes this happens https://github.com/Esri/esri-leaflet/issues/320
    if (!contained) {
      uncontainedHoles.push(hole);
    }
  }

  // if we couldn't match any holes using contains we can try intersects...
  while (uncontainedHoles.length) {
    // pop a hole off out stack
    hole = uncontainedHoles.pop();

    // loop over all outer rings and see if any intersect our hole.
    var intersects = false;

    for (x = outerRings.length - 1; x >= 0; x--) {
      outerRing = outerRings[x][0];
      if (arrayIntersectsArray(outerRing, hole)) {
        // the hole is contained push it into our polygon
        outerRings[x].push(hole);
        intersects = true;
        break;
      }
    }

    if (!intersects) {
      outerRings.push([hole.reverse()]);
    }
  }

  if (outerRings.length === 1) {
    return {
      type: 'Polygon',
      coordinates: outerRings[0]
    };
  } else {
    return {
      type: 'MultiPolygon',
      coordinates: outerRings
    };
  }
};

// This function ensures that rings are oriented in the right directions
// outer rings are clockwise, holes are counterclockwise
// used for converting GeoJSON Polygons to ArcGIS Polygons
const orientRings = (poly) => {
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
const flattenMultiPolygonRings = (rings) => {
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
const shallowClone = (obj) => {
  var target = {};
  for (var i in obj) {
    if (obj.hasOwnProperty(i)) {
      target[i] = obj[i];
    }
  }
  return target;
};

const getId = (attributes, idAttribute) => {
  var keys = idAttribute ? [idAttribute, 'OBJECTID', 'FID'] : ['OBJECTID', 'FID'];
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    if (
      key in attributes &&
      (typeof attributes[key] === 'string' ||
        typeof attributes[key] === 'number')
    ) {
      return attributes[key];
    }
  }
  throw Error('No valid id attribute found');
};

/**
 * Converts ArcGIS JSON into GeoJSON.
 * @param {object} JSON - The input geometry, feature or feature collection.
 * @param {string} idAttribute? - When converting an ArcGIS Feature its attributes will contain the ID of the feature. If something other than OBJECTID or FID stores the ID, you should pass through the fieldname explicitly.
 * @return {object} GeoJSON.
 */
export const arcgisToGeoJSON = (arcgis, idAttribute) => {
  var geojson = {};

  if (arcgis.features) {
    geojson.type = 'FeatureCollection';
    geojson.features = [];
    for (var i = 0; i < arcgis.features.length; i++) {
      geojson.features.push(arcgisToGeoJSON(arcgis.features[i], idAttribute));
    }
  }

  if (typeof arcgis.x === 'number' && typeof arcgis.y === 'number') {
    geojson.type = 'Point';
    geojson.coordinates = [arcgis.x, arcgis.y];
    if (typeof arcgis.z === 'number') {
      geojson.coordinates.push(arcgis.z);
    }
  }

  if (arcgis.points) {
    geojson.type = 'MultiPoint';
    geojson.coordinates = arcgis.points.slice(0);
  }

  if (arcgis.paths) {
    if (arcgis.paths.length === 1) {
      geojson.type = 'LineString';
      geojson.coordinates = arcgis.paths[0].slice(0);
    } else {
      geojson.type = 'MultiLineString';
      geojson.coordinates = arcgis.paths.slice(0);
    }
  }

  if (arcgis.rings) {
    geojson = convertRingsToGeoJSON(arcgis.rings.slice(0));
  }

  if (
    typeof arcgis.xmin === 'number' &&
    typeof arcgis.ymin === 'number' &&
    typeof arcgis.xmax === 'number' &&
    typeof arcgis.ymax === 'number'
  ) {
    geojson.type = 'Polygon';
    geojson.coordinates = [[
      [arcgis.xmax, arcgis.ymax],
      [arcgis.xmin, arcgis.ymax],
      [arcgis.xmin, arcgis.ymin],
      [arcgis.xmax, arcgis.ymin],
      [arcgis.xmax, arcgis.ymax]
    ]];
  }

  if (arcgis.geometry || arcgis.attributes) {
    geojson.type = 'Feature';
    geojson.geometry = (arcgis.geometry) ? arcgisToGeoJSON(arcgis.geometry) : null;
    geojson.properties = (arcgis.attributes) ? shallowClone(arcgis.attributes) : null;
    if (arcgis.attributes) {
      try {
        geojson.id = getId(arcgis.attributes, idAttribute);
      } catch (err) {
        // don't set an id
      }
    }
  }

  // if no valid geometry was encountered
  if (JSON.stringify(geojson.geometry) === JSON.stringify({})) {
    geojson.geometry = null;
  }

  if (
    arcgis.spatialReference &&
    arcgis.spatialReference.wkid &&
    arcgis.spatialReference.wkid !== 4326
  ) {
    console.warn('Object converted in non-standard crs - ' + JSON.stringify(arcgis.spatialReference));
  }

  return geojson;
};

/**
 * Converts GeoJSON into ArcGIS JSON.
 * @param {object} JSON - The input GeoJSON geometry, feature, geometry collection or feature collection.
 * @param {string} idAttribute? - When converting GeoJSON features, the id will be set as the OBJECTID unless another fieldname is supplied.
 * @return {object} ArcGIS JSON.
 */
export const geojsonToArcGIS = (geojson, idAttribute) => {
  idAttribute = idAttribute || 'OBJECTID';
  var spatialReference = { wkid: 4326 };
  var result = {};
  var i;

  switch (geojson.type) {
    case 'Point':
      result.x = geojson.coordinates[0];
      result.y = geojson.coordinates[1];
      result.spatialReference = spatialReference;
      break;
    case 'MultiPoint':
      result.points = geojson.coordinates.slice(0);
      result.spatialReference = spatialReference;
      break;
    case 'LineString':
      result.paths = [geojson.coordinates.slice(0)];
      result.spatialReference = spatialReference;
      break;
    case 'MultiLineString':
      result.paths = geojson.coordinates.slice(0);
      result.spatialReference = spatialReference;
      break;
    case 'Polygon':
      result.rings = orientRings(geojson.coordinates.slice(0));
      result.spatialReference = spatialReference;
      break;
    case 'MultiPolygon':
      result.rings = flattenMultiPolygonRings(geojson.coordinates.slice(0));
      result.spatialReference = spatialReference;
      break;
    case 'Feature':
      if (geojson.geometry) {
        result.geometry = geojsonToArcGIS(geojson.geometry, idAttribute);
      }
      result.attributes = (geojson.properties) ? shallowClone(geojson.properties) : {};
      if (geojson.id) {
        result.attributes[idAttribute] = geojson.id;
      }
      break;
    case 'FeatureCollection':
      result = [];
      for (i = 0; i < geojson.features.length; i++) {
        result.push(geojsonToArcGIS(geojson.features[i], idAttribute));
      }
      break;
    case 'GeometryCollection':
      result = [];
      for (i = 0; i < geojson.geometries.length; i++) {
        result.push(geojsonToArcGIS(geojson.geometries[i], idAttribute));
      }
      break;
  }

  return result;
};
