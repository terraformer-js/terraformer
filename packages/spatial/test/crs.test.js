import test from 'tape';

import {
  toMercator,
  toGeographic
} from '../index';

test('should exist', function (t) {
  t.plan(2);
  t.ok(toMercator);
  t.ok(toGeographic);
});

test('should project a GeoJSON Point in WGS84 to Web Mercator', function (t) {
  t.plan(1);
  const input = {
    'type': 'Point',
    'coordinates': [-122, 45]
  };
  const expectedOutput = {
    'type': 'Point',
    'coordinates': [-13580977.876779145, 5621521.486191948],
    'crs': {
      'type': 'link',
      'properties': {
        'href': 'http://spatialreference.org/ref/sr-org/6928/ogcwkt/',
        'type': 'ogcwkt'
      }
    }
  };
  toMercator(input);
  t.deepEqual(input, expectedOutput);
});

test('should project a GeoJSON LineString to Web Mercator.', function (t) {
  t.plan(1);
  const input = {
    'type': 'MultiPoint',
    'coordinates': [ [-122, 45], [100, 0], [45, 62] ]
  };
  var expectedOutput = {
    'type': 'MultiPoint',
    'coordinates': [ [-13580977.876779145, 5621521.486191948], [11131949.079327168, 0], [5009377.085697226, 8859142.800565446] ],
    'crs': {
      'type': 'link',
      'properties': {
        'href': 'http://spatialreference.org/ref/sr-org/6928/ogcwkt/',
        'type': 'ogcwkt'
      }
    }
  };
  toMercator(input);
  t.deepEqual(input, expectedOutput);
});

test('should project a GeoJSON LineString to Web Mercator.', function (t) {
  t.plan(1);
  const input = {
    'type': 'LineString',
    'coordinates': [ [-122, 45], [100, 0], [45, 62] ]
  };
  var expectedOutput = {
    'type': 'LineString',
    'coordinates': [ [-13580977.876779145, 5621521.486191948], [11131949.079327168, 0], [5009377.085697226, 8859142.800565446] ],
    'crs': {
      'type': 'link',
      'properties': {
        'href': 'http://spatialreference.org/ref/sr-org/6928/ogcwkt/',
        'type': 'ogcwkt'
      }
    }
  };
  toMercator(input);
  t.deepEqual(input, expectedOutput);
});

test('should project a GeoJSON MultiLineString to Web Mercator.', function (t) {
  t.plan(1);
  const input = {
    'type': 'MultiLineString',
    'coordinates': [
      [ [41.8359375, 71.015625], [56.953125, 33.75] ],
      [ [21.796875, 36.5625], [47.8359375, 71.015625] ]
    ]
  };
  var expectedOutput = {
    'type': 'MultiLineString',
    'coordinates': [
      [ [4657155.25935914, 11407616.835043576], [6339992.874085551, 3995282.329624162] ],
      [ [2426417.025884594, 4378299.115616046], [5325072.20411877, 11407616.835043576] ]
    ],
    'crs': {
      'type': 'link',
      'properties': {
        'href': 'http://spatialreference.org/ref/sr-org/6928/ogcwkt/',
        'type': 'ogcwkt'
      }
    }
  };
  toMercator(input);
  t.deepEqual(input, expectedOutput);
});

test('should project a GeoJSON Polygon to Web Mercator.', function (t) {
  t.plan(1);
  const input = {
    'type': 'Polygon',
    'coordinates': [
      [ [41.8359375, 71.015625], [56.953125, 33.75], [21.796875, 36.5625], [41.8359375, 71.015625] ]
    ]
  };
  var expectedOutput = {
    'type': 'Polygon',
    'coordinates': [ [ [ 4657155.25935914, 11407616.835043576 ], [ 6339992.874085551, 3995282.329624162 ], [ 2426417.025884594, 4378299.115616046 ], [ 4657155.25935914, 11407616.835043576 ] ] ],
    'crs': {
      'type': 'link',
      'properties': {
        'href': 'http://spatialreference.org/ref/sr-org/6928/ogcwkt/',
        'type': 'ogcwkt'
      }
    }
  };
  toMercator(input);
  t.deepEqual(input, expectedOutput);
});

