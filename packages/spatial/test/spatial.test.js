import test from 'tape';
import { GeoJSON } from './mock/geojson';

import { coordinatesEqual, hasHoles } from '../src/util';

import {
  toCircle,
  isConvex,
  convexHull,
  calculateEnvelope,
  calculateBounds,
  polygonContainsPoint,
  intersects,
  contains,
  within
} from '../src/index';

test('should exist', function (t) {
  t.plan(10);
  t.ok(toCircle);
  t.ok(isConvex);
  t.ok(convexHull);
  t.ok(calculateBounds);
  t.ok(calculateEnvelope);
  t.ok(intersects);
  t.ok(contains);
  t.ok(within);
  t.ok(hasHoles);
  t.ok(coordinatesEqual);
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
    type: 'Point',
    coordinates: [45, 60]
  }), [45, 60, 45, 60]);
});

test('should calculate the convex hull of a Point.', function (t) {
  t.plan(1);
  const hull = convexHull({
    type: 'Point',
    coordinates: [45, 60]
  });
  t.equal(hull, null);
});

test('should calculate the envelope of a Point.', function (t) {
  t.plan(1);
  t.deepEqual(calculateEnvelope({
    type: 'Point',
    coordinates: [45, 60]
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
    [[100, 0], [-45, 122], [80, -60], [100, 0]]
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
    [[100, 0], [-45, 122], [80, -60], [100, 0]]
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
    type: 'MultiLineString',
    coordinates: [
      [[-105, 40], [-110, 45], [-115, 55]],
      [[-100, 40], [-105, 45], [-110, 55]]
    ]
  }).coordinates, [
    [[-100, 40], [-110, 55], [-115, 55], [-110, 45], [-105, 40], [-100, 40]]
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
    [[101, 1], [100, 1], [100, 0], [101, 0], [101, 1]]
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
    type: 'MultiPolygon',
    coordinates: [
      [
        [[102.0, 2.0], [103.0, 2.0], [103.0, 3.0], [102.0, 3.0], [102.0, 2.0]]
      ],
      [
        [[100.0, 0.0], [102.0, 0.0], [102.0, 1.0], [100.0, 1.0], [100.0, 0.0]]
      ]
    ]
  };

  t.deepEqual(intersects(GeoJSON.multiPolygons[0], mp), true);
});

test('should return true when a Polygon overlap-intersects at least one polygon of MultiPolygon.', function (t) {
  t.plan(1);

  const p = {
    type: 'Polygon',
    coordinates: [
      [[102.0, 2.0], [103.0, 2.0], [103.0, 3.0], [102.0, 3.0], [102.0, 2.0]]
    ]
  };

  t.deepEqual(intersects(GeoJSON.multiPolygons[0], p), true);
});

test('should return true when a Polygon actually intersects at least one polygon of MultiPolygon.', function (t) {
  t.plan(1);

  const p = {
    type: 'Polygon',
    coordinates: [
      [[102.5, 1.5], [103.5, 1.5], [103.5, 3.5], [102.5, 3.5], [102.5, 1.5]]
    ]
  };

  t.deepEqual(intersects(GeoJSON.multiPolygons[0], p), true);
});

test('should return true when a Polygon intersects a MultiPolygon by containing at least one polygon of the component polygons.', function (t) {
  t.plan(1);

  const p = {
    type: 'Polygon',
    coordinates: [
      [[101.5, 1.5], [103.5, 1.5], [103.5, 3.5], [101.5, 3.5], [101.5, 1.5]]
    ]
  };

  t.deepEqual(intersects(GeoJSON.multiPolygons[0], p), true);
});

test('should calculate the bounds of a MultiPolygon.', function (t) {
  t.plan(1);
  t.deepEqual(calculateBounds(GeoJSON.multiPolygons[0]), [100, 0, 103, 3]);
});

test('should calculate the convex hull of a MultiPolygon.', function (t) {
  t.plan(1);

  const mp = {
    type: 'MultiPolygon',
    coordinates: [
      [
        [[102.0, 2.0], [103.0, 2.0], [103.0, 3.0], [102.0, 3.0], [102.0, 2.0]]
      ],
      [
        [[100.0, 0.0], [102.0, 0.0], [102.0, 1.0], [100.0, 1.0], [100.0, 0.0]]
      ]
    ]
  };

  t.deepEqual(convexHull(mp).coordinates, [
    [
      [103, 3],
      [102, 3],
      [100, 1],
      [100, 0],
      [102, 0],
      [103, 2],
      [103, 3]
    ]
  ]);
});

test('should calculate the envelope of a MultiPolygon.', function (t) {
  t.plan(1);
  t.deepEqual(calculateEnvelope(GeoJSON.multiPolygons[0]), { x: 100, y: 0, w: 3, h: 3 });
});

// circle?

test('should calculate the bounds of a Circle.', function (t) {
  t.plan(4);
  const circle = toCircle([-122, 45], 1000, 128);
  console.log(JSON.stringify(calculateBounds(circle)));
  t.equal(calculateBounds(circle)[0], -122.01268281715086);
  t.equal(calculateBounds(circle)[1], 44.99100166654031);
  t.equal(calculateBounds(circle)[2], -121.98731718284914);
  t.equal(calculateBounds(circle)[3], 45.00899831922144);
});

test('should calculate the envelope of a Circle.', function (t) {
  t.plan(4);
  const circle = toCircle([-122, 45], 1000, 128);
  console.log(JSON.stringify(calculateEnvelope(circle)));
  t.equal(calculateEnvelope(circle).x, -122.01268281715086);
  t.equal(calculateEnvelope(circle).y, 44.99100166654031);
  t.equal(calculateEnvelope(circle).w, 0.02536563430172123);
  t.equal(calculateEnvelope(circle).h, 0.017996652681127046);
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
    [[56.95, 33.75], [41.83, 71.01], [21.79, 36.56], [56.95, 33.75]]
  ]);
});

