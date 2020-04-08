import { within } from './within';

export const contains = (geoJSON, comparisonGeoJSON) => within(comparisonGeoJSON, geoJSON);