test('should project a GeoJSON MultiPolygon to Web Mercator.', function (t) {
  t.plan(1);
  const input = {
    'type': 'MultiPolygon',
    'coordinates': [
      [
        [ [102.0, 2.0], [103.0, 2.0], [103.0, 3.0], [102.0, 3.0], [102.0, 2.0] ]
      ],
      [
        [ [100.0, 0.0], [101.0, 0.0], [101.0, 1.0], [100.0, 1.0], [100.0, 0.0] ]
      ]
    ]
  };

  var expectedOutput = {
    'type': 'MultiPolygon',
    'coordinates': [ [ [ [ 11354588.060913712, 222684.2085055407 ], [ 11465907.551706985, 222684.2085055407 ], [ 11465907.551706985, 334111.1714019535 ], [ 11354588.060913712, 334111.1714019535 ], [ 11354588.060913712, 222684.2085055407 ] ] ], [ [ [ 11131949.079327168, 0 ], [ 11243268.57012044, 0 ], [ 11243268.57012044, 111325.14286638329 ], [ 11131949.079327168, 111325.14286638329 ], [ 11131949.079327168, 0 ] ] ] ],
    'crs': {
      'type': 'link',
      'properties': {
        'href': 'http://spatialreference.org/ref/sr-org/6928/ogcwkt/',
        'type': 'ogcwkt'
      }
    }
  };
  toMercator(input);
  t.deepEqual(input, expectedOutput);
});

test('should project a GeoJSON Feature to Web Mercator.', function (t) {
  t.plan(1);
  const input = {
    'type': 'Feature',
    'id': 'foo',
    'geometry': {
      'type': 'Point',
      'coordinates': [-122, 45]
    },
    'properties': {
      'bar': 'baz'
    }
  };
  var expectedOutput = {
    'type': 'Feature',
    'id': 'foo',
    'geometry': {
      'type': 'Point',
      'coordinates': [-13580977.876779145, 5621521.486191948]
    },
    'properties': {
      'bar': 'baz'
    },
    'crs': {
      'type': 'link',
      'properties': {
        'href': 'http://spatialreference.org/ref/sr-org/6928/ogcwkt/',
        'type': 'ogcwkt'
      }
    }
  };
  toMercator(input);
  t.deepEqual(input, expectedOutput);
});

test('should project a GeoJSON FeatureCollection to Web Mercator.', function (t) {
  t.plan(1);
  const input = {
    'type': 'FeatureCollection',
    'features': [
      {
        'type': 'Feature',
        'id': 'foo',
        'geometry': {
          'type': 'Point',
          'coordinates': [-122, 45]
        },
        'properties': {
          'bar': 'baz'
        }
      }, {
        'type': 'Feature',
        'id': 'bar',
        'geometry': {
          'type': 'Point',
          'coordinates': [-122, 45]
        },
        'properties': {
          'bar': 'baz'
        }
      }
    ]
  };
  var expectedOutput = {
    'type': 'FeatureCollection',
    'features': [
      {
        'type': 'Feature',
        'id': 'foo',
        'geometry': {
          'type': 'Point',
          'coordinates': [-13580977.876779145, 5621521.486191948]
        },
        'properties': {
          'bar': 'baz'
        }
      }, {
        'type': 'Feature',
        'id': 'bar',
        'geometry': {
          'type': 'Point',
          'coordinates': [-13580977.876779145, 5621521.486191948]
        },
        'properties': {
          'bar': 'baz'
        }
      }
    ],
    'crs': {
      'type': 'link',
      'properties': {
        'href': 'http://spatialreference.org/ref/sr-org/6928/ogcwkt/',
        'type': 'ogcwkt'
      }
    }
  };
  toMercator(input);
  t.deepEqual(input, expectedOutput);
});