// feature collection

test('should calculate the bounds of a FeatureCollection.', function (t) {
  t.plan(1);
  t.deepEqual(calculateBounds(GeoJSON.featureCollections[0]), [-104.99404, 33.75, 56.95, 71.01]);
});

test('should calculate the envelope of a FeatureCollection.', function (t) {
  t.plan(1);
  t.deepEqual(calculateEnvelope(GeoJSON.featureCollections[0]), { x: -104.99404, y: 33.75, w: 161.94404, h: 37.260000000000005 });
});

// geometry collection

test('should calculate the bounds of a GeometryCollection.', function (t) {
  t.plan(1);
  t.deepEqual(calculateBounds(GeoJSON.geometryCollections[0]), [-84.32281494140625, 33.73804486328907, 56.95, 71.01]);
});

test('should calculate the envelope of a GeometryCollection.', function (t) {
  t.plan(1);
  t.deepEqual(calculateEnvelope(GeoJSON.geometryCollections[0]), { x: -84.32281494140625, y: 33.73804486328907, w: 141.27281494140624, h: 37.271955136710936 });
});

// intersects MultiLineString

test('should correctly determine intersection with a LineString', function (t) {
  t.plan(1);
  t.equal(intersects(GeoJSON.multiLineStrings[3], {
    type: 'LineString',
    coordinates: [
      [0, 10], [15, 5]
    ]
  }), true);
});

test('should correctly determine intersection with a MultiLineString', function (t) {
  t.plan(1);
  t.equal(intersects(GeoJSON.multiLineStrings[3], {
    type: 'MultiLineString',
    coordinates: [
      [[0, 10], [15, 5]]
    ]
  }), true);
});

test('should correctly determine intersection with a Polygon', function (t) {
  t.plan(1);
  t.equal(intersects(GeoJSON.multiLineStrings[3], {
    type: 'Polygon',
    coordinates: [
      [[0, 5], [10, 5], [10, 0], [0, 0]]
    ]
  }), true);
});

test('should correctly determine intersection with a MultiPolygon', function (t) {
  t.plan(1);
  t.equal(intersects(GeoJSON.multiLineStrings[3], {
    type: 'MultiPolygon',
    coordinates: [
      [[[0, 5], [10, 5], [10, 0], [0, 0]]]
    ]
  }), true);
});

// intersects Polygon

test('should correctly determine intersection with itself', function (t) {
  t.plan(1);
  t.equal(intersects(GeoJSON.polygons[4], GeoJSON.polygons[4]), true);
});

