
import test from 'tape';
import { wktToGeoJSON } from '../index.js';

test('should exist', function (t) {
  t.plan(1);
  t.ok(wktToGeoJSON);
});

test('should parse a WKT POINT', function (t) {
  t.plan(1);

  const input = 'POINT (30 10)';

  const output = wktToGeoJSON(input);

  t.deepEqual(output, {
    type: 'Point',
    coordinates: [ 30, 10 ]
  });
});

test('should parse an empty WKT POINT', function (t) {
  t.plan(1);

  const input = 'POINT EMPTY';

  const output = wktToGeoJSON(input);

  t.deepEqual(output, {
    type: 'Point',
    coordinates: [ ]
  });
});

test('should parse a POINT with a Z coordinate', function (t) {
  t.plan(1);

  const input = 'POINT Z (30 10 20)';

  const output = wktToGeoJSON(input);

  t.deepEqual(output, {
    properties: { z: true },
    type: 'Point',
    coordinates: [ 30, 10, 20 ]
  });
});

test('should parse a POINT with a M coordinate', function (t) {
  t.plan(1);

  const input = 'POINT M (30 10 20)';

  const output = wktToGeoJSON(input);

  t.deepEqual(output, {
    properties: { m: true },
    type: 'Point',
    coordinates: [ 30, 10, 20 ]
  });
});

test('should parse a POINT with a Z and M coordinate', function (t) {
  t.plan(1);

  const input = 'POINT ZM (30 10 20 15)';

  const output = wktToGeoJSON(input);

  t.deepEqual(output, {
    properties: {
      m: true,
      z: true
    },
    type: 'Point',
    coordinates: [ 30, 10, 20, 15 ]
  });
});

test('should parse a POINT with scientific notation coordinates', function (t) {
  t.plan(1);

  const input = 'POINT (30e0 10 2.0E+001 15)';

  const output = wktToGeoJSON(input);

  t.deepEqual(output, {
    type: 'Point',
    coordinates: [ 30, 10, 20, 15 ]
  });
});

test('should parse a LINESTRING', function (t) {
  t.plan(1);

  const input = 'LINESTRING (30 10, 10 30, 40 40)';

  const output = wktToGeoJSON(input);

  t.deepEqual(output, {
    type: 'LineString',
    coordinates: [ [30, 10], [10, 30], [40, 40] ]
  });
});

test('should parse an EMPTY LINESTRING', function (t) {
  t.plan(1);

  const input = 'LINESTRING EMPTY';

  const output = wktToGeoJSON(input);

  t.deepEqual(output, {
    type: 'LineString',
    coordinates: [ ]
  });
});

test('should parse a LINESTRING with a Z coordinate', function (t) {
  t.plan(1);

  const input = 'LINESTRING Z (30 10 5, 10 30 15, 40 40 25)';

  const output = wktToGeoJSON(input);

  t.deepEqual(output, {
    type: 'LineString',
    properties: {
      z: true
    },
    coordinates: [ [30, 10, 5], [10, 30, 15], [40, 40, 25] ]
  });
});

test('should parse a LINESTRING with an M coordinate', function (t) {
  t.plan(1);

  const input = 'LINESTRING M (30 10 5, 10 30 15, 40 40 25)';

  const output = wktToGeoJSON(input);

  t.deepEqual(output, {
    type: 'LineString',
    properties: {
      m: true
    },
    coordinates: [ [30, 10, 5], [10, 30, 15], [40, 40, 25] ]
  });
});

test('should parse a LINESTRING with Z and M coordinates', function (t) {
  t.plan(1);

  const input = 'LINESTRING ZM (30 10 5 2, 10 30 15 8, 40 40 25 16)';

  const output = wktToGeoJSON(input);

  t.deepEqual(output, {
    type: 'LineString',
    properties: {
      z: true,
      m: true
    },
    coordinates: [ [30, 10, 5, 2], [10, 30, 15, 8], [40, 40, 25, 16] ]
  });
});

test('should parse a POLYGON', function (t) {
  t.plan(1);

  const input = 'POLYGON ((30 10, 10 20, 20 40, 40 40, 30 10))';

  const output = wktToGeoJSON(input);

  t.deepEqual(output, {
    type: 'Polygon',
    coordinates: [ [ [30, 10], [10, 20], [20, 40], [40, 40], [30, 10] ] ]
  });
});

