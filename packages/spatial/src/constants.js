export const EARTH_RADIUS = 6378137;
export const DEGREES_PER_RADIAN = 57.295779513082320;
export const RADIANS_PER_DEGREE = 0.017453292519943;

export const MercatorCRS = {
  type: 'link',
  properties: {
    href: 'http://spatialreference.org/ref/sr-org/6928/ogcwkt/',
    type: 'ogcwkt'
  }
};

export const GeographicCRS = {
  type: 'link',
  properties: {
    href: 'http://spatialreference.org/ref/epsg/4326/ogcwkt/',
    type: 'ogcwkt'
  }
};
