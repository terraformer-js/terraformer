/* Copyright (c) 2012-2019 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

/** @module @terraformer/arcgis */

// we intentionally dont export the helper functions

export {
  /**
   * Converts [ArcGIS JSON](https://developers.arcgis.com/documentation/core-concepts/features-and-geometries/) into GeoJSON.
   * @function
   * @param {object} JSON - The input ArcGIS geometry, feature or feature collection.
   * @param {string} [idAttribute] - When converting an ArcGIS Feature its attributes will contain the ID of the feature. If something other than OBJECTID or FID stores the ID, you should pass through the fieldname explicitly.
   * @return {object} GeoJSON.
   * ```js
   * import { arcgisToGeoJSON } from "@terraformer/arcgis"
   *
   * arcgisToGeoJSON({
   *   "x":-122.6764,
   *   "y":45.5165,
   *   "spatialReference": {
   *     "wkid": 4326
   *   }
   * });
   *
   * >> { "type": "Point", "coordinates": [ -122.6764, 45.5165 ] }
   * ```
   */
  arcgisToGeoJSON
} from './arcgis';

export {
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
  geojsonToArcGIS
} from './geojson';
