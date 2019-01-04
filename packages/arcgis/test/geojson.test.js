import test from 'tape';
import { geojsonToArcGIS } from '../index.js';

test('should exist', function (t) {
  t.plan(1);
  t.ok(geojsonToArcGIS);
});

test('should convert a GeoJSON Point to an ArcGIS Point', function (t) {
  t.plan(1);

  var input = {
    'type': 'Point',
    'coordinates': [-58.7109375, 47.4609375]
  };

  var output = geojsonToArcGIS(input);

  t.deepEqual(output, {
    'x': -58.7109375,
    'y': 47.4609375,
    'spatialReference': {
      'wkid': 4326
    }
  });
});

test('should convert a GeoJSON Null Island to an ArcGIS Point', function (t) {
  t.plan(1);

  var input = {
    'type': 'Point',
    'coordinates': [0, 0]
  };

  var output = geojsonToArcGIS(input);

  t.deepEqual(output, {
    'x': 0,
    'y': 0,
    'spatialReference': {
      'wkid': 4326
    }
  });
});

test('should convert a GeoJSON LineString to an ArcGIS Polyline', function (t) {
  t.plan(1);

  var input = {
    'type': 'LineString',
    'coordinates': [
      [21.4453125, -14.0625],
      [33.3984375, -20.7421875],
      [38.3203125, -24.609375]
    ]
  };

  var output = geojsonToArcGIS(input);

  t.deepEqual(output, {
    'paths': [
      [
        [21.4453125, -14.0625],
        [33.3984375, -20.7421875],
        [38.3203125, -24.609375]
      ]
    ],
    'spatialReference': {
      'wkid': 4326
    }
  });
});

test('should convert a GeoJSON Polygon to an ArcGIS Polygon', function (t) {
  t.plan(1);

  var input = {
    'type': 'Polygon',
    'coordinates': [
      [
        [41.8359375, 71.015625],
        [56.953125, 33.75],
        [21.796875, 36.5625],
        [41.8359375, 71.015625]
      ]
    ]
  };

  var output = geojsonToArcGIS(input);

  t.deepEqual(output, {
    'rings': [
      [
        [41.8359375, 71.015625],
        [56.953125, 33.75],
        [21.796875, 36.5625],
        [41.8359375, 71.015625]
      ]
    ],
    'spatialReference': {
      'wkid': 4326
    }
  });
});

test('should convert a GeoJSON Polygon w/ a hole to an ArcGIS Polygon w/ 2 rings', function (t) {
  t.plan(1);

  var input = {
    'type': 'Polygon',
    'coordinates': [
      [
        [100.0, 0.0],
        [101.0, 0.0],
        [101.0, 1.0],
        [100.0, 1.0],
        [100.0, 0.0]
      ],
      [
        [100.2, 0.2],
        [100.8, 0.2],
        [100.8, 0.8],
        [100.2, 0.8],
        [100.2, 0.2]
      ]
    ]
  };

  var output = geojsonToArcGIS(input);

  t.deepEqual(output, {
    'rings': [
      [ [100, 0], [100, 1], [101, 1], [101, 0], [100, 0] ],
      [ [100.2, 0.2], [100.8, 0.2], [100.8, 0.8], [100.2, 0.8], [100.2, 0.2] ]
    ],
    'spatialReference': {
      'wkid': 4326
    }
  });
});

test('should strip invalid rings when converting a GeoJSON Polygon to and ArcGIS Polygon', function (t) {
  t.plan(1);

  var input = {
    'type': 'Polygon',
    'coordinates': [
      [
        [100.0, 0.0],
        [101.0, 0.0],
        [101.0, 1.0],
        [100.0, 1.0],
        [100.0, 0.0]
      ],
      [
        [100.2, 0.2],
        [100.8, 0.2],
        [100.2, 0.2]
      ]
    ]
  };

  var output = geojsonToArcGIS(input);

  t.deepEqual(output, {
    'rings': [
      [ [100, 0], [100, 1], [101, 1], [101, 0], [100, 0] ]
    ],
    'spatialReference': {
      'wkid': 4326
    }
  });
});

