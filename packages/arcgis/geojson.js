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

/**
 * Converts [GeoJSON](https://tools.ietf.org/html/rfc7946) into ArcGIS JSON.
 * @function
 * @param {object} GeoJSON - The input [GeoJSON](https://tools.ietf.org/html/rfc7946) Geometry, Feature, GeometryCollection or ReatureCollection.
 * @param {string} [idAttribute] - When converting GeoJSON features, the id will be set as the OBJECTID unless another fieldname is supplied.
 * @return {object} ArcGIS JSON.
 * ```js
 * import { geojsonToArcGIS } from "@terraformer/arcgis"
 *
 * geojsonToArcGIS({
 *   "type": "Point",
 *   "coordinates": [45.5165, -122.6764]
 * })
 *
 * >> { "x":-122.6764, "y":45.5165, "spatialReference": { "wkid": 4326 } }
 * ```
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
