import {
  arraysIntersectArrays,
  pointsEqual
} from '@terraformer/common';

import { closedPolygon, coordinatesEqual } from './util';

import { polygonContainsPoint } from './polygon';

export const within = (geoJSON, comparisonGeoJSON) => {
  let coordinates, i, contains;

  // if we are passed a feature, use the polygon inside instead
  if (comparisonGeoJSON.type === 'Feature') {
    comparisonGeoJSON = comparisonGeoJSON.geometry;
  }

  // point.within(point) :: equality
  if (comparisonGeoJSON.type === 'Point') {
    if (geoJSON.type === 'Point') {
      return pointsEqual(geoJSON.coordinates, comparisonGeoJSON.coordinates);
    }
  }

  // point.within(multilinestring)
  if (comparisonGeoJSON.type === 'MultiLineString') {
    if (geoJSON.type === 'Point') {
      for (i = 0; i < geoJSON.coordinates.length; i++) {
        const linestring = { type: 'LineString', coordinates: comparisonGeoJSON.coordinates[i] };

        if (within(geoJSON, linestring)) {
          return true;
        }
      }
    }
  }

  // point.within(linestring), point.within(multipoint)
  if (comparisonGeoJSON.type === 'LineString' || comparisonGeoJSON.type === 'MultiPoint') {
    if (geoJSON.type === 'Point') {
      for (i = 0; i < comparisonGeoJSON.coordinates.length; i++) {
        if (geoJSON.coordinates.length !== comparisonGeoJSON.coordinates[i].length) {
          return false;
        }

        if (pointsEqual(geoJSON.coordinates, comparisonGeoJSON.coordinates[i])) {
          return true;
        }
      }
    }
  }

  if (comparisonGeoJSON.type === 'Polygon') {
    // polygon.within(polygon)
    if (geoJSON.type === 'Polygon') {
      // check for equal polygons
      if (comparisonGeoJSON.coordinates.length === geoJSON.coordinates.length) {
        for (i = 0; i < geoJSON.coordinates.length; i++) {
          if (coordinatesEqual(geoJSON.coordinates[i], comparisonGeoJSON.coordinates[i])) {
            return true;
          }
        }
      }

      if (geoJSON.coordinates.length && polygonContainsPoint(comparisonGeoJSON.coordinates, geoJSON.coordinates[0][0])) {
        return !arraysIntersectArrays(closedPolygon(geoJSON.coordinates), closedPolygon(comparisonGeoJSON.coordinates));
      } else {
        return false;
      }

      // point.within(polygon)
    } else if (geoJSON.type === 'Point') {
      return polygonContainsPoint(comparisonGeoJSON.coordinates, geoJSON.coordinates);

      // linestring/multipoint withing polygon
    } else if (geoJSON.type === 'LineString' || geoJSON.type === 'MultiPoint') {
      if (!geoJSON.coordinates || geoJSON.coordinates.length === 0) {
        return false;
      }

      for (i = 0; i < geoJSON.coordinates.length; i++) {
        if (polygonContainsPoint(comparisonGeoJSON.coordinates, geoJSON.coordinates[i]) === false) {
          return false;
        }
      }

      return true;

      // multilinestring.within(polygon)
    } else if (geoJSON.type === 'MultiLineString') {
      for (i = 0; i < geoJSON.coordinates.length; i++) {
        const ls = {
          type: 'LineString',
          coordinates: geoJSON.coordinates[i]
        };
        if (within(ls, comparisonGeoJSON) === false) {
          contains++;
          return false;
        }
      }

      return true;

      // multipolygon.within(polygon)
    } else if (geoJSON.type === 'MultiPolygon') {
      for (i = 0; i < geoJSON.coordinates.length; i++) {
        const p1 = { type: 'Polygon', coordinates: geoJSON.coordinates[i] };

        if (within(p1, comparisonGeoJSON) === false) {
          return false;
        }
      }

      return true;
    }
  }

  if (comparisonGeoJSON.type === 'MultiPolygon') {
    // point.within(multipolygon)
    if (geoJSON.type === 'Point') {
      if (comparisonGeoJSON.coordinates.length) {
        for (i = 0; i < comparisonGeoJSON.coordinates.length; i++) {
          coordinates = comparisonGeoJSON.coordinates[i];
          if (polygonContainsPoint(coordinates, geoJSON.coordinates) && arraysIntersectArrays([geoJSON.coordinates], comparisonGeoJSON.coordinates) === false) {
            return true;
          }
        }
      }

      return false;
      // polygon.within(multipolygon)
    } else if (geoJSON.type === 'Polygon') {
      for (i = 0; i < geoJSON.coordinates.length; i++) {
        if (comparisonGeoJSON.coordinates[i].length === geoJSON.coordinates.length) {
          for (let j = 0; j < geoJSON.coordinates.length; j++) {
            if (coordinatesEqual(geoJSON.coordinates[j], comparisonGeoJSON.coordinates[i][j])) {
              return true;
            }
          }
        }
      }

      if (arraysIntersectArrays(geoJSON.coordinates, comparisonGeoJSON.coordinates) === false) {
        if (comparisonGeoJSON.coordinates.length) {
          for (i = 0; i < comparisonGeoJSON.coordinates.length; i++) {
            coordinates = comparisonGeoJSON.coordinates[i];
            if (polygonContainsPoint(coordinates, geoJSON.coordinates[0][0]) === false) {
              contains = false;
            } else {
              contains = true;
            }
          }

          return contains;
        }
      }

      // linestring.within(multipolygon), multipoint.within(multipolygon)
    } else if (geoJSON.type === 'LineString' || geoJSON.type === 'MultiPoint') {
      for (i = 0; i < comparisonGeoJSON.coordinates.length; i++) {
        const poly = { type: 'Polygon', coordinates: comparisonGeoJSON.coordinates[i] };

        if (within(geoJSON, poly)) {
          return true;
        }

        return false;
      }

      // multilinestring.within(multipolygon)
    } else if (geoJSON.type === 'MultiLineString') {
      for (i = 0; i < geoJSON.coordinates.length; i++) {
        const ls = { type: 'LineString', coordinates: geoJSON.coordinates[i] };

        if (within(ls, comparisonGeoJSON) === false) {
          return false;
        }
      }

      return true;

      // multipolygon.within(multipolygon)
    } else if (geoJSON.type === 'MultiPolygon') {
      for (i = 0; i < comparisonGeoJSON.coordinates.length; i++) {
        const mpoly = { type: 'Polygon', coordinates: comparisonGeoJSON.coordinates[i] };

        if (within(geoJSON, mpoly) === false) {
          return false;
        }
      }

      return true;
    }
  }

  // default to false
  return false;
};
