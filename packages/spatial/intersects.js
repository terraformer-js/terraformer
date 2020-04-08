import {
  arraysIntersectArrays
} from '@terraformer/common';

import { warn } from './util';
import { within } from './within';

export const intersects = (geoJSON, comparisonGeoJSON) => {
  // if we are passed a feature, use the polygon inside instead
  if (comparisonGeoJSON.type === 'Feature') {
    comparisonGeoJSON = comparisonGeoJSON.geometry;
  }

  if (within(geoJSON, comparisonGeoJSON) || within(comparisonGeoJSON, geoJSON)) {
    return true;
  }

  if (geoJSON.type !== 'Point' && geoJSON.type !== 'MultiPoint' &&
    comparisonGeoJSON.type !== 'Point' && comparisonGeoJSON.type !== 'MultiPoint') {
    return arraysIntersectArrays(geoJSON.coordinates, comparisonGeoJSON.coordinates);
  } else if (geoJSON.type === 'Feature') {
    // in the case of a Feature, use the internal geometry for intersection
    const inner = geoJSON.geometry;
    return intersects(inner, comparisonGeoJSON);
  }

  warn('Type ' + geoJSON.type + ' to ' + comparisonGeoJSON.type + ' intersection is not supported by intersects');
  return false;
};