test('should correctly determine intersection with a Polygon', function (t) {
  t.plan(1);
  t.equal(intersects(GeoJSON.polygons[4], {
    type: 'Polygon',
    coordinates: [
      [[1, 1], [11, 1], [11, 6], [1, 6]]
    ]
  }), true);
});

test('should correctly determine intersection with a MultiPolygon', function (t) {
  t.plan(1);
  t.equal(intersects(GeoJSON.polygons[4], {
    type: 'MultiPolygon',
    coordinates: [
      [[[1, 1], [11, 1], [11, 6], [1, 6]]]
    ]
  }), true);
});

test('should correctly determine intersection with a MultiLineString', function (t) {
  t.plan(1);
  t.equal(intersects(GeoJSON.polygons[4], {
    type: 'MultiLineString',
    coordinates: [
      [[1, 1], [11, 1], [11, 6], [1, 6]]
    ]
  }), true);
});

test('should correctly determine intersection with a LineString', function (t) {
  t.plan(1);
  t.equal(intersects(GeoJSON.polygons[4], {
    type: 'LineString',
    coordinates: [
      [1, 1], [11, 1], [11, 6], [1, 6]
    ]
  }), true);
});

test('should correctly determine intersection with a MultiPolygon', function (t) {
  t.plan(1);
  t.equal(intersects(GeoJSON.polygons[4], {
    type: 'MultiPolygon',
    coordinates: [
      [[[1, 1], [11, 1], [11, 6], [1, 6]]]
    ]
  }), true);
});

test('should correctly determine intersection with a MultiPolygon in reverse', function (t) {
  t.plan(1);
  t.equal(intersects({
    type: 'MultiPolygon',
    coordinates: [
      [[[1, 1], [11, 1], [11, 6], [1, 6], [1, 1]]]
    ]
  }, GeoJSON.polygons[4]), true);
});

// intersects MultiPolygon

test('should return false if two MultiPolygons do not intersect.', function (t) {
  t.plan(1);
  t.equal(intersects({
    type: 'MultiPolygon',
    coordinates: [
      [[[48.5, -122.5], [50, -123], [48.5, -122.5]]]
    ]
  }, {
    type: 'MultiPolygon',
    coordinates: [
      [[[1, 2], [3, 4], [5, 6]]]
    ]
  }), false);
});

// intersects LineString

test('should correctly determine intersection with a LineString.', function (t) {
  t.plan(1);
  t.equal(intersects(GeoJSON.lineStrings[6], {
    type: 'LineString',
    coordinates: [
      [46, -121], [44, -124]
    ]
  }), true);
});

test('should know that parellel lines dont intersect.', function (t) {
  t.plan(1);
  t.equal(intersects(GeoJSON.lineStrings[6], {
    type: 'LineString',
    coordinates: [
      [44, -121], [45, -122]
    ]
  }), false);
});

test('should know that a line cant intersect itself.', function (t) {
  t.plan(1);
  t.equal(intersects(GeoJSON.lineStrings[6], {
    type: 'LineString',
    coordinates: [
      [45, -122], [46, -123]
    ]
  }), false);
});

test('should correctly determine intersection with a Polygon.', function (t) {
  t.plan(1);
  t.equal(intersects(GeoJSON.lineStrings[6], {
    type: 'Polygon',
    coordinates: [
      [[45.5, -122.5], [47, -123], [45.5, -122.5]]
    ]
  }), true);
});

test('should correctly determine lack of intersection with a Polygon.', function (t) {
  t.plan(1);
  t.equal(intersects(GeoJSON.lineStrings[6], {
    type: 'Polygon',
    coordinates: [
      [[48.5, -122.5], [50, -123], [48.5, -122.5]]
    ]
  }), false);
});

test('should correctly determine intersection with a MultiLineString.', function (t) {
  t.plan(1);
  t.equal(intersects(GeoJSON.lineStrings[6], {
    type: 'MultiLineString',
    coordinates: [
      [[45.5, -122.5], [47, -123], [45.5, -122.5]]
    ]
  }), true);
});

test('should correctly determine lack of intersection with a MultiLineString.', function (t) {
  t.plan(1);
  t.equal(intersects(GeoJSON.lineStrings[6], {
    type: 'MultiLineString',
    coordinates: [
      [[48.5, -122.5], [50, -123], [48.5, -122.5]]
    ]
  }), false);
});

