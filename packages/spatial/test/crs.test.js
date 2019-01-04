import test from 'tape';
import { GeoJSON } from './mock/geojson';
import {
  MercatorCRS,
  toMercator,
  toGeographic
} from '../index';

test('should exist', function (t) {
  t.plan(2);
  t.ok(toMercator);
  t.ok(toGeographic);
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