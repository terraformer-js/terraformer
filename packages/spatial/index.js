/* Copyright (c) 2015-2019 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

/** @module @terraformer/spatial */

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
  var args = Array.prototype.slice.apply(arguments);

  if (typeof console !== 'undefined' && console.warn) {
    console.warn.apply(console, args);
  }
}

export function calculateEnvelope (geojson) {
  var bounds = calculateBounds(geojson);
  return {
    x: bounds[0],
    y: bounds[1],
    w: Math.abs(bounds[0] - bounds[2]),
    h: Math.abs(bounds[1] - bounds[3])
  };
}

/*
  Calculate an bounding box for a geojson object
*/
export function calculateBounds (geojson) {
  if (geojson.type) {
    switch (geojson.type) {
      case 'Point':
        return [ geojson.coordinates[0], geojson.coordinates[1], geojson.coordinates[0], geojson.coordinates[1] ];

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
}

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
function calculateBoundsFromNestedArrays (array) {
  var x1 = null; var x2 = null; var y1 = null; var y2 = null;

  for (var i = 0; i < array.length; i++) {
    var inner = array[i];

    for (var j = 0; j < inner.length; j++) {
      var lonlat = inner[j];

      var lon = lonlat[0];
      var lat = lonlat[1];

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

  return [ x1, y1, x2, y2 ];
}

/*
Internal: Calculate a bounding box from an array of arrays of arrays
[
  [ [lng, lat],[lng, lat],[lng, lat] ]
  [ [lng, lat],[lng, lat],[lng, lat] ]
  [ [lng, lat],[lng, lat],[lng, lat] ]
]
*/
function calculateBoundsFromNestedArrayOfArrays (array) {
  var x1 = null; var x2 = null; var y1 = null; var y2 = null;

  for (var i = 0; i < array.length; i++) {
    var inner = array[i];

    for (var j = 0; j < inner.length; j++) {
      var innerinner = inner[j];
      for (var k = 0; k < innerinner.length; k++) {
        var lonlat = innerinner[k];

        var lon = lonlat[0];
        var lat = lonlat[1];

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
}

/*
Internal: Calculate a bounding box from an array of positions
[
  [lng, lat],[lng, lat],[lng, lat]
]
*/
function calculateBoundsFromArray (array) {
  var x1 = null; var x2 = null; var y1 = null; var y2 = null;

  for (var i = 0; i < array.length; i++) {
    var lonlat = array[i];
    var lon = lonlat[0];
    var lat = lonlat[1];

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

  return [ x1, y1, x2, y2 ];
}

/*
Internal: Calculate an bounding box for a feature collection
*/
function calculateBoundsForFeatureCollection (featureCollection) {
  var extents = []; var extent;
  for (var i = featureCollection.features.length - 1; i >= 0; i--) {
    extent = calculateBounds(featureCollection.features[i].geometry);
    extents.push([extent[0], extent[1]]);
    extents.push([extent[2], extent[3]]);
  }

  return calculateBoundsFromArray(extents);
}

/*
Internal: Calculate an bounding box for a geometry collection
*/
function calculateBoundsForGeometryCollection (geometryCollection) {
  var extents = []; var extent;

  for (var i = geometryCollection.geometries.length - 1; i >= 0; i--) {
    extent = calculateBounds(geometryCollection.geometries[i]);
    extents.push([extent[0], extent[1]]);
    extents.push([extent[2], extent[3]]);
  }

  return calculateBoundsFromArray(extents);
}

/*
Internal: Convert radians to degrees. Used by spatial reference converters.
*/
function radToDeg (rad) {
  return rad * DegreesPerRadian;
}

/*
Internal: Convert degrees to radians. Used by spatial reference converters.
*/
function degToRad (deg) {
  return deg * RadiansPerDegree;
}

/*
Internal: Loop over each array in a geojson object and apply a function to it. Used by spatial reference converters.
*/
function eachPosition (coordinates, func) {
  for (var i = 0; i < coordinates.length; i++) {
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
}

/*
Convert a GeoJSON Position object to Geographic (4326)
*/
export function positionToGeographic (position) {
  var x = position[0];
  var y = position[1];
  return [radToDeg(x / EarthRadius) - (Math.floor((radToDeg(x / EarthRadius) + 180) / 360) * 360), radToDeg((Math.PI / 2) - (2 * Math.atan(Math.exp(-1.0 * y / EarthRadius))))];
}

/*
Convert a GeoJSON Position object to Web Mercator (102100)
*/
export function positionToMercator (position) {
  var lng = position[0];
  var lat = Math.max(Math.min(position[1], 89.99999), -89.99999);
  return [degToRad(lng) * EarthRadius, EarthRadius / 2.0 * Math.log((1.0 + Math.sin(degToRad(lat))) / (1.0 - Math.sin(degToRad(lat))))];
}

/*
Apply a function agaist all positions in a geojson object. Used by spatial reference converters.
*/
export function applyConverter (geojson, converter, noCrs) {
  if (geojson.type === 'Point') {
    geojson.coordinates = converter(geojson.coordinates);
  } else if (geojson.type === 'Feature') {
    geojson.geometry = applyConverter(geojson.geometry, converter, true);
  } else if (geojson.type === 'FeatureCollection') {
    for (var f = 0; f < geojson.features.length; f++) {
      geojson.features[f] = applyConverter(geojson.features[f], converter, true);
    }
  } else if (geojson.type === 'GeometryCollection') {
    for (var g = 0; g < geojson.geometries.length; g++) {
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
}

/*
Convert a GeoJSON object to ESRI Web Mercator (102100)
*/
export function toMercator (geojson) {
  return applyConverter(geojson, positionToMercator);
}

/*
Convert a GeoJSON object to Geographic coordinates (WSG84, 4326)
*/
export function toGeographic (geojson) {
  return applyConverter(geojson, positionToGeographic);
}

/*
Internal: used for sorting
*/
function compSort (p1, p2) {
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
}

/*
  Internal: -1,0,1 comparison function
  */
function cmp (a, b) {
  if (a < b) {
    return -1;
  } else if (a > b) {
    return 1;
  } else {
    return 0;
  }
}

/*
  Internal: used to determine turn
  */
function turn (p, q, r) {
  // Returns -1, 0, 1 if p,q,r forms a right, straight, or left turn.
  return cmp((q[0] - p[0]) * (r[1] - p[1]) - (r[0] - p[0]) * (q[1] - p[1]), 0);
}

/*
  Internal: used to determine euclidean distance between two points
  */
function euclideanDistance (p, q) {
  // Returns the squared Euclidean distance between p and q.
  var dx = q[0] - p[0];
  var dy = q[1] - p[1];

  return dx * dx + dy * dy;
}

function nextHullPoint (points, p) {
  // Returns the next point on the convex hull in CCW from p.
  var q = p;
  for (var r in points) {
    var t = turn(p, q, points[r]);
    if ((t === -1 || t === 0) && euclideanDistance(p, points[r]) > euclideanDistance(p, q)) {
      q = points[r];
    }
  }
  return q;
}

function internalConvexHull (points) {
  // implementation of the Jarvis March algorithm
  // adapted from http://tixxit.wordpress.com/2009/12/09/jarvis-march/

  if (points.length === 0) {
    return [];
  } else if (points.length === 1) {
    return points;
  }

  // Returns the points on the convex hull of points in CCW order.
  var hull = [points.sort(compSort)[0]];

  for (var p = 0; p < hull.length; p++) {
    var q = nextHullPoint(points, hull[p]);

    if (q !== hull[0]) {
      hull.push(q);
    }
  }

  return hull;
}

export function convexHull (geojson) {
  var coordinates = [ ]; var i; var j;
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
    var primitive = geojson.geometry;
    return convexHull(primitive);
  }

  return {
    type: 'Polygon',
    coordinates: closedPolygon([internalConvexHull(coordinates)])
  };
}

export function isConvex (points) {
  var ltz;

  for (var i = 0; i < points.length - 3; i++) {
    var p1 = points[i];
    var p2 = points[i + 1];
    var p3 = points[i + 2];
    var v = [p2[0] - p1[0], p2[1] - p1[1]];

    // p3.x * v.y - p3.y * v.x + v.x * p1.y - v.y * p1.x
    var res = p3[0] * v[1] - p3[1] * v[0] + v[0] * p1[1] - v[1] * p1[0];

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
}

// a duplicate method can be found in @terraformer/arcgis
export function coordinatesContainPoint (coordinates, point) {
  var contains = false;
  for (var i = -1, l = coordinates.length, j = l - 1; ++i < l; j = i) {
    if (((coordinates[i][1] <= point[1] && point[1] < coordinates[j][1]) ||
         (coordinates[j][1] <= point[1] && point[1] < coordinates[i][1])) &&
        (point[0] < (coordinates[j][0] - coordinates[i][0]) * (point[1] - coordinates[i][1]) / (coordinates[j][1] - coordinates[i][1]) + coordinates[i][0])) {
      contains = !contains;
    }
  }
  return contains;
}

export function polygonContainsPoint (polygon, point) {
  if (polygon && polygon.length) {
    if (polygon.length === 1) { // polygon with no holes
      return coordinatesContainPoint(polygon[0], point);
    } else { // polygon with holes
      if (coordinatesContainPoint(polygon[0], point)) {
        for (var i = 1; i < polygon.length; i++) {
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
}

function edgeIntersectsEdge (a1, a2, b1, b2) {
  var uaT = (b2[0] - b1[0]) * (a1[1] - b1[1]) - (b2[1] - b1[1]) * (a1[0] - b1[0]);
  var ubT = (a2[0] - a1[0]) * (a1[1] - b1[1]) - (a2[1] - a1[1]) * (a1[0] - b1[0]);
  var uB = (b2[1] - b1[1]) * (a2[0] - a1[0]) - (b2[0] - b1[0]) * (a2[1] - a1[1]);

  if (uB !== 0) {
    var uaD = uaT / uB;
    var ubD = ubT / uB;

    if (uaD >= 0 && uaD <= 1 && ubD >= 0 && ubD <= 1) {
      return true;
    }
  }

  return false;
}

function isNumber (n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

function arraysIntersectArrays (a, b) {
  if (isNumber(a[0][0])) {
    if (isNumber(b[0][0])) {
      for (var i = 0; i < a.length - 1; i++) {
        for (var j = 0; j < b.length - 1; j++) {
          if (edgeIntersectsEdge(a[i], a[i + 1], b[j], b[j + 1])) {
            return true;
          }
        }
      }
    } else {
      for (var k = 0; k < b.length; k++) {
        if (arraysIntersectArrays(a, b[k])) {
          return true;
        }
      }
    }
  } else {
    for (var l = 0; l < a.length; l++) {
      if (arraysIntersectArrays(a[l], b)) {
        return true;
      }
    }
  }
  return false;
}

/*
Internal: Returns a copy of coordinates for s closed polygon
*/
function closedPolygon (coordinates) {
  var outer = [ ];

  for (var i = 0; i < coordinates.length; i++) {
    var inner = coordinates[i].slice();
    if (pointsEqual(inner[0], inner[inner.length - 1]) === false) {
      inner.push(inner[0]);
    }

    outer.push(inner);
  }

  return outer;
}

// a duplicate method can be found in @terraformer/arcgis
function pointsEqual (a, b) {
  for (var i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) {
      return false;
    }
  }

  return true;
}

function coordinatesEqual (a, b) {
  if (a.length !== b.length) {
    return false;
  }

  var na = a.slice().sort(compSort);
  var nb = b.slice().sort(compSort);

  for (var i = 0; i < na.length; i++) {
    if (na[i].length !== nb[i].length) {
      return false;
    }
    for (var j = 0; j < na.length; j++) {
      if (na[i][j] !== nb[i][j]) {
        return false;
      }
    }
  }

  return true;
}

export function contains (geojson1, geojson2) {
  return within(geojson2, geojson1);
}

export function within (geojson1, geojson2) {
  var coordinates, i, contains;

  // if we are passed a feature, use the polygon inside instead
  if (geojson2.type === 'Feature') {
    geojson2 = geojson2.geometry;
  }

  // point.within(point) :: equality
  if (geojson2.type === 'Point') {
    if (geojson1.type === 'Point') {
      return pointsEqual(geojson1.coordinates, geojson2.coordinates);
    }
  }

  // point.within(multilinestring)
  if (geojson1.type === 'MultiLineString') {
    if (geojson2.type === 'Point') {
      for (i = 0; i < geojson1.coordinates.length; i++) {
        var linestring = { type: 'LineString', coordinates: geojson1.coordinates[i] };

        if (within(linestring, geojson2)) {
          return true;
        }
      }
    }
  }

  // point.within(linestring), point.within(multipoint)
  if (geojson1.type === 'LineString' || geojson1.type === 'MultiPoint') {
    if (geojson2.type === 'Point') {
      for (i = 0; i < geojson1.coordinates.length; i++) {
        if (geojson2.coordinates.length !== geojson1.coordinates[i].length) {
          return false;
        }

        if (pointsEqual(geojson2.coordinates, geojson1.coordinates[i])) {
          return true;
        }
      }
    }
  }

  if (geojson1.type === 'Polygon') {
    // polygon.within(polygon)
    if (geojson2.type === 'Polygon') {
      // check for equal polygons
      if (geojson1.coordinates.length === geojson2.coordinates.length) {
        for (i = 0; i < geojson2.coordinates.length; i++) {
          if (coordinatesEqual(geojson2.coordinates[i], geojson1.coordinates[i])) {
            return true;
          }
        }
      }

      if (geojson2.coordinates.length && polygonContainsPoint(geojson1.coordinates, geojson2.coordinates[0][0])) {
        return !arraysIntersectArrays(closedPolygon(geojson2.coordinates), closedPolygon(geojson1.coordinates));
      } else {
        return false;
      }

    // point.within(polygon)
    } else if (geojson2.type === 'Point') {
      return polygonContainsPoint(geojson1.coordinates, geojson2.coordinates);

    // linestring/multipoint withing polygon
    } else if (geojson2.type === 'LineString' || geojson2.type === 'MultiPoint') {
      if (!geojson2.coordinates || geojson2.coordinates.length === 0) {
        return false;
      }

      for (i = 0; i < geojson2.coordinates.length; i++) {
        if (polygonContainsPoint(geojson1.coordinates, geojson2.coordinates[i]) === false) {
          return false;
        }
      }

      return true;

    // multilinestring.within(polygon)
    } else if (geojson2.type === 'MultiLineString') {
      for (i = 0; i < geojson2.coordinates.length; i++) {
        const ls = geojson2.coordinates[i];

        if (within(geojson1, ls) === false) {
          contains++;
          return false;
        }
      }

      return true;

    // multipolygon.within(polygon)
    } else if (geojson2.type === 'MultiPolygon') {
      for (i = 0; i < geojson2.coordinates.length; i++) {
        const p1 = { type: 'Polygon', coordinates: geojson2.coordinates[i] };

        if (within(geojson1, p1) === false) {
          return false;
        }
      }

      return true;
    }
  }

  if (geojson1.type === 'MultiPolygon') {
    // point.within(multipolygon)
    if (geojson2.type === 'Point') {
      if (geojson1.coordinates.length) {
        for (i = 0; i < geojson1.coordinates.length; i++) {
          coordinates = geojson1.coordinates[i];
          if (polygonContainsPoint(coordinates, geojson2.coordinates) && arraysIntersectArrays([geojson2.coordinates], geojson1.coordinates) === false) {
            return true;
          }
        }
      }

      return false;
    // polygon.within(multipolygon)
    } else if (geojson2.type === 'Polygon') {
      for (i = 0; i < geojson2.coordinates.length; i++) {
        if (geojson1.coordinates[i].length === geojson2.coordinates.length) {
          for (let j = 0; j < geojson2.coordinates.length; j++) {
            if (coordinatesEqual(geojson2.coordinates[j], geojson1.coordinates[i][j])) {
              return true;
            }
          }
        }
      }

      if (arraysIntersectArrays(geojson2.coordinates, geojson1.coordinates) === false) {
        if (geojson1.coordinates.length) {
          for (i = 0; i < geojson1.coordinates.length; i++) {
            coordinates = geojson1.coordinates[i];
            if (polygonContainsPoint(coordinates, geojson2.coordinates[0][0]) === false) {
              contains = false;
            } else {
              contains = true;
            }
          }

          return contains;
        }
      }

    // linestring.within(multipolygon), multipoint.within(multipolygon)
    } else if (geojson2.type === 'LineString' || geojson2.type === 'MultiPoint') {
      for (i = 0; i < geojson1.coordinates.length; i++) {
        var p = { type: 'Polygon', coordinates: geojson1.coordinates[i] };

        if (within(p, geojson2)) {
          return true;
        }

        return false;
      }

    // multilinestring.within(multipolygon)
    } else if (geojson2.type === 'MultiLineString') {
      for (i = 0; i < geojson2.coordinates.length; i++) {
        const lines = geojson2.coordinates[i];

        if (within(geojson1, lines) === false) {
          return false;
        }
      }

      return true;

    // multipolygon.within(multipolygon)
    } else if (geojson2.type === 'MultiPolygon') {
      for (i = 0; i < geojson1.coordinates.length; i++) {
        var mpoly = { type: 'Polygon', coordinates: geojson1.coordinates[i] };

        if (within(mpoly, geojson2) === false) {
          return false;
        }
      }

      return true;
    }
  }

  // default to false
  return false;
}

export function intersects (geojson1, geojson2) {
  // if we are passed a feature, use the polygon inside instead
  if (geojson2.type === 'Feature') {
    geojson2 = geojson2.geometry;
  }

  if (within(geojson1, geojson2) || within(geojson1, geojson2)) {
    return true;
  }

  if (geojson1.type !== 'Point' && geojson1.type !== 'MultiPoint' &&
      geojson2.type !== 'Point' && geojson2.type !== 'MultiPoint') {
    return arraysIntersectArrays(geojson1.coordinates, geojson2.coordinates);
  } else if (geojson1.type === 'Feature') {
    // in the case of a Feature, use the internal geometry for intersection
    const inner = geojson1.geometry;
    return intersects(inner, geojson2);
  }

  warn('Type ' + geojson1.type + ' to ' + geojson2.type + ' intersection is not supported by intersects');
  return false;
}

function createCircle (center, radius, interpolate) {
  var mercatorPosition = positionToMercator(center);
  var steps = interpolate || 64;
  var polygon = {
    type: 'Polygon',
    coordinates: [[]]
  };
  for (var i = 1; i <= steps; i++) {
    var radians = i * (360 / steps) * Math.PI / 180;
    polygon.coordinates[0].push([mercatorPosition[0] + radius * Math.cos(radians), mercatorPosition[1] + radius * Math.sin(radians)]);
  }
  polygon.coordinates = closedPolygon(polygon.coordinates);

  return toGeographic(polygon);
}

export function toCircle (center, radius, interpolate) {
  var steps = interpolate || 64;
  var rad = radius || 250;

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
}