test('should correctly determine intersection with a MultiPolygon.', function (t) {
  t.plan(1);
  t.equal(intersects(GeoJSON.lineStrings[6], {
    type: 'MultiPolygon',
    coordinates: [
      [[45.5, -122.5], [47, -123], [45.5, -122.5]]
    ]
  }), true);
});

test('should correctly determine lack of intersection with a MultiPolygon.', function (t) {
  t.plan(1);
  t.equal(intersects(GeoJSON.lineStrings[6], {
    type: 'MultiPolygon',
    coordinates: [
      [[[48.5, -122.5], [50, -123], [48.5, -122.5]]]
    ]
  }), false);
});

test('should correctly determine lack of intersection with a MultiPolygon in reverse.', function (t) {
  t.plan(1);
  t.equal(intersects({
    type: 'MultiPolygon',
    coordinates: [
      [[[48.5, -122.5], [50, -123], [48.5, -122.5]]]
    ]
  }, GeoJSON.lineStrings[6]), false);
});

// Point within

test('should return true when inside a polygon.', function (t) {
  t.plan(1);
  t.equal(within(GeoJSON.points[3], {
    type: 'Polygon',
    coordinates: [
      [[5, 5], [5, 15], [15, 15], [15, 5], [5, 5]]
    ]
  }), true);
});

test('should return false when not inside a polygon.', function (t) {
  t.plan(1);
  t.equal(within(GeoJSON.points[3], {
    type: 'Polygon',
    coordinates: [
      [[25, 25], [25, 35], [35, 35], [35, 25], [25, 25]]
    ]
  }), false);
});

test('should return true when its the same point.', function (t) {
  t.plan(1);
  t.equal(within(GeoJSON.points[3], {
    type: 'Point',
    coordinates: [10, 10]
  }), true);
});

test('should return false when its not the same point.', function (t) {
  t.plan(1);
  t.equal(within(GeoJSON.points[3], {
    type: 'Point',
    coordinates: [11, 11]
  }), false);
});

test('should return true when inside a MultiPolygon.', function (t) {
  t.plan(1);
  t.equal(within(GeoJSON.points[3], {
    type: 'MultiPolygon',
    coordinates: [
      [[[25, 25], [25, 35], [35, 35], [35, 25], [25, 25]]], [[[5, 5], [15, 5], [15, 15], [5, 15], [5, 5]]]
    ]
  }), true);
});

test('should return false when not inside a MultiPolygon.', function (t) {
  t.plan(1);
  t.equal(within(GeoJSON.points[3], {
    type: 'MultiPolygon',
    coordinates: [
      [[[25, 25], [25, 35], [35, 35], [35, 25], [25, 25]]], [[[15, 15], [25, 15], [25, 25], [15, 25], [15, 15]]]
    ]
  }), false);
});

test('should return false when inside the hole of a Polygon.', function (t) {
  t.plan(1);
  t.equal(within(GeoJSON.points[3], {
    type: 'Polygon',
    coordinates: [
      [[5, 5], [5, 15], [15, 15], [15, 5], [5, 5]], [[9, 9], [9, 11], [11, 11], [11, 9], [9, 9]]
    ]
  }), false);
});

test('should return true when not inside the hole of a Polygon.', function (t) {
  t.plan(1);
  t.equal(within(GeoJSON.points[3], {
    type: 'Polygon',
    coordinates: [
      [[5, 5], [5, 15], [15, 15], [15, 5], [5, 5]], [[9, 9], [9, 9.5], [9.5, 9.5], [9.5, 9], [9, 9]]
    ]
  }), true);
});

test('should return true when inside a Circle.', function (t) {
  t.plan(1);
  const circle = toCircle([10, 10], 50, 64);
  t.equal(within(GeoJSON.points[3], circle), true);
});

// MultiPolygon within

test('should return true if a linestring is within a multipolygon.', function (t) {
  t.plan(1);
  t.equal(within({
    type: 'LineString',
    coordinates: [
      [6, 6], [6, 14]
    ]
  }, GeoJSON.multiPolygons[3]), true);
});

test('should return true if a multipoint is within a multipolygon.', function (t) {
  t.plan(1);
  t.equal(within({
    type: 'MultiPoint',
    coordinates: [
      [6, 6], [6, 14]
    ]
  }, GeoJSON.multiPolygons[3]), true);
});