test('should parse an empty POLYGON', function (t) {
  t.plan(1);

  const input = 'POLYGON EMPTY';

  const output = wktToGeoJSON(input);

  t.deepEqual(output, {
    type: 'Polygon',
    coordinates: [ ]
  });
});

test('should parse a POLYGON with a Z coordinate', function (t) {
  t.plan(1);

  const input = 'POLYGON Z ((30 10 4, 10 20 6, 20 40 8, 40 40 1, 30 10 3))';

  const output = wktToGeoJSON(input);

  t.deepEqual(output, {
    type: 'Polygon',
    properties: {
      z: true
    },
    coordinates: [ [ [30, 10, 4], [10, 20, 6], [20, 40, 8], [40, 40, 1], [30, 10, 3] ] ]
  });
});

test('should parse a POLYGON with an M coordinate', function (t) {
  t.plan(1);

  const input = 'POLYGON M ((30 10 4, 10 20 6, 20 40 8, 40 40 1, 30 10 3))';

  const output = wktToGeoJSON(input);

  t.deepEqual(output, {
    type: 'Polygon',
    properties: {
      m: true
    },
    coordinates: [ [ [30, 10, 4], [10, 20, 6], [20, 40, 8], [40, 40, 1], [30, 10, 3] ] ]
  });
});

test('should parse a POLYGON with a Z and M coordinate', function (t) {
  t.plan(1);

  const input = 'POLYGON ZM ((30 10 4 1, 10 20 6 3, 20 40 8 5, 40 40 1 7, 30 10 3 9))';

  const output = wktToGeoJSON(input);

  t.deepEqual(output, {
    type: 'Polygon',
    properties: {
      m: true,
      z: true
    },
    coordinates: [ [ [30, 10, 4, 1], [10, 20, 6, 3], [20, 40, 8, 5], [40, 40, 1, 7], [30, 10, 3, 9] ] ]
  });
});

test('should parse a POLYGON with a hole', function (t) {
  t.plan(1);

  const input = 'POLYGON ((35 10, 10 20, 15 40, 45 45, 35 10),(20 30, 35 35, 30 20, 20 30))';

  const output = wktToGeoJSON(input);

  t.deepEqual(output, {
    type: 'Polygon',
    coordinates: [
      [ [35, 10], [10, 20], [15, 40], [45, 45], [35, 10] ],
      [ [20, 30], [35, 35], [30, 20], [20, 30] ]
    ]
  });
});

test('should parse a MULTIPOINT', function (t) {
  t.plan(1);

  const input = 'MULTIPOINT ((10 40), (40 30), (20 20), (30 10))';

  const output = wktToGeoJSON(input);

  t.deepEqual(output, {
    type: 'MultiPoint',
    coordinates: [
      [10, 40], [40, 30], [20, 20], [30, 10]
    ]
  });
});

test('should parse an EMPTY MULTIPOINT', function (t) {
  t.plan(1);

  const input = 'MULTIPOINT EMPTY';

  const output = wktToGeoJSON(input);

  t.deepEqual(output, {
    type: 'MultiPoint',
    coordinates: [ ]
  });
});

test('should parse a MULTIPOINT with a Z coordinate', function (t) {
  t.plan(1);

  const input = 'MULTIPOINT Z ((10 40 1), (40 30 2), (20 20 3), (30 10 4))';

  const output = wktToGeoJSON(input);

  t.deepEqual(output, {
    type: 'MultiPoint',
    properties: {
      z: true
    },
    coordinates: [ [10, 40, 1], [40, 30, 2], [20, 20, 3], [30, 10, 4] ]
  });
});

test('should parse a MULTIPOINT with an M coordinate', function (t) {
  t.plan(1);

  const input = 'MULTIPOINT M ((10 40 1), (40 30 2), (20 20 3), (30 10 4))';

  const output = wktToGeoJSON(input);

  t.deepEqual(output, {
    type: 'MultiPoint',
    properties: {
      m: true
    },
    coordinates: [ [10, 40, 1], [40, 30, 2], [20, 20, 3], [30, 10, 4] ]
  });
});

test('should parse a MULTIPOINT with a Z and M coordinate', function (t) {
  t.plan(1);

  const input = 'MULTIPOINT ZM ((10 40 1 8), (40 30 2 9), (20 20 3 8), (30 10 4 9))';

  const output = wktToGeoJSON(input);

  t.deepEqual(output, {
    type: 'MultiPoint',
    properties: {
      m: true,
      z: true
    },
    coordinates: [ [10, 40, 1, 8], [40, 30, 2, 9], [20, 20, 3, 8], [30, 10, 4, 9] ]
  });
});

