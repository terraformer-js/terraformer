import {
  closedPolygon,
  coordinateConvexHull
} from './util';

export const convexHull = (geojson) => {
  let coordinates = []; let i; let j;
  if (geojson.type === 'Point') {
    return null;
  } else if (geojson.type === 'LineString' || geojson.type === 'MultiPoint') {
    if (geojson.coordinates && geojson.coordinates.length >= 3) {
      coordinates = geojson.coordinates;
    } else {
      return null;
    }
  } else if (geojson.type === 'Polygon' || geojson.type === 'MultiLineString') {
    if (geojson.coordinates && geojson.coordinates.length > 0) {
      for (i = 0; i < geojson.coordinates.length; i++) {
        coordinates = coordinates.concat(geojson.coordinates[i]);
      }
      if (coordinates.length < 3) {
        return null;
      }
    } else {
      return null;
    }
  } else if (geojson.type === 'MultiPolygon') {
    if (geojson.coordinates && geojson.coordinates.length > 0) {
      for (i = 0; i < geojson.coordinates.length; i++) {
        for (j = 0; j < geojson.coordinates[i].length; j++) {
          coordinates = coordinates.concat(geojson.coordinates[i][j]);
        }
      }
      if (coordinates.length < 3) {
        return null;
      }
    } else {
      return null;
    }
  } else if (geojson.type === 'Feature') {
    return convexHull(geojson.geometry);
  }

  return {
    type: 'Polygon',
    coordinates: closedPolygon([coordinateConvexHull(coordinates)])
  };
};

export const isConvex = (points) => {
  let ltz;

  for (var i = 0; i < points.length - 3; i++) {
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2];
    const v = [p2[0] - p1[0], p2[1] - p1[1]];

    // p3.x * v.y - p3.y * v.x + v.x * p1.y - v.y * p1.x
    const res = p3[0] * v[1] - p3[1] * v[0] + v[0] * p1[1] - v[1] * p1[0];

    if (i === 0) {
      if (res < 0) {
        ltz = true;
      } else {
        ltz = false;
      }
    } else {
      if ((ltz && res > 0) || (!ltz && res < 0)) {
        return false;
      }
    }
  }

  return true;
};