test('should return true if a multilinestring is within a multipolygon.', function (t) {
  t.plan(1);
  t.equal(within({
    type: 'MultiLineString',
    coordinates: [
      [[6, 6], [6, 14]]
    ]
  }, GeoJSON.multiPolygons[3]), true);
});

test('should return false if part of a multilinestring is not within a multipolygon.', function (t) {
  t.plan(1);
  t.equal(within({
    type: 'MultiLineString',
    coordinates: [
      [[6, 6], [6, 14]], [[1, 1], [1, 2]]
    ]
  }, GeoJSON.multiPolygons[3]), false);
});

test('should return true if a multipolygon is within a multipolygon.', function (t) {
  t.plan(1);
  t.equal(within(GeoJSON.multiPolygons[3], {
    type: 'MultiPolygon',
    coordinates: [
      [[[1, 1], [1, 40], [40, 40], [40, 1], [1, 1]]]
    ]
  }), true);
});

// more Point within

test('should return true if a point is within a multipoint.', function (t) {
  t.plan(1);
  t.equal(within(GeoJSON.points[4], {
    type: 'MultiPoint',
    coordinates: [
      [1, 1], [2, 2], [3, 3], [6, 6]
    ]
  }), true);
});

test('should return false if a point is within a multipoint with different length.', function (t) {
  t.plan(1);
  t.equal(within(GeoJSON.points[4], {
    type: 'MultiPoint',
    coordinates: [
      [1, 1, 1], [2, 2, 2], [3, 3, 3], [6, 6, 6]
    ]
  }), false);
});

test('should return true if a point is within a linestring.', function (t) {
  t.plan(1);
  t.equal(within(GeoJSON.points[4], {
    type: 'LineString',
    coordinates: [
      [1, 1], [2, 2], [3, 3], [6, 6]
    ]
  }), true);
});

test('should return true if a point is within a multilinestring.', function (t) {
  t.plan(1);
  t.equal(within(GeoJSON.points[4], {
    type: 'MultiLineString',
    coordinates: [
      [[1, 1], [2, 2], [3, 3], [6, 6]]
    ]
  }), true);
});

// Polygon within

test('should return true if a polygon is within a polygon.', function (t) {
  t.plan(1);
  t.equal(within(GeoJSON.polygons[5], {
    type: 'Polygon',
    coordinates: [
      [[3, 3], [3, 18], [18, 18], [18, 3], [3, 3]]
    ]
  }), true);
});

test('should return false when a polygon is not within a polygon.', function (t) {
  t.plan(1);
  t.equal(within(GeoJSON.polygons[5], {
    type: 'Polygon',
    coordinates: [
      [[25, 25], [25, 35], [35, 35], [35, 25], [25, 25]]
    ]
  }), false);
});

test('should return true when within is passed the same polygon twice.', function (t) {
  t.plan(1);
  t.equal(within(GeoJSON.polygons[5], {
    type: 'Polygon',
    coordinates: [
      [[5, 5], [5, 15], [15, 15], [15, 5], [5, 5]]
    ]
  }), true);
});

test('should return true if a polygon is within a multipolygon.', function (t) {
  t.plan(1);
  t.equal(within(GeoJSON.polygons[5], {
    type: 'MultiPolygon',
    coordinates: [
      [[[25, 25], [25, 35], [35, 35], [35, 25], [25, 25]]], [[[3, 3], [18, 3], [18, 18], [3, 18], [3, 3]]]
    ]
  }), true);
});

test('should return false if a polygon is not within a multipolygon.', function (t) {
  t.plan(1);
  t.equal(within(GeoJSON.polygons[5], {
    type: 'MultiPolygon',
    coordinates: [
      [[[25, 25], [25, 35], [35, 35], [35, 25], [25, 25]]], [[[15, 15], [25, 15], [25, 25], [15, 25], [15, 15]]]
    ]
  }), false);
});

test('should return true when one of the polygons is the same polygon.', function (t) {
  t.plan(1);
  t.equal(within(GeoJSON.polygons[5], {
    type: 'MultiPolygon',
    coordinates: [
      [[[5, 5], [5, 15], [15, 15], [15, 5], [5, 5]]], [[[1, 1], [1, 2], [2, 1]]]
    ]
  }), true);
});

