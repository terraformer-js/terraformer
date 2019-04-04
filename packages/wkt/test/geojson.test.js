
import test from 'tape';
import { geojsonToWKT } from '../index.js';

test('should exist', function (t) {
  t.plan(1);
  t.ok(geojsonToWKT);
});

test('should turn a GeoJSON Point into WKT', function (t) {
  t.plan(1);

  const input = {
    type: 'Point',
    coordinates: [ 30, 10 ]
  };

  const output = geojsonToWKT(input);

  t.deepEqual(output, 'POINT (30 10)');
});

test('should convert a POINT with Z', function (t) {
  t.plan(1);

  const input = {
    type: 'Point',
    coordinates: [ 30, 10, 10 ]
  };

  const output = geojsonToWKT(input);

  t.deepEqual(output, 'POINT Z (30 10 10)');
});

test('should convert a POINT with M (nonstandard)', function (t) {
  t.plan(1);

  const input = {
    properties: { m: true },
    type: 'Point',
    coordinates: [ 30, 10, 10 ]
  };

  const output = geojsonToWKT(input);

  t.deepEqual(output, 'POINT M (30 10 10)');
});

test('should convert a POINT with Z and M', function (t) {
  t.plan(1);

  const input = {
    type: 'Point',
    coordinates: [ 30, 10, 10, 12 ]
  };

  const output = geojsonToWKT(input);

  t.deepEqual(output, 'POINT ZM (30 10 10 12)');
});

test('should convert an empty POINT', function (t) {
  t.plan(1);

  const input = {
    type: 'Point',
    coordinates: [ ]
  };

  const output = geojsonToWKT(input);

  t.deepEqual(output, 'POINT EMPTY');
});

test('should convert a POLYGON', function (t) {
  t.plan(1);

  const input = {
    type: 'Polygon',
    coordinates: [ [ [ 30, 10 ], [ 20, 20 ], [ 30, 20 ] ] ]
  };

  const output = geojsonToWKT(input);

  t.deepEqual(output, 'POLYGON ((30 10, 20 20, 30 20))');
});

test('should convert a POLYGON with Z', function (t) {
  t.plan(1);

  const input = {
    type: 'Polygon',
    coordinates: [ [ [ 30, 10, 1 ], [ 20, 20, 2 ], [ 30, 20, 3 ] ] ]
  };

  const output = geojsonToWKT(input);

  t.deepEqual(output, 'POLYGON Z ((30 10 1, 20 20 2, 30 20 3))');
});

test('should convert a POLYGON with ZM', function (t) {
  t.plan(1);

  const input = {
    type: 'Polygon',
    coordinates: [ [ [ 30, 10, 1, 3 ], [ 20, 20, 2, 2 ], [ 30, 20, 3, 1 ] ] ]
  };

  const output = geojsonToWKT(input);

  t.deepEqual(output, 'POLYGON ZM ((30 10 1 3, 20 20 2 2, 30 20 3 1))');
});

test('should convert a POLYGON with M (nonstandard)', function (t) {
  t.plan(1);

  const input = {
    properties: { m: true },
    type: 'Polygon',
    coordinates: [ [ [ 30, 10, 1 ], [ 20, 20, 2 ], [ 30, 20, 3 ] ] ]
  };

  const output = geojsonToWKT(input);

  t.deepEqual(output, 'POLYGON M ((30 10 1, 20 20 2, 30 20 3))');
});

test('should convert an EMPTY POLYGON', function (t) {
  t.plan(1);

  const input = {
    type: 'Polygon',
    coordinates: [ ]
  };

  const output = geojsonToWKT(input);

  t.deepEqual(output, 'POLYGON EMPTY');
});

test('should convert a MULTIPOINT', function (t) {
  t.plan(1);

  const input = {
    type: 'MultiPoint',
    coordinates: [ [ 30, 10 ], [ 20, 20 ], [ 30, 20 ] ]
  };

  const output = geojsonToWKT(input);

  t.deepEqual(output, 'MULTIPOINT (30 10, 20 20, 30 20)');
});

test('should convert a MULTIPOINT with Z', function (t) {
  t.plan(1);

  const input = {
    type: 'MultiPoint',
    coordinates: [ [ 30, 10, 1 ], [ 20, 20, 2 ], [ 30, 20, 3 ] ]
  };

  const output = geojsonToWKT(input);

  t.deepEqual(output, 'MULTIPOINT Z (30 10 1, 20 20 2, 30 20 3)');
});

test('should convert a MULTIPOINT with ZM', function (t) {
  t.plan(1);

  const input = {
    type: 'MultiPoint',
    coordinates: [ [ 30, 10, 1, 2 ], [ 20, 20, 3, 4 ], [ 30, 20, 5, 6 ] ]
  };

  const output = geojsonToWKT(input);

  t.deepEqual(output, 'MULTIPOINT ZM (30 10 1 2, 20 20 3 4, 30 20 5 6)');
});

