/* Copyright (c) 2012-2019 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import {
  closeRing,
  ringIsClockwise,
  shallowClone
} from './helpers';

// This function ensures that rings are oriented in the right directions
// outer rings are clockwise, holes are counterclockwise
// used for converting GeoJSON Polygons to ArcGIS Polygons
const orientRings = (poly) => {
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
const flattenMultiPolygonRings = (rings) => {
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

export const geojsonToArcGIS = (geojson, idAttribute) => {
  idAttribute = idAttribute || 'OBJECTID';
  const spatialReference = { wkid: 4326 };
  let result = {};
  let i;

  switch (geojson.type) {
    case 'Point':
      result.x = geojson.coordinates[0];
      result.y = geojson.coordinates[1];
      if (geojson.coordinates[2] != null) {
        result.z = geojson.coordinates[2];
      }
      result.spatialReference = spatialReference;
      break;
    case 'MultiPoint':
      result.points = geojson.coordinates.slice(0);
      if (geojson.coordinates[0][2] != null) {
        result.hasZ = true;
      }
      result.spatialReference = spatialReference;
      break;
    case 'LineString':
      result.paths = [geojson.coordinates.slice(0)];
      if (geojson.coordinates[0][2] != null) {
        result.hasZ = true;
      }
      result.spatialReference = spatialReference;
      break;
    case 'MultiLineString':
      result.paths = geojson.coordinates.slice(0);
      if (geojson.coordinates[0][0][2] != null) {
        result.hasZ = true;
      }
      result.spatialReference = spatialReference;
      break;
    case 'Polygon':
      result.rings = orientRings(geojson.coordinates.slice(0));
      if (geojson.coordinates[0][0][2] != null) {
        result.hasZ = true;
      }
      result.spatialReference = spatialReference;
      break;
    case 'MultiPolygon':
      result.rings = flattenMultiPolygonRings(geojson.coordinates.slice(0));
      if (geojson.coordinates[0][0][0][2] != null) {
        result.hasZ = true;
      }
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
