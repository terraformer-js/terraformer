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
  within,
  hasHoles
} from '../index';

test('should exist', function (t) {
  t.plan(11);
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
  t.ok(hasHoles);
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
  const circle = toCircle([-122.6764, 45.5165], 100, 32);
  t.equal(circle.type, 'Feature');
  t.ok(circle.geometry);
  t.equal(circle.geometry.coordinates[0].length, 33); // 33+1 to close the circle
  t.ok(circle.properties.center);
  t.ok(circle.properties.steps);
  t.ok(circle.properties.radius);
});

// Point
test('should calculate the bounds of a Point.', function (t) {
  t.plan(1);
  t.deepEqual(calculateBounds({
    'type': 'Point',
    'coordinates': [ 45, 60 ]
  }), [45, 60, 45, 60]);
});

test('should calculate the convex hull of a Point.', function (t) {
  t.plan(1);
  const hull = convexHull({
    'type': 'Point',
    'coordinates': [ 45, 60 ]
  });
  t.equal(hull, null);
});

test('should calculate the envelope of a Point.', function (t) {
  t.plan(1);
  t.deepEqual(calculateEnvelope({
    'type': 'Point',
    'coordinates': [ 45, 60 ]
  }), { x: 45, y: 60, w: 0, h: 0 });
});

// MultiPoint
test('should calculate the bounds of a MultiPoint.', function (t) {
  t.plan(1);
  t.deepEqual(calculateBounds(GeoJSON.multiPoints[2]), [-45, 0, 100, 122]);
});

test('should calculate the convex hull of a MultiPoint.', function (t) {
  t.plan(1);
  t.deepEqual(convexHull(GeoJSON.multiPoints[3]).coordinates, [
    [ [ 100, 0 ], [ -45, 122 ], [ 80, -60 ], [ 100, 0 ] ]
  ]);
});

test('should return null when the convex hull wouldnt be a valid Polygon.', function (t) {
  t.plan(1);
  t.equal(convexHull(GeoJSON.multiPoints[2]), null);
});

test('should calculate a MultiPoint envelope.', function (t) {
  t.plan(1);
  t.deepEqual(calculateEnvelope(GeoJSON.multiPoints[2]), { x: -45, y: 0, w: 145, h: 122 });
});

// LineString

test('should calculate the bounds of a LineString.', function (t) {
  t.plan(1);
  t.deepEqual(calculateBounds(GeoJSON.lineStrings[4]), [-45, 0, 100, 122]);
});

test('should calculate the convex hull of a LineString.', function (t) {
  t.plan(1);
  t.deepEqual(convexHull(GeoJSON.lineStrings[5]).coordinates, [
    [ [ 100, 0 ], [ -45, 122 ], [ 80, -60 ], [ 100, 0 ] ]
  ]);
});

test('should calculate the envelope of a LineString.', function (t) {
  t.plan(1);
  t.deepEqual(calculateEnvelope(GeoJSON.lineStrings[4]), { x: -45, y: 0, w: 145, h: 122 });
});

// MultiLineString

test('should calculate the bounds of a MultiLineString.', function (t) {
  t.plan(1);
  t.deepEqual(calculateBounds(GeoJSON.multiLineStrings[2]), [-115, 40, -100, 55]);
});