//
test('should project a GeoJSON GeometryCollection to Web Mercator.', function (t) {
  t.plan(1);
  const input = {
    'type': 'GeometryCollection',
    'geometries': [
      {
        'type': 'Point',
        'coordinates': [-122, 45]
      }, {
        'type': 'Point',
        'coordinates': [-122, 45]
      }
    ]
  };
  var expectedOutput = {
    'type': 'GeometryCollection',
    'geometries': [
      {
        'type': 'Point',
        'coordinates': [-13580977.876779145, 5621521.486191948]
      }, {
        'type': 'Point',
        'coordinates': [-13580977.876779145, 5621521.486191948]
      }
    ],
    'crs': {
      'type': 'link',
      'properties': {
        'href': 'http://spatialreference.org/ref/sr-org/6928/ogcwkt/',
        'type': 'ogcwkt'
      }
    }
  };
  toMercator(input);
  t.deepEqual(input, expectedOutput);
});

test('should project a GeoJSON Point to WGS84.', function (t) {
  t.plan(1);
  const input = {
    'type': 'Point',
    'coordinates': [-13656274.38035172, 5703203.67194997]
  };
  var expectedOutput = {
    'type': 'Point',
    'coordinates': [-122.67639999999798, 45.516499999999255]
  };
  const output = toGeographic(input);
  t.deepEqual(input, expectedOutput);
});

test('should project a GeoJSON MultiPoint to WGS84.', function (t) {
  t.plan(1);
  const input = {
    'type': 'MultiPoint',
    'coordinates': [ [-13656274.380351715, 5703203.671949966], [11131949.079327168, 0], [-13619241.057432571, 6261718.09354067] ]
  };
  var expectedOutput = {
    'type': 'MultiPoint',
    'coordinates': [ [ -122.67639999999793, 45.51649999999923 ], [ 99.99999999999831, 0 ], [ -122.34372399999793, 48.92247999999917 ] ]
  };
  const output = toGeographic(input);
  t.deepEqual(input, expectedOutput);
});

test('should project a GeoJSON LineString to WGS84.', function (t) {
  t.plan(1);
  const input = {
    'type': 'LineString',
    'coordinates': [ [743579.411158182, 6075718.008992066], [-7279251.077653782, 6869641.046935855], [-5831228.013819427, 5242073.5675988225] ]
  };
  var expectedOutput = {
    'type': 'LineString',
    'coordinates': [ [ 6.679687499999886, 47.8124999999992 ], [ -65.3906249999989, 52.38281249999911 ], [ -52.38281249999912, 42.53906249999928 ] ]
  };
  const output = toGeographic(input);
  t.deepEqual(input, expectedOutput);
});

test('should project a GeoJSON MultiLineString to WGS84.', function (t) {
  t.plan(1);
  const input = {
    'type': 'MultiLineString',
    'coordinates': [
      [ [41.8359375, 71.015625], [56.953125, 33.75] ],
      [ [21.796875, 36.5625], [47.8359375, 71.015625] ]
    ]
  };
  var expectedOutput = {
    'type': 'MultiLineString',
    'coordinates': [
      [ [0.00037581862081719045, 0.0006379442134689308], [0.0005116186266586962, 0.00030318140838354136] ], [ [0.00019580465958542694, 0.00032844652575519755], [0.0004297175378643617, 0.0006379442134689308] ]
    ]
  };
  const output = toGeographic(input);
  t.deepEqual(input, expectedOutput);
});

test('should project a GeoJSON Polygon to WGS84.', function (t) {
  t.plan(1);
  const input = {
    'type': 'Polygon',
    'coordinates': [
      [ [41.8359375, 71.015625], [56.953125, 33.75], [21.796875, 36.5625], [41.8359375, 71.015625] ]
    ]
  };
  var expectedOutput = {
    'type': 'Polygon',
    'coordinates': [
      [ [0.00037581862081719045, 0.0006379442134689308], [0.0005116186266586962, 0.00030318140838354136], [0.00019580465958542694, 0.00032844652575519755], [0.00037581862081719045, 0.0006379442134689308] ]
    ]
  };
  const output = toGeographic(input);
  t.deepEqual(input, expectedOutput);
});