test('should parse a MULTIPOINT with alternate syntax', function (t) {
  t.plan(1);

  const input = 'MULTIPOINT (10 40, 40 30, 20 20, 30 10)';

  const output = wktToGeoJSON(input);

  t.deepEqual(output, {
    type: 'MultiPoint',
    coordinates: [ [10, 40], [40, 30], [20, 20], [30, 10] ]
  });
});

test('should parse a MULTIPOINT with alternate syntax and Z coordinates', function (t) {
  t.plan(1);

  const input = 'MULTIPOINT Z (10 40 1, 40 30 2, 20 20 3, 30 10 4)';

  const output = wktToGeoJSON(input);

  t.deepEqual(output, {
    type: 'MultiPoint',
    properties: {
      z: true
    },
    coordinates: [ [10, 40, 1], [40, 30, 2], [20, 20, 3], [30, 10, 4] ]
  });
});

test('should parse a MULTIPOINT with alternate syntax and M coordinates', function (t) {
  t.plan(1);

  const input = 'MULTIPOINT M (10 40 1, 40 30 2, 20 20 3, 30 10 4)';

  const output = wktToGeoJSON(input);

  t.deepEqual(output, {
    type: 'MultiPoint',
    properties: {
      m: true
    },
    coordinates: [ [10, 40, 1], [40, 30, 2], [20, 20, 3], [30, 10, 4] ]
  });
});

test('should parse a MULTIPOINT with alternate syntax and Z and M coordinates', function (t) {
  t.plan(1);

  const input = 'MULTIPOINT ZM (10 40 1 2, 40 30 2 3, 20 20 3 4, 30 10 4 5)';

  const output = wktToGeoJSON(input);

  t.deepEqual(output, {
    type: 'MultiPoint',
    properties: {
      m: true,
      z: true
    },
    coordinates: [ [10, 40, 1, 2], [40, 30, 2, 3], [20, 20, 3, 4], [30, 10, 4, 5] ]
  });
});

test('should parse a MULTILINESTRING with alternate syntax', function (t) {
  t.plan(1);

  const input = 'MULTILINESTRING ((10 10, 20 20, 10 40),(40 40, 30 30, 40 20, 30 10))';

  const output = wktToGeoJSON(input);

  t.deepEqual(output, {
    type: 'MultiLineString',
    coordinates: [ [ [10, 10], [20, 20], [10, 40] ],
      [ [40, 40], [30, 30], [40, 20], [30, 10] ] ]
  });
});

test('should parse a MULTILINESTRING with alternate syntax', function (t) {
  t.plan(1);

  const input = 'MULTILINESTRING EMPTY';

  const output = wktToGeoJSON(input);

  t.deepEqual(output, {
    type: 'MultiLineString',
    coordinates: [ ]
  });
});

test('should parse a MULTILINESTRING with alternate syntax and Z coordinates', function (t) {
  t.plan(1);

  const input = 'MULTILINESTRING Z ((10 10 10, 20 20 20, 10 40 30),(40 40 30, 30 30 20, 40 20 10, 30 10 10))';

  const output = wktToGeoJSON(input);

  t.deepEqual(output, {
    type: 'MultiLineString',
    properties: {
      z: true
    },
    coordinates: [
      [ [10, 10, 10], [20, 20, 20], [10, 40, 30] ],
      [ [40, 40, 30], [30, 30, 20], [40, 20, 10], [30, 10, 10] ]
    ]
  });
});

test('should parse a MULTILINESTRING with alternate syntax and M coordinates', function (t) {
  t.plan(1);

  const input = 'MULTILINESTRING M ((10 10 10, 20 20 20, 10 40 30),(40 40 30, 30 30 20, 40 20 10, 30 10 10))';

  const output = wktToGeoJSON(input);

  t.deepEqual(output, {
    type: 'MultiLineString',
    properties: {
      m: true
    },
    coordinates: [
      [ [10, 10, 10], [20, 20, 20], [10, 40, 30] ],
      [ [40, 40, 30], [30, 30, 20], [40, 20, 10], [30, 10, 10] ]
    ]
  });
});

