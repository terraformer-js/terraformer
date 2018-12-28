import test from 'tape';
import { GeoJSON } from './mock.js';
import {
  toMercator,
  toGeographic,
  toCircle,
  // intersects,
  // contains,
  // within,
  isConvex,
  convexHull,
  calculateEnvelope,
  calculateBounds,
  MercatorCRS
} from '../index';

/* to do
convexHull
isConvex
intersects
contains
within
envelope
*/

test('should exist', function (t) {
  t.plan(5);
  t.ok(toMercator);
  t.ok(toGeographic);
  t.ok(toCircle);
  t.ok(isConvex);
  t.ok(convexHull);
  // t.ok(intersects);
  // t.ok(contains);
  // t.ok(within);
  // t.ok(calculateEnvelope);
  // t.ok(calculateBounds);
});

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

test('should be able to recognize a non-convex polygon.', function (t) {
  t.plan(1);
  t.notOk(isConvex(GeoJSON.polygons[1].coordinates[0]));
});

test('should be able to recognize a convex polygon.', function (t) {
  t.plan(1);
  t.ok(isConvex(GeoJSON.polygons[0].coordinates[0]));
});

test('should calculate the envelope of a point.', function (t) {
  t.plan(1);
  t.deepEqual(calculateEnvelope({
    'type': 'Point',
    'coordinates': [ 45, 60 ]
  }), { x: 45, y: 60, w: 0, h: 0 });
});
