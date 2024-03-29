/* Copyright (c) 2012-2019 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

/** @module Terraformer */

import { calculateBounds } from './bounds';
import { positionToMercator } from './position';
import { applyConverter } from './util';

export {
  /**
   * Runs the passed function against every Coordinate in the geojson object.
   * @function
   * @param {object} GeoJSON - The input [GeoJSON](https://tools.ietf.org/html/rfc7946) Geometry, Feature, GeometryCollection or FeatureCollection.
   * @param {function} function - Your function will be passed a Coordinate and will be expected to return a Coordinate.
   * @return {object} GeoJSON - [GeoJSON](https://tools.ietf.org/html/rfc7946) with altered coordinates.
   * ```js
   * import { applyConverter } from "@terraformer/spatial"
   *
   * applyConverter({
   *   type: "Point",
   *   coordinates: [ 45, 60 ]
   * }, (coord) => [coord[0] + 1, coord[1] - 1])
   *
   * >> { type: "Point", coordinates: [ 46, 59 ] }
   * ```
   */
  applyConverter
} from './util';

export {
  /**
   * Calculate the bounding box of the input.
   * @function
   * @param {object} GeoJSON - The input [GeoJSON](https://tools.ietf.org/html/rfc7946) Geometry, Feature, GeometryCollection or FeatureCollection.
   * @return {Array.<Number>} [ xmin, ymin, xmax, ymax ].
   * ```js
   * import { calculateBounds } from "@terraformer/spatial"
   *
   * calculateBounds({
   *   type: "Point",
   *   coordinates: [ 45, 60 ]
   * })
   *
   * >> [45, 60, 45, 60]
   * ```
   */
  calculateBounds
} from './bounds';

export {
  /**
   * WKID [3857](https://epsg.io/3857)
   * @constant
   */
  MercatorCRS
} from './constants';

export {
  /**
   * WKID [4326](https://epsg.io/4326)
   * @constant
   */
  GeographicCRS
} from './constants';

/**
 * Calculate the envelope surrounding the input.
 * @function
 * @param {object} GeoJSON - The input [GeoJSON](https://tools.ietf.org/html/rfc7946) Geometry, Feature, GeometryCollection or FeatureCollection.
 * @return {Object} Object in the form { x, y, w, h }.
 * ```js
 * import { calculateEnvelope } from "@terraformer/spatial"
 *
 * calculateEnvelope({
 *   type: "Point",
 *   coordinates: [ 100, 100 ]
 * })
 *
 * >> { x: 100, y: 100, w: 0, h: 0, }
 * ```
 */
export const calculateEnvelope = (geojson) => {
  const bounds = calculateBounds(geojson);
  return {
    x: bounds[0],
    y: bounds[1],
    w: Math.abs(bounds[0] - bounds[2]),
    h: Math.abs(bounds[1] - bounds[3])
  };
};

export {
  /**
   * Reprojects the passed Coordinate pair to WGS84 (4326) spatial reference.
   * @function
   * @param {Array.<Number,Number>} CoordinatePair - An X,Y position.
   * @return {Array.<Number,Number>} CoordinatePair.
   * ```js
   * import { positionToGeographic } from "@terraformer/spatial"
   *
   * positionToGeographic([ -13580978, 5621521 ]) // [ 45, 60  ]
   * ```
   */
  positionToGeographic
} from './position';

export {
  /**
   * Reprojects the passed Coordinate pair to web mercator (3857) spatial reference.
   * @function
   * @param {Array.<Number,Number>} CoordinatePair - An X,Y position.
   * @return {Array.<Number,Number>} CoordinatePair.
   * ```js
   * import { positionToGeographic } from "@terraformer/spatial"
   *
   * positionToMercator([ 45, 60 ]) // [ -13580978, 5621521  ]
   * ```
   */
  positionToMercator
} from './position';

/**
 * Reproject WGS84 (Lat/Lng) GeoJSON to Web Mercator.
 * @function
 * @param {object} GeoJSON - The input [GeoJSON](https://tools.ietf.org/html/rfc7946) Geometry, Feature, GeometryCollection or FeatureCollection.
 * @return {object} GeoJSON
 * ```js
 * import { toMercator } from "@terraformer/spatial"
 *
 * toMercator({
 *   type: "Point",
 *   coordinates: [ 45, 60 ]
 * })
 *
 * >> { type: "Point", coordinates: [ -13580978, 5621521 ], crs }
 * ```
 */
export const toMercator = (geojson) => applyConverter(geojson, positionToMercator);

export {
  /**
   * Calculate the [convex hull](https://en.wikipedia.org/wiki/Convex_hull) of GeoJSON input.
   * @function
   * @param {object} GeoJSON - The input [GeoJSON](https://tools.ietf.org/html/rfc7946) Geometry, Feature, GeometryCollection or FeatureCollection.
   * @return {Array.<Coordinates>} An array of GeoJSON coordinates representing the convex hull of the input GeoJSON.
   * ```js
   * import { convexHull } from "@terraformer/spatial"
   *
   * convexHull({
   *   type: "LineString",
   *   coordinates: [
   *     [ 100, 0 ], [ -45, 122 ], [ 80, -60 ]
   *   ]
   * })
   *
   * >>
   * {
   *   type: "Polygon",
   *   coordinates: [
   *     [ [ 100, 0 ], [ -45, 122 ], [ 80, -60 ], [ 100, 0 ] ]
   *   ]
   * }
   * ```
   */
  convexHull
} from './convex';