test('should convert a MULTIPOINT with M (nonstandard)', function (t) {
  t.plan(1);

  const input = {
    properties: { m: true },
    type: 'MultiPoint',
    coordinates: [ [ 30, 10, 1 ], [ 20, 20, 2 ], [ 30, 20, 3 ] ]
  };

  const output = geojsonToWKT(input);

  t.deepEqual(output, 'MULTIPOINT M (30 10 1, 20 20 2, 30 20 3)');
});

test('should convert an EMPTY MULTIPOINT', function (t) {
  t.plan(1);

  const input = {
    type: 'MultiPoint',
    coordinates: [ ]
  };

  const output = geojsonToWKT(input);

  t.deepEqual(output, 'MULTIPOINT EMPTY');
});

test('should convert a LINESTRING with Z', function (t) {
  t.plan(1);

  const input = {
    type: 'LineString',
    coordinates: [ [ 30, 10, 2 ], [ 20, 20, 1 ], [ 30, 20, 0 ] ]
  };

  const output = geojsonToWKT(input);

  t.deepEqual(output, 'LINESTRING Z (30 10 2, 20 20 1, 30 20 0)');
});

test('should convert a LINESTRING with ZM', function (t) {
  t.plan(1);

  const input = {
    type: 'LineString',
    coordinates: [ [ 30, 10, 1, 2 ], [ 20, 20, 3, 4 ], [ 30, 20, 5, 6 ] ]
  };

  const output = geojsonToWKT(input);

  t.deepEqual(output, 'LINESTRING ZM (30 10 1 2, 20 20 3 4, 30 20 5 6)');
});

test('should convert a LINESTRING with M (nonstandard)', function (t) {
  t.plan(1);

  const input = {
    properties: { m: true },
    type: 'LineString',
    coordinates: [ [ 30, 10, 1 ], [ 20, 20, 2 ], [ 30, 20, 3 ] ]
  };

  const output = geojsonToWKT(input);

  t.deepEqual(output, 'LINESTRING M (30 10 1, 20 20 2, 30 20 3)');
});

test('should convert an empty LINESTRING', function (t) {
  t.plan(1);

  const input = {
    type: 'LineString',
    coordinates: [ ]
  };

  const output = geojsonToWKT(input);

  t.deepEqual(output, 'LINESTRING EMPTY');
});

test('should convert a LINESTRING', function (t) {
  t.plan(1);

  const input = {
    type: 'LineString',
    coordinates: [ [ 30, 10 ], [ 20, 20 ], [ 30, 20 ] ]
  };

  const output = geojsonToWKT(input);

  t.deepEqual(output, 'LINESTRING (30 10, 20 20, 30 20)');
});

test('should convert a MULTILINESTRING', function (t) {
  t.plan(1);

  const input = {
    type: 'MultiLineString',
    coordinates: [ [ [ 30, 10 ], [ 20, 20 ], [ 30, 20 ] ] ]
  };

  const output = geojsonToWKT(input);

  t.deepEqual(output, 'MULTILINESTRING ((30 10, 20 20, 30 20))');
});

test('should convert a MULTILINESTRING with Z', function (t) {
  t.plan(1);

  const input = {
    type: 'MultiLineString',
    coordinates: [ [ [ 30, 10, 1 ], [ 20, 20, 2 ], [ 30, 20, 3 ] ] ]
  };

  const output = geojsonToWKT(input);

  t.deepEqual(output, 'MULTILINESTRING Z ((30 10 1, 20 20 2, 30 20 3))');
});

test('should convert a MULTILINESTRING with Z and M', function (t) {
  t.plan(1);

  const input = {
    type: 'MultiLineString',
    coordinates: [ [ [ 30, 10, 1, 2 ], [ 20, 20, 3, 4 ], [ 30, 20, 5, 6 ] ] ]
  };

  const output = geojsonToWKT(input);

  t.deepEqual(output, 'MULTILINESTRING ZM ((30 10 1 2, 20 20 3 4, 30 20 5 6))');
});

test('should convert a MULTILINESTRING with M (nonstandard)', function (t) {
  t.plan(1);

  const input = {
    properties: { m: true },
    type: 'MultiLineString',
    coordinates: [ [ [ 30, 10, 1 ], [ 20, 20, 2 ], [ 30, 20, 3 ] ] ]
  };

  const output = geojsonToWKT(input);

  t.deepEqual(output, 'MULTILINESTRING M ((30 10 1, 20 20 2, 30 20 3))');
});

test('should convert an empty MULTILINESTRING', function (t) {
  t.plan(1);

  const input = {
    type: 'MultiLineString',
    coordinates: [ ]
  };

  const output = geojsonToWKT(input);

  t.deepEqual(output, 'MULTILINESTRING EMPTY');
});

