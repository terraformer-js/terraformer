/* Copyright (c) 2012-2019 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

/** @module @terraformer/spatial */

import {
  coordinatesContainPoint,
  pointsEqual,
  arraysIntersectArrays
} from '@terraformer/common';

const EarthRadius = 6378137;
const DegreesPerRadian = 57.295779513082320;
const RadiansPerDegree = 0.017453292519943;

export const MercatorCRS = {
  'type': 'link',
  'properties': {
    'href': 'http://spatialreference.org/ref/sr-org/6928/ogcwkt/',
    'type': 'ogcwkt'
  }
};

export const GeographicCRS = {
  'type': 'link',
  'properties': {
    'href': 'http://spatialreference.org/ref/epsg/4326/ogcwkt/',
    'type': 'ogcwkt'
  }
};

/*
Internal: safe warning
*/
function warn () {
  const args = Array.prototype.slice.apply(arguments);

  if (typeof console !== 'undefined' && console.warn) {
    console.warn.apply(console, args);
  }
}

export const hasHoles = (geojson) => geojson.coordinates.length > 1;

/**
 * Returns the envelope surrounding a GeoJSON input.
 * @param {object} JSON - The input GeoJSON geometry, feature, geometry collection or feature collection.
 * @return {object} in the form { w, y, w, h }.
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

/*
  Calculate an bounding box for a geojson object
*/
export const calculateBounds = (geojson) => {
  if (geojson.type) {
    switch (geojson.type) {
      case 'Point':
        return [geojson.coordinates[0], geojson.coordinates[1], geojson.coordinates[0], geojson.coordinates[1]];

      case 'MultiPoint':
        return calculateBoundsFromArray(geojson.coordinates);

      case 'LineString':
        return calculateBoundsFromArray(geojson.coordinates);

      case 'MultiLineString':
        return calculateBoundsFromNestedArrays(geojson.coordinates);

      case 'Polygon':
        return calculateBoundsFromNestedArrays(geojson.coordinates);

      case 'MultiPolygon':
        return calculateBoundsFromNestedArrayOfArrays(geojson.coordinates);

      case 'Feature':
        return geojson.geometry ? calculateBounds(geojson.geometry) : null;

      case 'FeatureCollection':
        return calculateBoundsForFeatureCollection(geojson);

      case 'GeometryCollection':
        return calculateBoundsForGeometryCollection(geojson);

      default:
        throw new Error('Unknown type: ' + geojson.type);
    }
  }
  return null;
};

/*
Internal: Calculate an bounding box from an nested array of positions
[
  [
    [ [lng, lat],[lng, lat],[lng, lat] ]
  ]
  [
    [lng, lat],[lng, lat],[lng, lat]
  ]
  [
    [lng, lat],[lng, lat],[lng, lat]
  ]
]
*/
const calculateBoundsFromNestedArrays = (array) => {
  let x1 = null; let x2 = null; let y1 = null; let y2 = null;

  for (let i = 0; i < array.length; i++) {
    const inner = array[i];

    for (let j = 0; j < inner.length; j++) {
      const lonlat = inner[j];

      const lon = lonlat[0];
      const lat = lonlat[1];

      if (x1 === null) {
        x1 = lon;
      } else if (lon < x1) {
        x1 = lon;
      }

      if (x2 === null) {
        x2 = lon;
      } else if (lon > x2) {
        x2 = lon;
      }

      if (y1 === null) {
        y1 = lat;
      } else if (lat < y1) {
        y1 = lat;
      }

      if (y2 === null) {
        y2 = lat;
      } else if (lat > y2) {
        y2 = lat;
      }
    }
  }

  return [x1, y1, x2, y2];
};

/*
Internal: Calculate a bounding box from an array of arrays of arrays
[
  [ [lng, lat],[lng, lat],[lng, lat] ]
  [ [lng, lat],[lng, lat],[lng, lat] ]
  [ [lng, lat],[lng, lat],[lng, lat] ]
]
*/
const calculateBoundsFromNestedArrayOfArrays = (array) => {
  let x1 = null; let x2 = null; let y1 = null; let y2 = null;

  for (let i = 0; i < array.length; i++) {
    const inner = array[i];

    // return calculateBoundsFromNestedArrays(inner); // more DRY?
    for (let j = 0; j < inner.length; j++) {
      const innerinner = inner[j];

      for (let k = 0; k < innerinner.length; k++) {
        const lonlat = innerinner[k];

        const lon = lonlat[0];
        const lat = lonlat[1];

        if (x1 === null) {
          x1 = lon;
        } else if (lon < x1) {
          x1 = lon;
        }

        if (x2 === null) {
          x2 = lon;
        } else if (lon > x2) {
          x2 = lon;
        }

        if (y1 === null) {
          y1 = lat;
        } else if (lat < y1) {
          y1 = lat;
        }

        if (y2 === null) {
          y2 = lat;
        } else if (lat > y2) {
          y2 = lat;
        }
      }
    }
  }

  return [x1, y1, x2, y2];
};