export {
  /**
   * Determine whether input GeoJSON has a [convex](https://en.wikipedia.org/wiki/Convex_set) shape.
   * @function
   * @param {Object} GeoJSON - The input [GeoJSON](https://tools.ietf.org/html/rfc7946) Geometry, Feature, GeometryCollection or FeatureCollection.
   * @return {Boolean} Yes/No
   * ```js
   * import { isConvex } from "@terraformer/spatial"
   *
   * isConvex({
   *   type: "Polygon",
   *   coordinates: [
   *     [ [ 100, 0 ], [ -45, 122 ], [ 80, -60 ], [ 100, 0 ] ]
   *   ]
   * })
   *
   * >> true
   * ```
   */
  isConvex
} from './convex';

export {
  /**
   * Accepts the geometry of a polygon and point and returns `true` if the point falls within the polygon.
   * @function
   * @param {Object} GeoJSON - [GeoJSON Polygon](https://tools.ietf.org/html/rfc7946#section-3.1.6) coordinates.
   * @param {Object} GeoJSON - [GeoJSON Point](https://tools.ietf.org/html/rfc7946#section-3.1.2) coordinates.
   * @return {Boolean} Yes/No
   * ```js
   * import { polygonContainsPoint } from "@terraformer/spatial"
   *
   * polygonContainsPoint(
   *   [
   *     [ [ 1, 2 ], [ 2, 2 ], [ 2, 1 ], [ 1, 1 ], [ 1, 2 ] ]
   *   ],
   *   [ 10, 10 ]
   * )
   *
   * >> false
   * ```
   */
  polygonContainsPoint
} from './polygon';

// to do: expose a close() method?

export {
  /**
   * Returns `true` if the GeoJSON passed as the first argument is completely inside the GeoJSON object passed in the second position.
   * @function
   * @param {Object} GeoJSON - [GeoJSON](https://tools.ietf.org/html) that may be within the second input.
   * @param {Object} GeoJSON - [GeoJSON](https://tools.ietf.org/html/rfc7946#section-3.1.2) that may contain the first input.
   * @return {Boolean} Yes/No
   * ```js
   * import { within } from "@terraformer/spatial"
   *
   * within({
   *   type: "Point",
   *   coordinates: [ 10, 10 ]
   * },
   * {
   *   type: "Polygon",
   *   coordinates: [
   *     [ [ 5, 5 ], [ 5, 15 ], [ 15, 15 ], [ 15, 5 ], [ 5, 5 ] ]
   *   ]
   * })
   *
   * >> true
   * ```
   */
  within
} from './within';

export {
  /**
   * Returns `true` if the GeoJSON passed as the second argument is completely inside the GeoJSON object passed in the first position.
   * @function
   * @param {Object} GeoJSON - [GeoJSON](https://tools.ietf.org/html) that may contain the second input.
   * @param {Object} GeoJSON - [GeoJSON](https://tools.ietf.org/html/rfc7946#section-3.1.2) that may be contained by the first input.
   * @return {Boolean} Yes/No
   * ```js
   * import { contains } from "@terraformer/spatial"
   *
   * contains({
   *   type: "Polygon",
   *   coordinates: [
   *     [ [ 5, 5 ], [ 5, 15 ], [ 15, 15 ], [ 15, 5 ], [ 5, 5 ] ]
   * ]},
   * {
   *   type: "Point",
   *   coordinates: [ 10, 10 ]
   * })
   *
   * >> true
   * ```
   */
  contains
} from './contains';

export {
  /**
   * Returns `true` if the two input GeoJSON objects intersect one another.
   * @function
   * @param {Object} GeoJSON - The input [GeoJSON](https://tools.ietf.org/html/rfc7946) Geometry, Feature, GeometryCollection or FeatureCollection.
   * @param {Object} GeoJSON - The input [GeoJSON](https://tools.ietf.org/html/rfc7946) Geometry, Feature, GeometryCollection or FeatureCollection.
   * @return {Boolean} Yes/No
   * ```js
   * import { intersects } from "@terraformer/spatial"
   *
   * intersects({
   *   type: "Point",
   *   coordinates: [ 10, 10 ]
   * },
   * {
   *   type: "Polygon",
   *   coordinates: [
   *     [ [ 5, 5 ], [ 5, 15 ], [ 15, 15 ], [ 15, 5 ], [ 5, 5 ] ]
   *   ]
   * })
   *
   * >> true
   * ```
   */
  intersects
} from './intersects';

export {
  /**
   * Uses an input Coordinate pair to create a GeoJSON Feature containing a Polygon representing a circle with a discrete number of sides.
   * @function
   * @param {Array<Number,Number>} CoordinatePair - A GeoJSON Coordinate in `[x,y]` format.
   * @param {Number} [Radius=250] - The radius of the circle (in meters).
   * @param {Number} [Steps=64] - The number of sides the output polygon will contain.
   * @return {object} GeoJSON
   * ```js
   * import { toCircle } from "@terraformer/spatial"
   *
   * toCircle([ -118, 34 ], 500)
   *
   * >> { type: "Feature", geometry: { type: "Polygon"}, coordinates: [...] }
   * ```
   */
  toCircle,
  /**
   * Reproject Web Mercator GeoJSON to WGS84 (Lat/Long).
   * @function
   * @param {object} GeoJSON - The input [GeoJSON](https://tools.ietf.org/html/rfc7946) Geometry, Feature, GeometryCollection or FeatureCollection.
   * @return {object} GeoJSON
   * ```js
   * import { toGeographic } from "@terraformer/spatial"
   *
   * toGeographic({
   *   type: "Point",
   *   coordinates: [ -13580978, 5621521 ]
   * })
   *
   * >> { type: "Point", coordinates: [ 45, 60 ] }
   * ```
   */
  toGeographic
} from './circle';