test('should parse a MULTILINESTRING with alternate syntax and Z and M coordinates', function (t) {
  t.plan(1);

  const input = 'MULTILINESTRING ZM ((10 10 10 5, 20 20 20 4, 10 40 30 3),(40 40 30 2, 30 30 20 1, 40 20 10 2, 30 10 10 3))';

  const output = wktToGeoJSON(input);

  t.deepEqual(output, {
    type: 'MultiLineString',
    properties: {
      z: true,
      m: true
    },
    coordinates: [
      [ [10, 10, 10, 5], [20, 20, 20, 4], [10, 40, 30, 3] ],
      [ [40, 40, 30, 2], [30, 30, 20, 1], [40, 20, 10, 2], [30, 10, 10, 3] ]
    ]
  });
});

test('should parse a MULTIPOLYGON', function (t) {
  t.plan(1);

  const input = 'MULTIPOLYGON (((30 20, 10 40, 45 40, 30 20)),((15 5, 40 10, 10 20, 5 10, 15 5)))';

  const output = wktToGeoJSON(input);

  t.deepEqual(output, {
    type: 'MultiPolygon',
    coordinates: [
      [
        [ [30, 20], [10, 40], [45, 40], [30, 20] ]
      ],
      [
        [ [15, 5], [40, 10], [10, 20], [5, 10], [15, 5] ]
      ]
    ]
  });
});

test('should parse an empty MULTIPOLYGON', function (t) {
  t.plan(1);

  const input = 'MULTIPOLYGON EMPTY';

  const output = wktToGeoJSON(input);

  t.deepEqual(output, {
    type: 'MultiPolygon',
    coordinates: [ ]
  });
});

test('should parse a MULTIPOLYGON with a Z coordinate', function (t) {
  t.plan(1);

  const input = 'MULTIPOLYGON Z (((30 20 1, 10 40 2, 45 40 3, 30 20 4)),((15 5, 40 10, 10 20, 5 10, 15 5)))';

  const output = wktToGeoJSON(input);

  t.deepEqual(output, {
    type: 'MultiPolygon',
    properties: {
      z: true
    },
    coordinates: [
      [
        [ [30, 20, 1], [10, 40, 2], [45, 40, 3], [30, 20, 4] ]
      ],
      [
        [ [15, 5], [40, 10], [10, 20], [5, 10], [15, 5] ]
      ]
    ]
  });
});

test('should parse a MULTIPOLYGON with a M coordinate', function (t) {
  t.plan(1);

  const input = 'MULTIPOLYGON M (((30 20 1, 10 40 2, 45 40 3, 30 20 4)),((15 5, 40 10, 10 20, 5 10, 15 5)))';

  const output = wktToGeoJSON(input);

  t.deepEqual(output, {
    type: 'MultiPolygon',
    properties: {
      m: true
    },
    coordinates: [
      [
        [ [30, 20, 1], [10, 40, 2], [45, 40, 3], [30, 20, 4] ]
      ],
      [
        [ [15, 5], [40, 10], [10, 20], [5, 10], [15, 5] ]
      ]
    ]
  });
});

test('should parse a MULTIPOLYGON with a Z and M coordinate', function (t) {
  t.plan(1);

  const input = 'MULTIPOLYGON ZM (((30 20 1 0, 10 40 2 1, 45 40 3 2, 30 20 4 3)),((15 5, 40 10, 10 20, 5 10, 15 5)))';

  const output = wktToGeoJSON(input);

  t.deepEqual(output, {
    type: 'MultiPolygon',
    properties: {
      m: true,
      z: true
    },
    coordinates: [
      [
        [ [30, 20, 1, 0], [10, 40, 2, 1], [45, 40, 3, 2], [30, 20, 4, 3] ]
      ],
      [
        [ [15, 5], [40, 10], [10, 20], [5, 10], [15, 5] ]
      ]
    ]
  });
});

test('should parse a MULTIPOLYGON with a hole', function (t) {
  t.plan(1);

  const input = 'MULTIPOLYGON (((40 40, 20 45, 45 30, 40 40)),((20 35, 45 20, 30 5, 10 10, 10 30, 20 35),(30 20, 20 25, 20 15, 30 20)))';

  const output = wktToGeoJSON(input);

  t.deepEqual(output, {
    type: 'MultiPolygon',
    coordinates: [
      [
        [ [40, 40], [20, 45], [45, 30], [40, 40] ]
      ],
      [
        [ [20, 35], [45, 20], [30, 5], [10, 10], [10, 30], [20, 35] ],
        [ [30, 20], [20, 25], [20, 15], [30, 20] ]
      ]
    ]
  });
});
