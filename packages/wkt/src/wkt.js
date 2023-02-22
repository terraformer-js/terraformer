/* global parser */ // via jison

/* Copyright (c) 2012-2020 Environmental Systems Research Institute, Inc.
 * MIT */

/** @module Terraformer */

'SOURCE';

function PointArray (point) {
  this.data = [point];
  this.type = 'PointArray';
}

PointArray.prototype.addPoint = function (point) {
  if (point.type === 'PointArray') {
    this.data = this.data.concat(point.data);
  } else {
    this.data.push(point);
  }

  return this;
};

PointArray.prototype.toJSON = function () {
  return this.data;
};

function Ring (point) {
  this.data = point;
  this.type = 'Ring';
}

Ring.prototype.toJSON = function () {
  var data = [];

  for (var i = 0; i < this.data.data.length; i++) {
    data.push(this.data.data[i]);
  }

  return data;
};

function RingList (ring) {
  this.data = [ring];
  this.type = 'RingList';
}

RingList.prototype.addRing = function (ring) {
  this.data.push(ring);

  return this;
};

RingList.prototype.toJSON = function () {
  var data = [];

  for (var i = 0; i < this.data.length; i++) {
    data.push(this.data[i].toJSON());
  }

  if (data.length === 1) {
    return data;
  } else {
    return data;
  }
};

function GeometryList (geometry) {
  this.data = [geometry];
  this.type = 'GeometryList';
}

GeometryList.prototype.addGeometry = function (geometry) {
  this.data.push(geometry);

  return this;
};

GeometryList.prototype.toJSON = function () {
  return this.data;
};

function PolygonList (polygon) {
  this.data = [polygon];
  this.type = 'PolygonList';
}

PolygonList.prototype.addPolygon = function (polygon) {
  this.data.push(polygon);

  return this;
};

PolygonList.prototype.toJSON = function () {
  var data = [];

  for (var i = 0; i < this.data.length; i++) {
    data = data.concat([this.data[i].toJSON()]);
  }

  return data;
};

/**
 * Converts a [WKT](https://en.wikipedia.org/wiki/Well-known_text_representation_of_geometry) geometry into a GeoJSON geometry.
 * @function
 * @param {string} WKT - The input WKT geometry.
 * @return {object} GeoJSON.
 *
 * ```js
 * import { wktToGeoJSON } from "@terraformer/wkt"
 *
 * wktToGeoJSON("POINT (-122.6764 45.5165)");
 *
 * >> { "type": "Point", "coordinates": [ -122.6764, 45.5165 ] }
 * ```
 */
export const wktToGeoJSON = (element) => {
  let res;

  try {
    res = parser.parse(element);
  } catch (err) {
    throw Error('Unable to parse: ' + err);
  }

  return res;
};

const arrayToRing = (arr) => {
  const parts = [];
  let ret = '';

  for (var i = 0; i < arr.length; i++) {
    parts.push(arr[i].join(' '));
  }

  ret += '(' + parts.join(', ') + ')';

  return ret;
};

const pointToWKTPoint = (geojson) => {
  let ret = 'POINT ';

  if (geojson.coordinates === undefined || geojson.coordinates.length === 0) {
    ret += 'EMPTY';

    return ret;
  } else if (geojson.coordinates.length === 3) {
    // 3d or time? default to 3d
    if (geojson.properties && geojson.properties.m === true) {
      ret += 'M ';
    } else {
      ret += 'Z ';
    }
  } else if (geojson.coordinates.length === 4) {
    // 3d and time
    ret += 'ZM ';
  }

  // include coordinates
  ret += '(' + geojson.coordinates.join(' ') + ')';

  return ret;
};

const lineStringToWKTLineString = (geojson) => {
  let ret = 'LINESTRING ';

  if (geojson.coordinates === undefined || geojson.coordinates.length === 0 || geojson.coordinates[0].length === 0) {
    ret += 'EMPTY';

    return ret;
  } else if (geojson.coordinates[0].length === 3) {
    if (geojson.properties && geojson.properties.m === true) {
      ret += 'M ';
    } else {
      ret += 'Z ';
    }
  } else if (geojson.coordinates[0].length === 4) {
    ret += 'ZM ';
  }

  ret += arrayToRing(geojson.coordinates);

  return ret;
};