test('should close ring when converting a GeoJSON Polygon w/ a hole to an ArcGIS Polygon', function (t) {
  t.plan(1);

  var input = {
    'type': 'Polygon',
    'coordinates': [
      [
        [100.0, 0.0],
        [101.0, 0.0],
        [101.0, 1.0],
        [100.0, 1.0]
      ],
      [
        [100.2, 0.2],
        [100.8, 0.2],
        [100.8, 0.8],
        [100.2, 0.8]
      ]
    ]
  };

  var output = geojsonToArcGIS(input);

  t.deepEqual(output, {
    'rings': [
      [ [100, 0], [100, 1], [101, 1], [101, 0], [100, 0] ],
      [ [100.2, 0.2], [100.8, 0.2], [100.8, 0.8], [100.2, 0.8], [100.2, 0.2] ]
    ],
    'spatialReference': {
      'wkid': 4326
    }
  });
});

test('should convert a GeoJSON MultiPoint to an ArcGIS Multipoint', function (t) {
  t.plan(1);

  var input = {
    'type': 'MultiPoint',
    'coordinates': [
      [41.8359375, 71.015625],
      [56.953125, 33.75],
      [21.796875, 36.5625]
    ]
  };

  var output = geojsonToArcGIS(input);

  t.deepEqual(output, {
    'points': [
      [41.8359375, 71.015625],
      [56.953125, 33.75],
      [21.796875, 36.5625]
    ],
    'spatialReference': {
      'wkid': 4326
    }
  });
});

test('should convert a GeoJSON MultiLineString to an ArcGIS Polyline', function (t) {
  t.plan(1);

  var input = {
    'type': 'MultiLineString',
    'coordinates': [
      [
        [41.8359375, 71.015625],
        [56.953125, 33.75]
      ],
      [
        [21.796875, 36.5625],
        [47.8359375, 71.015625]
      ]
    ]
  };

  var output = geojsonToArcGIS(input);

  t.deepEqual(output, {
    'paths': [
      [
        [41.8359375, 71.015625],
        [56.953125, 33.75]
      ],
      [
        [21.796875, 36.5625],
        [47.8359375, 71.015625]
      ]
    ],
    'spatialReference': {
      'wkid': 4326
    }
  });
});