test('should calculate the convex hull of a MultiLineString.', function (t) {
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

test('should calculate the envelope of a MultiLineString.', function (t) {
  t.plan(1);
  t.deepEqual(calculateEnvelope(GeoJSON.multiLineStrings[2]), { x: -115, y: 40, w: 15, h: 15 });
});

// Polygon

test('should be able to recognize a non-convex Polygon.', function (t) {
  t.plan(1);
  t.notOk(isConvex(GeoJSON.polygons[1].coordinates[0]));
});

test('should be able to recognize a convex Polygon.', function (t) {
  t.plan(1);
  t.ok(isConvex(GeoJSON.polygons[0].coordinates[0]));
});

test('should calculate the bounds of a Polygon.', function (t) {
  t.plan(1);
  t.deepEqual(calculateBounds(GeoJSON.polygons[2]), [100, 0, 101, 1]);
});

test('should calculate the convex hull of a Polygon.', function (t) {
  t.plan(1);
  t.deepEqual(convexHull(GeoJSON.polygons[2]).coordinates, [
    [ [ 101, 1 ], [ 100, 1 ], [ 100, 0 ], [ 101, 0 ], [ 101, 1 ] ]
  ]);
});

test('should calculate the envelope of a Polygon.', function (t) {
  t.plan(1);
  t.deepEqual(calculateEnvelope(GeoJSON.polygons[2]), { x: 100.0, y: 0, w: 1, h: 1 });
});

test('should report hole presence properly.', function (t) {
  t.plan(2);
  t.equal(hasHoles(GeoJSON.polygons[2]), false);
  t.equal(hasHoles(GeoJSON.polygons[3]), true);
});

// MultiPolygon

test('should return true when a MultiPolygon intersects another.', function (t) {
  t.plan(1);

  const mp = {
    'type': 'MultiPolygon',
    'coordinates': [
      [
        [ [102.0, 2.0], [103.0, 2.0], [103.0, 3.0], [102.0, 3.0], [102.0, 2.0] ]
      ],
      [
        [ [100.0, 0.0], [102.0, 0.0], [102.0, 1.0], [100.0, 1.0], [100.0, 0.0] ]
      ]
    ]
  };

  t.deepEqual(intersects(GeoJSON.multiPolygons[0], mp), true);
});

test('should calculate the bounds of a MultiPolygon.', function (t) {
  t.plan(1);
  t.deepEqual(calculateBounds(GeoJSON.multiPolygons[0]), [100, 0, 103, 3]);
});

test('should calculate the convex hull of a MultiPolygon.', function (t) {
  t.plan(1);

  const mp = {
    'type': 'MultiPolygon',
    'coordinates': [
      [
        [ [102.0, 2.0], [103.0, 2.0], [103.0, 3.0], [102.0, 3.0], [102.0, 2.0] ]
      ],
      [
        [ [100.0, 0.0], [102.0, 0.0], [102.0, 1.0], [100.0, 1.0], [100.0, 0.0] ]
      ]
    ]
  };

  t.deepEqual(convexHull(mp).coordinates, [
    [
      [ 103, 3 ],
      [ 102, 3 ],
      [ 100, 1 ],
      [ 100, 0 ],
      [ 102, 0 ],
      [ 103, 2 ],
      [ 103, 3 ]
    ]
  ]);
});

test('should calculate the envelope of a MultiPolygon.', function (t) {
  t.plan(1);
  t.deepEqual(calculateEnvelope(GeoJSON.multiPolygons[0]), { x: 100, y: 0, w: 3, h: 3 });
});

// circle?

test('should calculate the bounds of a Polygon.', function (t) {
  t.plan(4);
  const circle = toCircle([-122, 45], 1000, 128);
  t.equal(Math.round(calculateBounds(circle)[0] + 'e8') + 'e-8', '-12200898315e-8');
  t.equal(Math.round(calculateBounds(circle)[1] + 'e8') + 'e-8', '4499364760e-8');
  t.equal(Math.round(calculateBounds(circle)[2] + 'e8') + 'e-8', '-12199101685e-8');
  t.equal(Math.round(calculateBounds(circle)[3] + 'e8') + 'e-8', '4500635170e-8');
});

test('should calculate the envelope of a Polygon.', function (t) {
  t.plan(4);
  const circle = toCircle([-122, 45], 1000, 128);
  t.equal(Math.round(calculateEnvelope(circle).x + 'e8') + 'e-8', '-12200898315e-8');
  t.equal(Math.round(calculateEnvelope(circle).y + 'e8') + 'e-8', '4499364760e-8');
  t.equal(Math.round(calculateEnvelope(circle).w + 'e8') + 'e-8', '1796631e-8');
  t.equal(Math.round(calculateEnvelope(circle).h + 'e8') + 'e-8', '1270410e-8');
});

// feature

test('should calculate the bounds of a Feature.', function (t) {
  t.plan(1);
  t.deepEqual(calculateBounds(GeoJSON.features[0]), [21.79, 33.75, 56.95, 71.01]);
});

test('should calculate the envelope of a Feature.', function (t) {
  t.plan(1);
  t.deepEqual(calculateEnvelope(GeoJSON.features[0]), { x: 21.79, y: 33.75, w: 35.160000000000004, h: 37.260000000000005 });
});

test('should calculate the convex hull of a Feature.', function (t) {
  t.plan(1);
  t.deepEqual(convexHull(GeoJSON.features[0]).coordinates, [
    [ [ 56.95, 33.75 ], [ 41.83, 71.01 ], [ 21.79, 36.56 ], [ 56.95, 33.75 ] ]
  ]);
});

// feature collection

test('should calculate the bounds of a FeatureCollection.', function (t) {
  t.plan(1);
  t.deepEqual(calculateBounds(GeoJSON.featureCollections[0]), [ -104.99404, 33.75, 56.95, 71.01 ]);
});

test('should calculate the envelope of a FeatureCollection.', function (t) {
  t.plan(1);
  t.deepEqual(calculateEnvelope(GeoJSON.featureCollections[0]), { x: -104.99404, y: 33.75, w: 161.94404, h: 37.260000000000005 });
});

// geometry collection

test('should calculate the bounds of a GeometryCollection.', function (t) {
  t.plan(1);
  t.deepEqual(calculateBounds(GeoJSON.geometryCollections[0]), [ -84.32281494140625, 33.73804486328907, 56.95, 71.01 ]);
});

test('should calculate the envelope of a GeometryCollection.', function (t) {
  t.plan(1);
  t.deepEqual(calculateEnvelope(GeoJSON.geometryCollections[0]), { x: -84.32281494140625, y: 33.73804486328907, w: 141.27281494140624, h: 37.271955136710936 });
});

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