test('should convert a MULTIPOLYGON', function (t) {
  t.plan(1);

  const input = { 'type': 'MultiPolygon',
    'coordinates': [
      [[[102.0, 2.0], [103.0, 2.0], [103.0, 3.0], [102.0, 3.0], [102.0, 2.0]]],
      [[[100.0, 0.0], [101.0, 0.0], [101.0, 1.0], [100.0, 1.0], [100.0, 0.0]],
        [[100.2, 0.2], [100.8, 0.2], [100.8, 0.8], [100.2, 0.8], [100.2, 0.2]]]
    ]
  };

  const output = geojsonToWKT(input);

  t.deepEqual(output, 'MULTIPOLYGON (((102 2, 103 2, 103 3, 102 3, 102 2)), ((100 0, 101 0, 101 1, 100 1, 100 0), (100.2 0.2, 100.8 0.2, 100.8 0.8, 100.2 0.8, 100.2 0.2)))');
});

test('should convert a MULTIPOLYGON with Z', function (t) {
  t.plan(1);

  const input = { 'type': 'MultiPolygon',
    'coordinates': [
      [[[102.0, 2.0, 1], [103.0, 2.0, 2], [103.0, 3.0, 3], [102.0, 3.0, 4], [102.0, 2.0, 5]]],
      [[[100.0, 0.0], [101.0, 0.0], [101.0, 1.0], [100.0, 1.0], [100.0, 0.0]],
        [[100.2, 0.2], [100.8, 0.2], [100.8, 0.8], [100.2, 0.8], [100.2, 0.2]]]
    ]
  };

  const output = geojsonToWKT(input);

  t.deepEqual(output, 'MULTIPOLYGON Z (((102 2 1, 103 2 2, 103 3 3, 102 3 4, 102 2 5)), ((100 0, 101 0, 101 1, 100 1, 100 0), (100.2 0.2, 100.8 0.2, 100.8 0.8, 100.2 0.8, 100.2 0.2)))');
});

test('should convert a MULTIPOLYGON with Z and M', function (t) {
  t.plan(1);

  const input = { 'type': 'MultiPolygon',
    'coordinates': [
      [[[102.0, 2.0, 1, 2], [103.0, 2.0, 3, 4], [103.0, 3.0, 5, 6], [102.0, 3.0, 7, 8], [102.0, 2.0, 9, 10]]],
      [[[100.0, 0.0], [101.0, 0.0], [101.0, 1.0], [100.0, 1.0], [100.0, 0.0]],
        [[100.2, 0.2], [100.8, 0.2], [100.8, 0.8], [100.2, 0.8], [100.2, 0.2]]]
    ]
  };

  const output = geojsonToWKT(input);

  t.deepEqual(output, 'MULTIPOLYGON ZM (((102 2 1 2, 103 2 3 4, 103 3 5 6, 102 3 7 8, 102 2 9 10)), ((100 0, 101 0, 101 1, 100 1, 100 0), (100.2 0.2, 100.8 0.2, 100.8 0.8, 100.2 0.8, 100.2 0.2)))');
});

test('should convert a MULTIPOLYGON with M (non standard)', function (t) {
  t.plan(1);

  const input = { 'type': 'MultiPolygon',
    properties: { m: true },
    'coordinates': [
      [[[102.0, 2.0, 1], [103.0, 2.0, 2], [103.0, 3.0, 3], [102.0, 3.0, 4], [102.0, 2.0, 5]]],
      [[[100.0, 0.0], [101.0, 0.0], [101.0, 1.0], [100.0, 1.0], [100.0, 0.0]],
        [[100.2, 0.2], [100.8, 0.2], [100.8, 0.8], [100.2, 0.8], [100.2, 0.2]]]
    ]
  };

  const output = geojsonToWKT(input);

  t.deepEqual(output, 'MULTIPOLYGON M (((102 2 1, 103 2 2, 103 3 3, 102 3 4, 102 2 5)), ((100 0, 101 0, 101 1, 100 1, 100 0), (100.2 0.2, 100.8 0.2, 100.8 0.8, 100.2 0.8, 100.2 0.2)))');
});

test('should convert an EMPTY MULTIPOLYGON', function (t) {
  t.plan(1);

  const input = {
    'type': 'MultiPolygon',
    'coordinates': [ ]
  };

  const output = geojsonToWKT(input);

  t.deepEqual(output, 'MULTIPOLYGON EMPTY');
});

test('should convert a Geometry Collection', function (t) {
  t.plan(1);

  const input = {
    'type': 'GeometryCollection',
    'geometries': [
      { 'type': 'Point',
        'coordinates': [100.0, 0.0]
      },
      { 'type': 'LineString',
        'coordinates': [ [101.0, 0.0], [102.0, 1.0] ]
      }
    ]
  };

  const output = geojsonToWKT(input);

  t.deepEqual(output, 'GEOMETRYCOLLECTION(POINT (100 0), LINESTRING (101 0, 102 1))');
});

test('should fail a conversion on an unknown type', function (t) {
  t.plan(1);

  const input = {
    'type': 'MultiPolygonLikeThingy',
    'coordinates': [ ]
  };

  try {
    geojsonToWKT(input);
  } catch (err) {
    const error = err.toString();
    t.deepEqual(error, 'Error: Unknown Type: MultiPolygonLikeThingy');
  }
});