test('should convert a GeoJSON MultiPolygon to an ArcGIS Polygon', function (t) {
  t.plan(1);

  var input = {
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

  var output = geojsonToArcGIS(input);

  t.deepEqual(output, {
    'rings': [
      [ [102, 2], [102, 3], [103, 3], [103, 2], [102, 2] ],
      [ [100, 0], [100, 1], [101, 1], [101, 0], [100, 0] ]
    ],
    'spatialReference': {
      'wkid': 4326
    }
  });
});

test('should convert a GeoJSON MultiPolygon w/ holes to an ArcGIS Polygon', function (t) {
  t.plan(1);

  var input = {
    'type': 'MultiPolygon',
    'coordinates': [
      [
        [ [102.0, 2.0], [103.0, 2.0], [103.0, 3.0], [102.0, 3.0], [102.0, 2.0] ]
      ],
      [
        [ [100.0, 0.0], [101.0, 0.0], [101.0, 1.0], [100.0, 1.0], [100.0, 0.0] ],
        [ [100.2, 0.2], [100.8, 0.2], [100.8, 0.8], [100.2, 0.8], [100.2, 0.2] ]
      ]
    ]
  };

  var output = geojsonToArcGIS(input);
  t.deepEqual(output, {
    'spatialReference': {
      'wkid': 4326
    },
    'rings': [
      [
        [102, 2],
        [102, 3],
        [103, 3],
        [103, 2],
        [102, 2]
      ],
      [
        [100.2, 0.2],
        [100.8, 0.2],
        [100.8, 0.8],
        [100.2, 0.8],
        [100.2, 0.2] ],
      [
        [100, 0],
        [100, 1],
        [101, 1],
        [101, 0],
        [100, 0]
      ]
    ]
  });
});

test('should close rings when converting a GeoJSON MultiPolygon w/ holes to an ArcGIS Polygon', function (t) {
  t.plan(1);

  var input = {
    'type': 'MultiPolygon',
    'coordinates': [
      [
        [ [102.0, 2.0], [103.0, 2.0], [103.0, 3.0], [102.0, 3.0] ]
      ],
      [
        [ [100.0, 0.0], [101.0, 0.0], [101.0, 1.0], [100.0, 1.0] ],
        [ [100.2, 0.2], [100.8, 0.2], [100.8, 0.8], [100.2, 0.8] ]
      ]
    ]
  };

  var output = geojsonToArcGIS(input);
  t.deepEqual(output, {
    'spatialReference': {
      'wkid': 4326
    },
    'rings': [
      [
        [102, 2],
        [102, 3],
        [103, 3],
        [103, 2],
        [102, 2]
      ],
      [
        [100.2, 0.2],
        [100.8, 0.2],
        [100.8, 0.8],
        [100.2, 0.8],
        [100.2, 0.2]
      ],
      [
        [100, 0],
        [100, 1],
        [101, 1],
        [101, 0],
        [100, 0]
      ]
    ]
  });
});

test('should convert a GeoJSON Feature into an ArcGIS Feature', function (t) {
  t.plan(1);

  var input = {
    'type': 'Feature',
    'id': 'foo',
    'geometry': {
      'type': 'Polygon',
      'coordinates': [
        [
          [41.8359375, 71.015625],
          [56.953125, 33.75],
          [21.796875, 36.5625],
          [41.8359375, 71.015625]
        ]
      ]
    },
    'properties': {
      'foo': 'bar'
    }
  };

  var output = geojsonToArcGIS(input);

  t.deepEqual(output, {
    'geometry': {
      'rings': [
        [
          [41.8359375, 71.015625],
          [56.953125, 33.75],
          [21.796875, 36.5625],
          [41.8359375, 71.015625]
        ]
      ],
      'spatialReference': {
        'wkid': 4326
      }
    },
    'attributes': {
      'foo': 'bar',
      'OBJECTID': 'foo'
    }
  });
});

test('should convert a GeoJSON Feature into an ArcGIS Feature w/ a custom id', function (t) {
  t.plan(1);

  var input = {
    'type': 'Feature',
    'id': 'foo',
    'geometry': {
      'type': 'Polygon',
      'coordinates': [
        [ [41.8359375, 71.015625],
          [56.953125, 33.75],
          [21.796875, 36.5625],
          [41.8359375, 71.015625] ]
      ]
    },
    'properties': {
      'foo': 'bar'
    }
  };

  var output = geojsonToArcGIS(input, 'myId');

  t.deepEqual(output, {
    'geometry': {
      'rings': [
        [
          [41.8359375, 71.015625],
          [56.953125, 33.75],
          [21.796875, 36.5625],
          [41.8359375, 71.015625]
        ]
      ],
      'spatialReference': {
        'wkid': 4326
      }
    },
    'attributes': {
      'foo': 'bar',
      'myId': 'foo'
    }
  });
});

test('should allow converting a GeoJSON Feature to an ArcGIS Feature with no properties or geometry', function (t) {
  t.plan(1);

  var input = {
    'type': 'Feature',
    'id': 'foo',
    'geometry': null,
    'properties': null
  };

  var output = geojsonToArcGIS(input);

  t.deepEqual(output, {
    'attributes': {
      'OBJECTID': 'foo'
    }
  });
});

test('should convert a GeoJSON FeatureCollection into an array of ArcGIS Feature JSON', function (t) {
  t.plan(1);

  var input = {
    'type': 'FeatureCollection',
    'features': [{
      'type': 'Feature',
      'geometry': {
        'type': 'Point',
        'coordinates': [102.0, 0.5]
      },
      'properties': {
        'prop0': 'value0'
      }
    }, {
      'type': 'Feature',
      'geometry': {
        'type': 'LineString',
        'coordinates': [
          [102.0, 0.0],
          [103.0, 1.0],
          [104.0, 0.0],
          [105.0, 1.0]
        ]
      },
      'properties': {
        'prop0': 'value0'
      }
    }, {
      'type': 'Feature',
      'geometry': {
        'type': 'Polygon',
        'coordinates': [
          [ [100.0, 0.0],
            [101.0, 0.0],
            [101.0, 1.0],
            [100.0, 1.0],
            [100.0, 0.0] ]
        ]
      },
      'properties': {
        'prop0': 'value0'
      }
    }]
  };

  var output = geojsonToArcGIS(input);

  t.deepEqual(output, [{
    'geometry': {
      'x': 102,
      'y': 0.5,
      'spatialReference': {
        'wkid': 4326
      }
    },
    'attributes': {
      'prop0': 'value0'
    }
  }, {
    'geometry': {
      'paths': [
        [[102, 0],
          [103, 1],
          [104, 0],
          [105, 1]]
      ],
      'spatialReference': {
        'wkid': 4326
      }
    },
    'attributes': {
      'prop0': 'value0'
    }
  }, {
    'geometry': {
      'rings': [
        [ [100, 0],
          [100, 1],
          [101, 1],
          [101, 0],
          [100, 0] ]
      ],
      'spatialReference': {
        'wkid': 4326
      }
    },
    'attributes': {
      'prop0': 'value0'
    }
  }]);
});

test('should convert a GeoJSON GeometryCollection into an array of ArcGIS Geometries', function (t) {
  t.plan(1);

  var input = {
    'type': 'GeometryCollection',
    'geometries': [{
      'type': 'Polygon',
      'coordinates': [[[-95, 43], [-95, 50], [-90, 50], [-91, 42], [-95, 43]]]
    }, {
      'type': 'LineString',
      'coordinates': [[-89, 42], [-89, 50], [-80, 50], [-80, 42]]
    }, {
      'type': 'Point',
      'coordinates': [-94, 46]
    }]
  };

  var output = geojsonToArcGIS(input);

  t.deepEqual(output, [{
    'rings': [
      [[-95, 43],
        [-95, 50],
        [-90, 50],
        [-91, 42],
        [-95, 43]]
    ],
    'spatialReference': {
      'wkid': 4326
    }
  }, {
    'paths': [
      [[-89, 42],
        [-89, 50],
        [-80, 50],
        [-80, 42]]
    ],
    'spatialReference': {
      'wkid': 4326
    }
  }, {
    'x': -94,
    'y': 46,
    'spatialReference': {
      'wkid': 4326
    }
  }]);
});

test('should not modify the original GeoJSON object', function (t) {
  t.plan(1);

  var geojson = {
    'type': 'FeatureCollection',
    'features': [{
      'type': 'Feature',
      'geometry': {
        'type': 'Point',
        'coordinates': [102.0, 0.5]
      },
      'properties': {
        'prop0': 'value0'
      }
    }, {
      'type': 'Feature',
      'geometry': {
        'type': 'LineString',
        'coordinates': [
          [102.0, 0.0],
          [103.0, 1.0],
          [104.0, 0.0],
          [105.0, 1.0]
        ]
      },
      'properties': {
        'prop0': 'value0'
      }
    }, {
      'type': 'Feature',
      'geometry': {
        'type': 'Polygon',
        'coordinates': [
          [ [100.0, 0.0],
            [101.0, 0.0],
            [101.0, 1.0],
            [100.0, 1.0],
            [100.0, 0.0] ]
        ]
      },
      'properties': {
        'prop0': 'value0'
      }
    }]
  };

  const original = JSON.stringify(geojson);

  geojsonToArcGIS(geojson);

  t.deepEqual(original, JSON.stringify(geojson));
});