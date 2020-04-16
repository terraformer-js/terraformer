import {
  coordinatesContainPoint
} from '@terraformer/common';

export const polygonContainsPoint = (polygon, point) => {
  if (polygon && polygon.length) {
    if (polygon.length === 1) { // polygon with no holes
      return coordinatesContainPoint(polygon[0], point);
    } else { // polygon with holes
      if (coordinatesContainPoint(polygon[0], point)) {
        for (let i = 1; i < polygon.length; i++) {
          if (coordinatesContainPoint(polygon[i], point)) {
            return false; // found in hole
          }
        }
        return true;
      } else {
        return false;
      }
    }
  } else {
    return false;
  }
};
