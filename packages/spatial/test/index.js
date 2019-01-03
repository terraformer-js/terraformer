import test from 'tape';
import { GeoJSON } from './mock.js';
import {
  MercatorCRS,
  toMercator,
  toGeographic,
  toCircle,
  isConvex,
  convexHull,
  calculateEnvelope,
  calculateBounds,
  polygonContainsPoint,
  intersects,
  contains,
  within
} from '../index';

test('should exist', function (t) {
  t.plan(10);
  t.ok(toMercator);
  t.ok(toGeographic);
  t.ok(toCircle);
  t.ok(isConvex);
  t.ok(convexHull);
  t.ok(calculateBounds);
  t.ok(calculateEnvelope);
  t.ok(intersects);
  t.ok(contains);
  t.ok(within);
});

// helper methods
test('should reproject GeoJSON in WGS84 to Web Mercator', function (t) {
  t.plan(2);
  const mercator = toMercator(GeoJSON.points[2]);
  t.deepEqual(mercator.coordinates, [11131949.079327168, 0]);
  t.deepEqual(mercator.crs, MercatorCRS);
});

test('should reproject GeoJSON in Web Mercator to WGS84', function (t) {
  t.plan(2);
  const wgs = toGeographic({
    'type': 'Point',
    'coordinates': [ 11354588.06, 222684.20 ]
  });
  // HT http://www.jacklmoore.com/notes/rounding-in-javascript/
  t.equal(Math.round(wgs.coordinates[0] + 'e8') + 'e-8', '10199999999e-8');
  t.equal(Math.round(wgs.coordinates[1] + 'e8') + 'e-8', '199999992e-8');
});

test('should create a circular GeoJSON polygon from an input point.', function (t) {
  t.plan(6);
  const circle = toCircle([-122.6764, 45.5165], 100);
  t.equal(circle.type, 'Feature');
  t.ok(circle.geometry);
  t.ok(circle.geometry.coordinates);
  t.ok(circle.properties.center);
  t.ok(circle.properties.steps);
  t.ok(circle.properties.radius);
});

// point
test('should calculate the bounds of a point.', function (t) {
  t.plan(1);
  t.deepEqual(calculateBounds({
    'type': 'Point',
    'coordinates': [ 45, 60 ]
  }), [45, 60, 45, 60]);
});

test('should calculate the convex hull of a point.', function (t) {
  t.plan(1);
  const hull = convexHull({
    'type': 'Point',
    'coordinates': [ 45, 60 ]
  });
  t.equal(hull, null);
});

test('should calculate the envelope of a point.', function (t) {
  t.plan(1);
  t.deepEqual(calculateEnvelope({
    'type': 'Point',
    'coordinates': [ 45, 60 ]
  }), { x: 45, y: 60, w: 0, h: 0 });
});

// multipoint
test('should calculate the bounds of a multipoint.', function (t) {
  t.plan(1);
  t.deepEqual(calculateBounds(GeoJSON.multiPoints[2]), [-45, 0, 100, 122]);
});

test('should calculate the convex hull of a multipoint.', function (t) {
  t.plan(1);
  t.deepEqual(convexHull(GeoJSON.multiPoints[3]).coordinates, [
    [ [ 100, 0 ], [ -45, 122 ], [ 80, -60 ], [ 100, 0 ] ]
  ]);
});

test('should return null when a convex hull cannot return a valid Polygon.', function (t) {
  t.plan(1);
  t.equal(convexHull(GeoJSON.multiPoints[2]), null);
});

test('should calculate a multipoint envelope.', function (t) {
  t.plan(1);
  t.deepEqual(calculateEnvelope(GeoJSON.multiPoints[2]), { x: -45, y: 0, w: 145, h: 122 });
});

// linestring

test('should calculate the bounds of a linestring.', function (t) {
  t.plan(1);
  t.deepEqual(calculateBounds(GeoJSON.lineStrings[4]), [-45, 0, 100, 122]);
});

test('should calculate the convex hull of a linestring.', function (t) {
  t.plan(1);
  t.deepEqual(convexHull(GeoJSON.lineStrings[5]).coordinates, [
    [ [ 100, 0 ], [ -45, 122 ], [ 80, -60 ], [ 100, 0 ] ]
  ]);
});

test('should calculate the envelope of a linestring.', function (t) {
  t.plan(1);
  t.deepEqual(calculateEnvelope(GeoJSON.lineStrings[4]), { x: -45, y: 0, w: 145, h: 122 });
});

// multilinestring

test('should calculate the bounds of a multilinestring.', function (t) {
  t.plan(1);
  t.deepEqual(calculateBounds(GeoJSON.multiLineStrings[2]), [-115, 40, -100, 55]);
});

test('should calculate the convex hull of a multilinestring.', function (t) {
  t.plan(1);
  t.deepEqual(convexHull({
    'type': 'MultiLineString',
    'coordinates': [
      [ [-105, 40], [-110, 45], [-115, 55] ],
      [ [-100, 40], [-105, 45], [-110, 55] ]
    ] }).coordinates, [
    [ [ -100, 40 ], [ -110, 55 ], [ -115, 55 ], [ -110, 45 ], [ -105, 40 ], [ -100, 40 ] ]
  ]);
});

test('should calculate the envelope of a multilinestring.', function (t) {
  t.plan(1);
  t.deepEqual(calculateEnvelope(GeoJSON.multiLineStrings[2]), { x: -115, y: 40, w: 15, h: 15 });
});

// polygon

test('should be able to recognize a non-convex polygon.', function (t) {
  t.plan(1);
  t.notOk(isConvex(GeoJSON.polygons[1].coordinates[0]));
});

test('should be able to recognize a convex polygon.', function (t) {
  t.plan(1);
  t.ok(isConvex(GeoJSON.polygons[0].coordinates[0]));
});

// multipolygon

// circle?

// feature

// feature collection

// geometry collection

// intersects

// within

// catch all

test('should return false when polygonContainsPoint is passed an empty polygon.', function (t) {
  t.plan(1);
  t.equal(polygonContainsPoint([], []), false);
});

test('should return true when polygonContainsPoint is passed the right stuff.', function (t) {
  t.plan(1);

  const pt = [-111.873779, 40.647303];
  const polygon = [[
    [-112.074279, 40.52215],
    [-112.074279, 40.853293],
    [-111.610107, 40.853293],
    [-111.610107, 40.52215],
    [-112.074279, 40.52215]
  ]];

  t.equal(polygonContainsPoint(polygon, pt), true);
});

test('should return false if a polygonContainsPoint is called and the point is outside the polygon.', function (t) {
  t.plan(1);

  t.equal(polygonContainsPoint([[1, 2], [2, 2], [2, 1], [1, 1], [1, 2]], [10, 10]), false);
});