/*
Internal: Calculate a bounding box from an array of positions
[
  [lng, lat],[lng, lat],[lng, lat]
]
*/
const calculateBoundsFromArray = (array) => {
  let x1 = null; let x2 = null; let y1 = null; let y2 = null;

  for (let i = 0; i < array.length; i++) {
    const lonlat = array[i];
    const lon = lonlat[0];
    const lat = lonlat[1];

    if (x1 === null) {
      x1 = lon;
    } else if (lon < x1) {
      x1 = lon;
    }

    if (x2 === null) {
      x2 = lon;
    } else if (lon > x2) {
      x2 = lon;
    }

    if (y1 === null) {
      y1 = lat;
    } else if (lat < y1) {
      y1 = lat;
    }

    if (y2 === null) {
      y2 = lat;
    } else if (lat > y2) {
      y2 = lat;
    }
  }

  return [x1, y1, x2, y2];
};

/*
Internal: Calculate an bounding box for a feature collection
*/
const calculateBoundsForFeatureCollection = (featureCollection) => {
  let extents = [];
  for (let i = featureCollection.features.length - 1; i >= 0; i--) {
    const extent = calculateBounds(featureCollection.features[i].geometry);
    extents.push([extent[0], extent[1]]);
    extents.push([extent[2], extent[3]]);
  }

  return calculateBoundsFromArray(extents);
};

/*
Internal: Calculate an bounding box for a geometry collection
*/
export const calculateBoundsForGeometryCollection = (geometryCollection) => {
  let extents = [];

  for (let i = geometryCollection.geometries.length - 1; i >= 0; i--) {
    const extent = calculateBounds(geometryCollection.geometries[i]);
    extents.push([extent[0], extent[1]]);
    extents.push([extent[2], extent[3]]);
  }

  return calculateBoundsFromArray(extents);
};

/*
Internal: Convert radians to degrees. Used by spatial reference converters.
*/
const radToDeg = (rad) => {
  return rad * DegreesPerRadian;
};