const polygonToWKTPolygon = (geojson) => {
  let ret = 'POLYGON ';

  if (geojson.coordinates === undefined || geojson.coordinates.length === 0 || geojson.coordinates[0].length === 0) {
    ret += 'EMPTY';

    return ret;
  } else if (geojson.coordinates[0][0].length === 3) {
    if (geojson.properties && geojson.properties.m === true) {
      ret += 'M ';
    } else {
      ret += 'Z ';
    }
  } else if (geojson.coordinates[0][0].length === 4) {
    ret += 'ZM ';
  }

  ret += '(';
  var parts = [];
  for (var i = 0; i < geojson.coordinates.length; i++) {
    parts.push(arrayToRing(geojson.coordinates[i]));
  }

  ret += parts.join(', ');
  ret += ')';

  return ret;
};

const multiPointToWKTMultiPoint = (geojson) => {
  var ret = 'MULTIPOINT ';

  if (geojson.coordinates === undefined || geojson.coordinates.length === 0 || geojson.coordinates[0].length === 0) {
    ret += 'EMPTY';

    return ret;
  } else if (geojson.coordinates[0].length === 3) {
    if (geojson.properties && geojson.properties.m === true) {
      ret += 'M ';
    } else {
      ret += 'Z ';
    }
  } else if (geojson.coordinates[0].length === 4) {
    ret += 'ZM ';
  }

  ret += arrayToRing(geojson.coordinates);

  return ret;
};

const multiLineStringToWKTMultiLineString = (geojson) => {
  let ret = 'MULTILINESTRING ';

  if (geojson.coordinates === undefined || geojson.coordinates.length === 0 || geojson.coordinates[0].length === 0) {
    ret += 'EMPTY';

    return ret;
  } else if (geojson.coordinates[0][0].length === 3) {
    if (geojson.properties && geojson.properties.m === true) {
      ret += 'M ';
    } else {
      ret += 'Z ';
    }
  } else if (geojson.coordinates[0][0].length === 4) {
    ret += 'ZM ';
  }

  ret += '(';
  const parts = [];
  for (var i = 0; i < geojson.coordinates.length; i++) {
    parts.push(arrayToRing(geojson.coordinates[i]));
  }

  ret += parts.join(', ');
  ret += ')';

  return ret;
};

const multiPolygonToWKTMultiPolygon = (geojson) => {
  var ret = 'MULTIPOLYGON ';

  if (geojson.coordinates === undefined || geojson.coordinates.length === 0 || geojson.coordinates[0].length === 0) {
    ret += 'EMPTY';

    return ret;
  } else if (geojson.coordinates[0][0][0].length === 3) {
    if (geojson.properties && geojson.properties.m === true) {
      ret += 'M ';
    } else {
      ret += 'Z ';
    }
  } else if (geojson.coordinates[0][0][0].length === 4) {
    ret += 'ZM ';
  }

  ret += '(';
  var inner = [];
  for (var c = 0; c < geojson.coordinates.length; c++) {
    var it = '(';
    var parts = [];
    for (var i = 0; i < geojson.coordinates[c].length; i++) {
      parts.push(arrayToRing(geojson.coordinates[c][i]));
    }

    it += parts.join(', ');
    it += ')';

    inner.push(it);
  }

  ret += inner.join(', ');
  ret += ')';

  return ret;
};

/**
 * Converts a GeoJSON geometry or GeometryCollection into a [WKT](https://en.wikipedia.org/wiki/Well-known_text_representation_of_geometry) string.
 * @function
 * @param {object} GeoJSON - The input GeoJSON geometry or GeometryCollection.
 * @return {string} WKT.
 * ```js
 * import { geojsonToWKT } from "@terraformer/wkt"
 *
 * const geojsonPoint = {
 *   "type": "Point",
 *   "coordinates": [-122.6764, 45.5165]
 * }
 *
 * geojsonToWKT(geojsonPoint)
 *
 * >> "POINT (-122.6764 45.5165)"
 * ```
 */
export const geojsonToWKT = (geojson) => {
  switch (geojson.type) {
    case 'Point':
      return pointToWKTPoint(geojson);
    case 'LineString':
      return lineStringToWKTLineString(geojson);
    case 'Polygon':
      return polygonToWKTPolygon(geojson);
    case 'MultiPoint':
      return multiPointToWKTMultiPoint(geojson);
    case 'MultiLineString':
      return multiLineStringToWKTMultiLineString(geojson);
    case 'MultiPolygon':
      return multiPolygonToWKTMultiPolygon(geojson);
    case 'GeometryCollection':
      var ret = 'GEOMETRYCOLLECTION';
      var parts = [];
      for (let i = 0; i < geojson.geometries.length; i++) {
        parts.push(geojsonToWKT(geojson.geometries[i]));
      }
      return ret + '(' + parts.join(', ') + ')';
    default:
      throw Error('Unknown Type: ' + geojson.type);
  }
};