test('should return true if all of the points in a linestring are in the same polygon.', function (t) {
  t.plan(1);
  t.equal(within({
    type: 'LineString',
    coordinates: [
      [6, 6], [6, 14], [14, 14]
    ]
  }, GeoJSON.polygons[5]), true);
});

test('should return true if all of the points in a multipoint are in the same polygon.', function (t) {
  t.plan(1);
  t.equal(within({
    type: 'MultiPoint',
    coordinates: [
      [6, 6], [6, 14], [14, 14]
    ]
  }, GeoJSON.polygons[5]), true);
});

test('should return false if one of the points in a linestring is outside the polygon.', function (t) {
  t.plan(1);
  t.equal(within({
    type: 'LineString',
    coordinates: [
      [6, 6], [6, 14], [16, 16]
    ]
  }, GeoJSON.polygons[5]), false);
});

test('should return false if one of the points in a multipoint is outside the polygon.', function (t) {
  t.plan(1);
  t.equal(within({
    type: 'MultiPoint',
    coordinates: [
      [6, 6], [6, 14], [16, 16]
    ]
  }, GeoJSON.polygons[5]), false);
});

test('should return true if a multilinestring is within a polygon.', function (t) {
  t.plan(1);
  t.equal(within({
    type: 'MultiLineString',
    coordinates: [
      [[6, 6], [6, 14]]
    ]
  }, GeoJSON.polygons[5]), true);
});

test('should return false if a part of a multilinestring is not within a polygon.', function (t) {
  t.plan(1);
  t.equal(within({
    type: 'MultiLineString',
    coordinates: [
      [[6, 6], [6, 14]], [[1, 1], [1, 2]]
    ]
  }, GeoJSON.polygons[5]), false);
});

test('should return true if a multipolygon is within a polygon.', function (t) {
  t.plan(1);
  t.equal(within({
    type: 'MultiPolygon',
    coordinates: [
      [[[6, 14], [14, 14], [14, 6], [6, 6], [6, 14]]]
    ]
  }, GeoJSON.polygons[5]), true);
});

test('should return false if an empty linestring is within checked against a polygon.', function (t) {
  t.plan(1);
  t.equal(within({
    type: 'LineString',
    coordinates: []
  }, GeoJSON.polygons[5]), false);
});

// catch all

test('should return null for convexHull of empty Point.', function (t) {
  t.plan(1);
  t.equal(convexHull({
    type: 'Point',
    coordinates: []
  }), null);
});

test('should return null for convexHull of empty LineString.', function (t) {
  t.plan(1);
  t.equal(convexHull({
    type: 'LineString',
    coordinates: []
  }), null);
});

test('should return null for convexHull of empty Polygon.', function (t) {
  t.plan(1);
  t.equal(convexHull({
    type: 'Polygon',
    coordinates: []
  }), null);
});

test('should return null for convexHull of empty MultiPolygon.', function (t) {
  t.plan(1);
  t.equal(convexHull({
    type: 'MultiPolygon',
    coordinates: []
  }), null);
});

test('should return null for convexHull if a Feature has no geometry.', function (t) {
  t.plan(1);
  t.equal(convexHull({
    type: 'Feature',
    geometry: {
      type: 'Polygon',
      coordinates: []
    }
  }), null);
});

test('should throw an error for an unknown type in calculateBounds.', function (t) {
  t.plan(1);
  try {
    calculateBounds({ type: 'foobar' });
    t.fail('whoops!');
  } catch (err) {
    t.pass('great jorb!');
  }
});

test('should return null when there is no geometry in a Feature in calculateBounds.', function (t) {
  t.plan(1);
  t.equal(calculateBounds({
    type: 'Feature',
    geometry: null
  }), null);
});

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

test('should return false if coordinatesEqual are given non-equal lengths.', function (t) {
  t.plan(1);

  t.equal(coordinatesEqual([[1, 2]], [[1, 2], [2, 3]]), false);
});

test('should return false if coordinatesEqual coordinates are non-equal lengths.', function (t) {
  t.plan(1);

  t.equal(coordinatesEqual([[1, 2]], [[1, 2, 3]]), false);
});