/*
Internal: Convert degrees to radians. Used by spatial reference converters.
*/
const degToRad = (deg) => {
  return deg * RadiansPerDegree;
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
Convert a GeoJSON Position object to Geographic (4326)
*/
export const positionToGeographic = (position) => {
  const x = position[0];
  const y = position[1];
  return [radToDeg(x / EarthRadius) - (Math.floor((radToDeg(x / EarthRadius) + 180) / 360) * 360), radToDeg((Math.PI / 2) - (2 * Math.atan(Math.exp(-1.0 * y / EarthRadius))))];
};

/*
Convert a GeoJSON Position object to Web Mercator (3857)
*/
export const positionToMercator = (position) => {
  const lng = position[0];
  const lat = Math.max(Math.min(position[1], 89.99999), -89.99999);
  return [degToRad(lng) * EarthRadius, EarthRadius / 2.0 * Math.log((1.0 + Math.sin(degToRad(lat))) / (1.0 - Math.sin(degToRad(lat))))];
};

/*
Apply a function agaist all positions in a geojson object. Used by spatial reference converters.
*/
const applyConverter = (geojson, converter, noCrs) => {
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

/*
Convert a GeoJSON object to ESRI Web Mercator (3857)
*/
export const toMercator = (geojson) => {
  return applyConverter(geojson, positionToMercator);
};

/*
Convert a GeoJSON object to Geographic coordinates (WSG84, 4326)
*/
export const toGeographic = (geojson) => {
  return applyConverter(geojson, positionToGeographic);
};

/*
Internal: used for sorting
*/
const compSort = (p1, p2) => {
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

const coordinateConvexHull = (points) => {
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

export const convexHull = (geojson) => {
  let coordinates = []; let i; let j;
  if (geojson.type === 'Point') {
    return null;
  } else if (geojson.type === 'LineString' || geojson.type === 'MultiPoint') {
    if (geojson.coordinates && geojson.coordinates.length >= 3) {
      coordinates = geojson.coordinates;
    } else {
      return null;
    }
  } else if (geojson.type === 'Polygon' || geojson.type === 'MultiLineString') {
    if (geojson.coordinates && geojson.coordinates.length > 0) {
      for (i = 0; i < geojson.coordinates.length; i++) {
        coordinates = coordinates.concat(geojson.coordinates[i]);
      }
      if (coordinates.length < 3) {
        return null;
      }
    } else {
      return null;
    }
  } else if (geojson.type === 'MultiPolygon') {
    if (geojson.coordinates && geojson.coordinates.length > 0) {
      for (i = 0; i < geojson.coordinates.length; i++) {
        for (j = 0; j < geojson.coordinates[i].length; j++) {
          coordinates = coordinates.concat(geojson.coordinates[i][j]);
        }
      }
      if (coordinates.length < 3) {
        return null;
      }
    } else {
      return null;
    }
  } else if (geojson.type === 'Feature') {
    return convexHull(geojson.geometry);
  }

  return {
    type: 'Polygon',
    coordinates: closedPolygon([coordinateConvexHull(coordinates)])
  };
};

export const isConvex = (points) => {
  let ltz;

  for (var i = 0; i < points.length - 3; i++) {
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2];
    const v = [p2[0] - p1[0], p2[1] - p1[1]];

    // p3.x * v.y - p3.y * v.x + v.x * p1.y - v.y * p1.x
    const res = p3[0] * v[1] - p3[1] * v[0] + v[0] * p1[1] - v[1] * p1[0];

    if (i === 0) {
      if (res < 0) {
        ltz = true;
      } else {
        ltz = false;
      }
    } else {
      if ((ltz && res > 0) || (!ltz && res < 0)) {
        return false;
      }
    }
  }

  return true;
};

export const polygonContainsPoint = (polygon, point) => {
  if (polygon && polygon.length) {
    if (polygon.length === 1) { // polygon with no holes
      return coordinatesContainPoint(polygon[0], point);
    } else { // polygon with holes
      if (coordinatesContainPoint(polygon[0], point)) {
        for (let i = 1; i < polygon.length; i++) {
          if (coordinatesContainPoint(polygon[i], point)) {
            return false; // found in hole
          }
        }

        return true;
      } else {
        return false;
      }
    }
  } else {
    return false;
  }
};

// to do: expose a close() method?

/*
Internal: Returns a copy of coordinates for a closed polygon
*/
const closedPolygon = (coordinates) => {
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

export const contains = (geoJSON, comparisonGeoJSON) => {
  return within(comparisonGeoJSON, geoJSON);
};

export const within = (geoJSON, comparisonGeoJSON) => {
  let coordinates, i, contains;

  // if we are passed a feature, use the polygon inside instead
  if (comparisonGeoJSON.type === 'Feature') {
    comparisonGeoJSON = comparisonGeoJSON.geometry;
  }

  // point.within(point) :: equality
  if (comparisonGeoJSON.type === 'Point') {
    if (geoJSON.type === 'Point') {
      return pointsEqual(geoJSON.coordinates, comparisonGeoJSON.coordinates);
    }
  }

  // point.within(multilinestring)
  if (comparisonGeoJSON.type === 'MultiLineString') {
    if (geoJSON.type === 'Point') {
      for (i = 0; i < geoJSON.coordinates.length; i++) {
        const linestring = { type: 'LineString', coordinates: comparisonGeoJSON.coordinates[i] };

        if (within(geoJSON, linestring)) {
          return true;
        }
      }
    }
  }

  // point.within(linestring), point.within(multipoint)
  if (comparisonGeoJSON.type === 'LineString' || comparisonGeoJSON.type === 'MultiPoint') {
    if (geoJSON.type === 'Point') {
      for (i = 0; i < comparisonGeoJSON.coordinates.length; i++) {
        if (geoJSON.coordinates.length !== comparisonGeoJSON.coordinates[i].length) {
          return false;
        }

        if (pointsEqual(geoJSON.coordinates, comparisonGeoJSON.coordinates[i])) {
          return true;
        }
      }
    }
  }

  if (comparisonGeoJSON.type === 'Polygon') {
    // polygon.within(polygon)
    if (geoJSON.type === 'Polygon') {
      // check for equal polygons
      if (comparisonGeoJSON.coordinates.length === geoJSON.coordinates.length) {
        for (i = 0; i < geoJSON.coordinates.length; i++) {
          if (coordinatesEqual(geoJSON.coordinates[i], comparisonGeoJSON.coordinates[i])) {
            return true;
          }
        }
      }

      if (geoJSON.coordinates.length && polygonContainsPoint(comparisonGeoJSON.coordinates, geoJSON.coordinates[0][0])) {
        return !arraysIntersectArrays(closedPolygon(geoJSON.coordinates), closedPolygon(comparisonGeoJSON.coordinates));
      } else {
        return false;
      }

      // point.within(polygon)
    } else if (geoJSON.type === 'Point') {
      return polygonContainsPoint(comparisonGeoJSON.coordinates, geoJSON.coordinates);

      // linestring/multipoint withing polygon
    } else if (geoJSON.type === 'LineString' || geoJSON.type === 'MultiPoint') {
      if (!geoJSON.coordinates || geoJSON.coordinates.length === 0) {
        return false;
      }

      for (i = 0; i < geoJSON.coordinates.length; i++) {
        if (polygonContainsPoint(comparisonGeoJSON.coordinates, geoJSON.coordinates[i]) === false) {
          return false;
        }
      }

      return true;

      // multilinestring.within(polygon)
    } else if (geoJSON.type === 'MultiLineString') {
      for (i = 0; i < geoJSON.coordinates.length; i++) {
        const ls = {
          'type': 'LineString',
          'coordinates': geoJSON.coordinates[i]
        };
        if (within(ls, comparisonGeoJSON) === false) {
          contains++;
          return false;
        }
      }

      return true;

      // multipolygon.within(polygon)
    } else if (geoJSON.type === 'MultiPolygon') {
      for (i = 0; i < geoJSON.coordinates.length; i++) {
        const p1 = { type: 'Polygon', coordinates: geoJSON.coordinates[i] };

        if (within(p1, comparisonGeoJSON) === false) {
          return false;
        }
      }

      return true;
    }
  }

  if (comparisonGeoJSON.type === 'MultiPolygon') {
    // point.within(multipolygon)
    if (geoJSON.type === 'Point') {
      if (comparisonGeoJSON.coordinates.length) {
        for (i = 0; i < comparisonGeoJSON.coordinates.length; i++) {
          coordinates = comparisonGeoJSON.coordinates[i];
          if (polygonContainsPoint(coordinates, geoJSON.coordinates) && arraysIntersectArrays([geoJSON.coordinates], comparisonGeoJSON.coordinates) === false) {
            return true;
          }
        }
      }

      return false;
      // polygon.within(multipolygon)
    } else if (geoJSON.type === 'Polygon') {
      for (i = 0; i < geoJSON.coordinates.length; i++) {
        if (comparisonGeoJSON.coordinates[i].length === geoJSON.coordinates.length) {
          for (let j = 0; j < geoJSON.coordinates.length; j++) {
            if (coordinatesEqual(geoJSON.coordinates[j], comparisonGeoJSON.coordinates[i][j])) {
              return true;
            }
          }
        }
      }

      if (arraysIntersectArrays(geoJSON.coordinates, comparisonGeoJSON.coordinates) === false) {
        if (comparisonGeoJSON.coordinates.length) {
          for (i = 0; i < comparisonGeoJSON.coordinates.length; i++) {
            coordinates = comparisonGeoJSON.coordinates[i];
            if (polygonContainsPoint(coordinates, geoJSON.coordinates[0][0]) === false) {
              contains = false;
            } else {
              contains = true;
            }
          }

          return contains;
        }
      }

      // linestring.within(multipolygon), multipoint.within(multipolygon)
    } else if (geoJSON.type === 'LineString' || geoJSON.type === 'MultiPoint') {
      for (i = 0; i < comparisonGeoJSON.coordinates.length; i++) {
        const poly = { type: 'Polygon', coordinates: comparisonGeoJSON.coordinates[i] };

        if (within(geoJSON, poly)) {
          return true;
        }

        return false;
      }

      // multilinestring.within(multipolygon)
    } else if (geoJSON.type === 'MultiLineString') {
      for (i = 0; i < geoJSON.coordinates.length; i++) {
        const ls = { 'type': 'LineString', 'coordinates': geoJSON.coordinates[i]};

        if (within(ls, comparisonGeoJSON) === false) {
          return false;
        }
      }

      return true;

      // multipolygon.within(multipolygon)
    } else if (geoJSON.type === 'MultiPolygon') {
      for (i = 0; i < comparisonGeoJSON.coordinates.length; i++) {
        const mpoly = { type: 'Polygon', coordinates: comparisonGeoJSON.coordinates[i] };

        if (within(geoJSON, mpoly) === false) {
          return false;
        }
      }

      return true;
    }
  }

  // default to false
  return false;
};

export const intersects = (geoJSON, comparisonGeoJSON) => {
  // if we are passed a feature, use the polygon inside instead
  if (comparisonGeoJSON.type === 'Feature') {
    comparisonGeoJSON = comparisonGeoJSON.geometry;
  }

  if (within(geoJSON, comparisonGeoJSON) || within(geoJSON, comparisonGeoJSON)) {
    return true;
  }

  if (geoJSON.type !== 'Point' && geoJSON.type !== 'MultiPoint' &&
    comparisonGeoJSON.type !== 'Point' && comparisonGeoJSON.type !== 'MultiPoint') {
    return arraysIntersectArrays(geoJSON.coordinates, comparisonGeoJSON.coordinates);
  } else if (geoJSON.type === 'Feature') {
    // in the case of a Feature, use the internal geometry for intersection
    const inner = geoJSON.geometry;
    return intersects(inner, comparisonGeoJSON);
  }

  warn('Type ' + geoJSON.type + ' to ' + comparisonGeoJSON.type + ' intersection is not supported by intersects');
  return false;
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
