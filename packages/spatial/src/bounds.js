/*
Internal: Calculate an bounding box from an nested array of positions
[
  [
    [ [lng, lat],[lng, lat],[lng, lat] ]
  ]
  [
    [lng, lat],[lng, lat],[lng, lat]
  ]
  [
    [lng, lat],[lng, lat],[lng, lat]
  ]
]
*/
const calculateBoundsFromNestedArrays = (array) => {
  let x1 = null; let x2 = null; let y1 = null; let y2 = null;

  for (let i = 0; i < array.length; i++) {
    const inner = array[i];

    for (let j = 0; j < inner.length; j++) {
      const lonlat = inner[j];

      const lon = lonlat[0];
      const lat = lonlat[1];

      if (x1 === null) {
        x1 = lon;
      } else if (lon < x1) {
        x1 = lon;
      }

      if (x2 === null) {
        x2 = lon;
      } else if (lon > x2) {
        x2 = lon;
      }

      if (y1 === null) {
        y1 = lat;
      } else if (lat < y1) {
        y1 = lat;
      }

      if (y2 === null) {
        y2 = lat;
      } else if (lat > y2) {
        y2 = lat;
      }
    }
  }

  return [x1, y1, x2, y2];
};

/*
Internal: Calculate a bounding box from an array of arrays of arrays
[
  [ [lng, lat],[lng, lat],[lng, lat] ]
  [ [lng, lat],[lng, lat],[lng, lat] ]
  [ [lng, lat],[lng, lat],[lng, lat] ]
]
*/
const calculateBoundsFromNestedArrayOfArrays = (array) => {
  let x1 = null; let x2 = null; let y1 = null; let y2 = null;

  for (let i = 0; i < array.length; i++) {
    const inner = array[i];

    // return calculateBoundsFromNestedArrays(inner); // more DRY?
    for (let j = 0; j < inner.length; j++) {
      const innerinner = inner[j];

      for (let k = 0; k < innerinner.length; k++) {
        const lonlat = innerinner[k];

        const lon = lonlat[0];
        const lat = lonlat[1];

        if (x1 === null) {
          x1 = lon;
        } else if (lon < x1) {
          x1 = lon;
        }

        if (x2 === null) {
          x2 = lon;
        } else if (lon > x2) {
          x2 = lon;
        }

        if (y1 === null) {
          y1 = lat;
        } else if (lat < y1) {
          y1 = lat;
        }

        if (y2 === null) {
          y2 = lat;
        } else if (lat > y2) {
          y2 = lat;
        }
      }
    }
  }

  return [x1, y1, x2, y2];
};

/*
Internal: Calculate a bounding box from an array of positions
[
  [lng, lat],[lng, lat],[lng, lat]
]
*/
const calculateBoundsFromArray = (array) => {
  let x1 = null; let x2 = null; let y1 = null; let y2 = null;

  for (let i = 0; i < array.length; i++) {
    const lonlat = array[i];
    const lon = lonlat[0];
    const lat = lonlat[1];

    if (x1 === null) {
      x1 = lon;
    } else if (lon < x1) {
      x1 = lon;
    }

    if (x2 === null) {
      x2 = lon;
    } else if (lon > x2) {
      x2 = lon;
    }

    if (y1 === null) {
      y1 = lat;
    } else if (lat < y1) {
      y1 = lat;
    }

    if (y2 === null) {
      y2 = lat;
    } else if (lat > y2) {
      y2 = lat;
    }
  }

  return [x1, y1, x2, y2];
};

/*
Internal: Calculate an bounding box for a feature collection
*/
const calculateBoundsForFeatureCollection = (featureCollection) => {
  const extents = [];
  for (let i = featureCollection.features.length - 1; i >= 0; i--) {
    const extent = calculateBounds(featureCollection.features[i].geometry);
    extents.push([extent[0], extent[1]]);
    extents.push([extent[2], extent[3]]);
  }

  return calculateBoundsFromArray(extents);
};

/*
Internal: Calculate an bounding box for a geometry collection
*/
const calculateBoundsForGeometryCollection = (geometryCollection) => {
  const extents = [];

  for (let i = geometryCollection.geometries.length - 1; i >= 0; i--) {
    const extent = calculateBounds(geometryCollection.geometries[i]);
    extents.push([extent[0], extent[1]]);
    extents.push([extent[2], extent[3]]);
  }

  return calculateBoundsFromArray(extents);
};

export const calculateBounds = (geojson) => {
  if (geojson.type) {
    switch (geojson.type) {
      case 'Point':
        return [geojson.coordinates[0], geojson.coordinates[1], geojson.coordinates[0], geojson.coordinates[1]];

      case 'MultiPoint':
        return calculateBoundsFromArray(geojson.coordinates);

      case 'LineString':
        return calculateBoundsFromArray(geojson.coordinates);

      case 'MultiLineString':
        return calculateBoundsFromNestedArrays(geojson.coordinates);

      case 'Polygon':
        return calculateBoundsFromNestedArrays(geojson.coordinates);

      case 'MultiPolygon':
        return calculateBoundsFromNestedArrayOfArrays(geojson.coordinates);

      case 'Feature':
        return geojson.geometry ? calculateBounds(geojson.geometry) : null;

      case 'FeatureCollection':
        return calculateBoundsForFeatureCollection(geojson);

      case 'GeometryCollection':
        return calculateBoundsForGeometryCollection(geojson);

      default:
        throw new Error('Unknown type: ' + geojson.type);
    }
  }
  return null;
};