test('should project a GeoJSON MultiPolygon to WGS84.', function (t) {
  t.plan(1);
  const input = {
    'type': 'MultiPolygon',
    'coordinates': [
      [
        [ [102.0, 2.0], [103.0, 2.0], [103.0, 3.0], [102.0, 3.0], [102.0, 2.0] ]
      ],
      [
        [ [100.0, 0.0], [101.0, 0.0], [101.0, 1.0], [100.0, 1.0], [100.0, 0.0] ]
      ]
    ]
  };

  var expectedOutput = {
    'type': 'MultiPolygon',
    'coordinates': [
      [
        [ [0.000916281589801912, 0.000017966305681987637], [0.0009252647426431071, 0.000017966305681987637], [0.0009252647426431071, 0.000026949458522981454], [0.000916281589801912, 0.000026949458522981454], [0.000916281589801912, 0.000017966305681987637] ]
      ],
      [
        [ [0.0008983152841195215, 0], [0.0009072984369607167, 0], [0.0009072984369607167, 0.000008983152840993819], [0.0008983152841195215, 0.000008983152840993819], [0.0008983152841195215, 0] ]
      ]
    ]
  };
  const output = toGeographic(input);
  t.deepEqual(input, expectedOutput);
});

test('should project a GeoJSON Feature to WGS84.', function (t) {
  t.plan(1);
  const input = {
    'type': 'Feature',
    'id': 'foo',
    'geometry': {
      'type': 'Point',
      'coordinates': [-13656274.380351715, 5703203.671949966]
    },
    'properties': {
      'bar': 'baz'
    }
  };
  var expectedOutput = {
    'type': 'Feature',
    'id': 'foo',
    'geometry': {
      'type': 'Point',
      'coordinates': [-122.67639999999793, 45.51649999999923]
    },
    'properties': {
      'bar': 'baz'
    }
  };
  const output = toGeographic(input);
  t.deepEqual(input, expectedOutput);
});

test('should project a GeoJSON FeatureCollection to WGS84.', function (t) {
  t.plan(1);
  const input = {
    'type': 'FeatureCollection',
    'features': [
      {
        'type': 'Feature',
        'id': 'foo',
        'geometry': {
          'type': 'Point',
          'coordinates': [-13656274.380351715, 5703203.671949966]
        },
        'properties': {
          'bar': 'baz'
        }
      }, {
        'type': 'Feature',
        'id': 'bar',
        'geometry': {
          'type': 'Point',
          'coordinates': [-13656274.380351715, 5703203.671949966]
        },
        'properties': {
          'bar': 'baz'
        }
      }
    ]
  };
  var expectedOutput = {
    'type': 'FeatureCollection',
    'features': [
      {
        'type': 'Feature',
        'id': 'foo',
        'geometry': {
          'type': 'Point',
          'coordinates': [-122.67639999999793, 45.51649999999923]
        },
        'properties': {
          'bar': 'baz'
        }
      }, {
        'type': 'Feature',
        'id': 'bar',
        'geometry': {
          'type': 'Point',
          'coordinates': [-122.67639999999793, 45.51649999999923]
        },
        'properties': {
          'bar': 'baz'
        }
      }
    ]
  };
  const output = toGeographic(input);
  t.deepEqual(input, expectedOutput);
});

test('should project a GeoJSON GeometryCollection to WGS84.', function (t) {
  t.plan(1);
  const input = {
    'type': 'GeometryCollection',
    'geometries': [
      {
        'type': 'Point',
        'coordinates': [-13656274.380351715, 5703203.671949966]
      }, {
        'type': 'Point',
        'coordinates': [-13656274.380351715, 5703203.671949966]
      }
    ]
  };
  var expectedOutput = {
    'type': 'GeometryCollection',
    'geometries': [
      {
        'type': 'Point',
        'coordinates': [-122.67639999999793, 45.51649999999923]
      }, {
        'type': 'Point',
        'coordinates': [-122.67639999999793, 45.51649999999923]
      }
    ]
  };
  const output = toGeographic(input);
  t.deepEqual(input, expectedOutput);
});
