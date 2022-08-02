# @terraformer/spatial

[![npm][npm-image]][npm-url]
[![travis][travis-image]][travis-url]
[![standard][standard-image]][standard-url]

[npm-image]: https://img.shields.io/npm/v/@terraformer/spatial.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/@terraformer/spatial
[travis-image]: https://app.travis-ci.com/terraformer-js/terraformer.svg?branch=main
[travis-url]: https://app.travis-ci.com/terraformer-js/terraformer
[standard-image]: https://img.shields.io/badge/code%20style-semistandard-brightgreen.svg?style=flat-square
[standard-url]: http://npm.im/semistandard

> Spatial predicates for GeoJSON.

## Install

```
npm install @terraformer/spatial
```

## API Reference

<a name="module_Terraformer"></a>

## Terraformer

* [Terraformer](#module_Terraformer)
    * [.MercatorCRS](#module_Terraformer.MercatorCRS)
    * [.GeographicCRS](#module_Terraformer.GeographicCRS)
    * [.applyConverter(GeoJSON, function)](#module_Terraformer.applyConverter) ⇒ <code>object</code>
    * [.calculateBounds(GeoJSON)](#module_Terraformer.calculateBounds) ⇒ <code>Array.&lt;Number&gt;</code>
    * [.calculateEnvelope(GeoJSON)](#module_Terraformer.calculateEnvelope) ⇒ <code>Object</code>
    * [.positionToGeographic(CoordinatePair)](#module_Terraformer.positionToGeographic) ⇒ <code>Array.&lt;Number, Number&gt;</code>
    * [.positionToMercator(CoordinatePair)](#module_Terraformer.positionToMercator) ⇒ <code>Array.&lt;Number, Number&gt;</code>
    * [.toMercator(GeoJSON)](#module_Terraformer.toMercator) ⇒ <code>object</code>
    * [.convexHull(GeoJSON)](#module_Terraformer.convexHull) ⇒ <code>Array.&lt;Coordinates&gt;</code>
    * [.isConvex(GeoJSON)](#module_Terraformer.isConvex) ⇒ <code>Boolean</code>
    * [.polygonContainsPoint(GeoJSON, GeoJSON)](#module_Terraformer.polygonContainsPoint) ⇒ <code>Boolean</code>
    * [.within(GeoJSON, GeoJSON)](#module_Terraformer.within) ⇒ <code>Boolean</code>
    * [.contains(GeoJSON, GeoJSON)](#module_Terraformer.contains) ⇒ <code>Boolean</code>
    * [.intersects(GeoJSON, GeoJSON)](#module_Terraformer.intersects) ⇒ <code>Boolean</code>
    * [.toCircle(CoordinatePair, [Radius], [Steps])](#module_Terraformer.toCircle) ⇒ <code>object</code>

<a name="module_Terraformer.MercatorCRS"></a>

### Terraformer.MercatorCRS
WKID [3857](https://epsg.io/3857)

**Kind**: static constant of [<code>Terraformer</code>](#module_Terraformer)  
<a name="module_Terraformer.GeographicCRS"></a>

### Terraformer.GeographicCRS
WKID [4326](https://epsg.io/4326)

**Kind**: static constant of [<code>Terraformer</code>](#module_Terraformer)  
<a name="module_Terraformer.applyConverter"></a>

### Terraformer.applyConverter(GeoJSON, function) ⇒ <code>object</code>
Runs the passed function against every Coordinate in the geojson object.

**Kind**: static method of [<code>Terraformer</code>](#module_Terraformer)  
**Returns**: <code>object</code> - GeoJSON - [GeoJSON](https://tools.ietf.org/html/rfc7946) with altered coordinates.
```js
import { applyConverter } from "@terraformer/spatial"

applyConverter({
  type: "Point",
  coordinates: [ 45, 60 ]
}, (coord) => [coord[0] + 1, coord[1] - 1])

>> { type: "Point", coordinates: [ 46, 59 ] }
```  

| Param | Type | Description |
| --- | --- | --- |
| GeoJSON | <code>object</code> | The input [GeoJSON](https://tools.ietf.org/html/rfc7946) Geometry, Feature, GeometryCollection or FeatureCollection. |
| function | <code>function</code> | Your function will be passed a Coordinate and will be expected to return a Coordinate. |

<a name="module_Terraformer.calculateBounds"></a>

### Terraformer.calculateBounds(GeoJSON) ⇒ <code>Array.&lt;Number&gt;</code>
Calculate the bounding box of the input.

**Kind**: static method of [<code>Terraformer</code>](#module_Terraformer)  
**Returns**: <code>Array.&lt;Number&gt;</code> - [ xmin, ymin, xmax, ymax ].
```js
import { calculateBounds } from "@terraformer/spatial"

calculateBounds({
  type: "Point",
  coordinates: [ 45, 60 ]
})

>> [45, 60, 45, 60]
```  

| Param | Type | Description |
| --- | --- | --- |
| GeoJSON | <code>object</code> | The input [GeoJSON](https://tools.ietf.org/html/rfc7946) Geometry, Feature, GeometryCollection or FeatureCollection. |

<a name="module_Terraformer.calculateEnvelope"></a>

### Terraformer.calculateEnvelope(GeoJSON) ⇒ <code>Object</code>
Calculate the envelope surrounding the input.

**Kind**: static method of [<code>Terraformer</code>](#module_Terraformer)  
**Returns**: <code>Object</code> - Object in the form { x, y, w, h }.
```js
import { calculateEnvelope } from "@terraformer/spatial"

calculateEnvelope({
  type: "Point",
  coordinates: [ 100, 100 ]
})

>> { x: 100, y: 100, w: 0, h: 0, }
```  

| Param | Type | Description |
| --- | --- | --- |
| GeoJSON | <code>object</code> | The input [GeoJSON](https://tools.ietf.org/html/rfc7946) Geometry, Feature, GeometryCollection or FeatureCollection. |

<a name="module_Terraformer.positionToGeographic"></a>

### Terraformer.positionToGeographic(CoordinatePair) ⇒ <code>Array.&lt;Number, Number&gt;</code>
Reprojects the passed Coordinate pair to WGS84 (4326) spatial reference.

**Kind**: static method of [<code>Terraformer</code>](#module_Terraformer)  
**Returns**: <code>Array.&lt;Number, Number&gt;</code> - CoordinatePair.
```js
import { positionToGeographic } from "@terraformer/spatial"

positionToGeographic([ -13580978, 5621521 ]) // [ 45, 60  ]
```  

| Param | Type | Description |
| --- | --- | --- |
| CoordinatePair | <code>Array.&lt;Number, Number&gt;</code> | An X,Y position. |

<a name="module_Terraformer.positionToMercator"></a>

### Terraformer.positionToMercator(CoordinatePair) ⇒ <code>Array.&lt;Number, Number&gt;</code>
Reprojects the passed Coordinate pair to web mercator (3857) spatial reference.

**Kind**: static method of [<code>Terraformer</code>](#module_Terraformer)  
**Returns**: <code>Array.&lt;Number, Number&gt;</code> - CoordinatePair.
```js
import { positionToGeographic } from "@terraformer/spatial"

positionToMercator([ 45, 60 ]) // [ -13580978, 5621521  ]
```  

| Param | Type | Description |
| --- | --- | --- |
| CoordinatePair | <code>Array.&lt;Number, Number&gt;</code> | An X,Y position. |

<a name="module_Terraformer.toMercator"></a>

### Terraformer.toMercator(GeoJSON) ⇒ <code>object</code>
Reproject WGS84 (Lat/Lng) GeoJSON to Web Mercator.

**Kind**: static method of [<code>Terraformer</code>](#module_Terraformer)  
**Returns**: <code>object</code> - GeoJSON
```js
import { toMercator } from "@terraformer/spatial"

toMercator({
  type: "Point",
  coordinates: [ 45, 60 ]
})

>> { type: "Point", coordinates: [ -13580978, 5621521 ], crs }
```  

| Param | Type | Description |
| --- | --- | --- |
| GeoJSON | <code>object</code> | The input [GeoJSON](https://tools.ietf.org/html/rfc7946) Geometry, Feature, GeometryCollection or FeatureCollection. |

<a name="module_Terraformer.convexHull"></a>

### Terraformer.convexHull(GeoJSON) ⇒ <code>Array.&lt;Coordinates&gt;</code>
Calculate the [convex hull](https://en.wikipedia.org/wiki/Convex_hull) of GeoJSON input.

**Kind**: static method of [<code>Terraformer</code>](#module_Terraformer)  
**Returns**: <code>Array.&lt;Coordinates&gt;</code> - An array of GeoJSON coordinates representing the convex hull of the input GeoJSON.
```js
import { convexHull } from "@terraformer/spatial"

convexHull({
  type: "LineString",
  coordinates: [
    [ 100, 0 ], [ -45, 122 ], [ 80, -60 ]
  ]
})

>>
{
  type: "Polygon",
  coordinates: [
    [ [ 100, 0 ], [ -45, 122 ], [ 80, -60 ], [ 100, 0 ] ]
  ]
}
```  

| Param | Type | Description |
| --- | --- | --- |
| GeoJSON | <code>object</code> | The input [GeoJSON](https://tools.ietf.org/html/rfc7946) Geometry, Feature, GeometryCollection or FeatureCollection. |

<a name="module_Terraformer.isConvex"></a>

### Terraformer.isConvex(GeoJSON) ⇒ <code>Boolean</code>
Determine whether input GeoJSON has a [convex](https://en.wikipedia.org/wiki/Convex_set) shape.

**Kind**: static method of [<code>Terraformer</code>](#module_Terraformer)  
**Returns**: <code>Boolean</code> - Yes/No
```js
import { isConvex } from "@terraformer/spatial"

isConvex({
  type: "Polygon",
  coordinates: [
    [ [ 100, 0 ], [ -45, 122 ], [ 80, -60 ], [ 100, 0 ] ]
  ]
})

>> true
```  

| Param | Type | Description |
| --- | --- | --- |
| GeoJSON | <code>Object</code> | The input [GeoJSON](https://tools.ietf.org/html/rfc7946) Geometry, Feature, GeometryCollection or FeatureCollection. |

<a name="module_Terraformer.polygonContainsPoint"></a>

### Terraformer.polygonContainsPoint(GeoJSON, GeoJSON) ⇒ <code>Boolean</code>
Accepts the geometry of a polygon and point and returns `true` if the point falls within the polygon.

**Kind**: static method of [<code>Terraformer</code>](#module_Terraformer)  
**Returns**: <code>Boolean</code> - Yes/No
```js
import { polygonContainsPoint } from "@terraformer/spatial"

polygonContainsPoint(
  [
    [ [ 1, 2 ], [ 2, 2 ], [ 2, 1 ], [ 1, 1 ], [ 1, 2 ] ]
  ],
  [ 10, 10 ]
)

>> false
```  

| Param | Type | Description |
| --- | --- | --- |
| GeoJSON | <code>Object</code> | [GeoJSON Polygon](https://tools.ietf.org/html/rfc7946#section-3.1.6) coordinates. |
| GeoJSON | <code>Object</code> | [GeoJSON Point](https://tools.ietf.org/html/rfc7946#section-3.1.2) coordinates. |

<a name="module_Terraformer.within"></a>

### Terraformer.within(GeoJSON, GeoJSON) ⇒ <code>Boolean</code>
Returns `true` if the GeoJSON passed as the first argument is completely inside the GeoJSON object passed in the second position.

**Kind**: static method of [<code>Terraformer</code>](#module_Terraformer)  
**Returns**: <code>Boolean</code> - Yes/No
```js
import { within } from "@terraformer/spatial"

within({
  type: "Point",
  coordinates: [ 10, 10 ]
},
{
  type: "Polygon",
  coordinates: [
    [ [ 5, 5 ], [ 5, 15 ], [ 15, 15 ], [ 15, 5 ], [ 5, 5 ] ]
  ]
})

>> true
```  

| Param | Type | Description |
| --- | --- | --- |
| GeoJSON | <code>Object</code> | [GeoJSON](https://tools.ietf.org/html) that may be within the second input. |
| GeoJSON | <code>Object</code> | [GeoJSON](https://tools.ietf.org/html/rfc7946#section-3.1.2) that may contain the first input. |

<a name="module_Terraformer.contains"></a>

### Terraformer.contains(GeoJSON, GeoJSON) ⇒ <code>Boolean</code>
Returns `true` if the GeoJSON passed as the second argument is completely inside the GeoJSON object passed in the first position.

**Kind**: static method of [<code>Terraformer</code>](#module_Terraformer)  
**Returns**: <code>Boolean</code> - Yes/No
```js
import { contains } from "@terraformer/spatial"

contains({
  type: "Polygon",
  coordinates: [
    [ [ 5, 5 ], [ 5, 15 ], [ 15, 15 ], [ 15, 5 ], [ 5, 5 ] ]
]},
{
  type: "Point",
  coordinates: [ 10, 10 ]
})

>> true
```  

| Param | Type | Description |
| --- | --- | --- |
| GeoJSON | <code>Object</code> | [GeoJSON](https://tools.ietf.org/html) that may contain the second input. |
| GeoJSON | <code>Object</code> | [GeoJSON](https://tools.ietf.org/html/rfc7946#section-3.1.2) that may be contained by the first input. |

<a name="module_Terraformer.intersects"></a>

### Terraformer.intersects(GeoJSON, GeoJSON) ⇒ <code>Boolean</code>
Returns `true` if the two input GeoJSON objects intersect one another.

**Kind**: static method of [<code>Terraformer</code>](#module_Terraformer)  
**Returns**: <code>Boolean</code> - Yes/No
```js
import { intersects } from "@terraformer/spatial"

intersects({
  type: "Point",
  coordinates: [ 10, 10 ]
},
{
  type: "Polygon",
  coordinates: [
    [ [ 5, 5 ], [ 5, 15 ], [ 15, 15 ], [ 15, 5 ], [ 5, 5 ] ]
  ]
})

>> true
```  

| Param | Type | Description |
| --- | --- | --- |
| GeoJSON | <code>Object</code> | The input [GeoJSON](https://tools.ietf.org/html/rfc7946) Geometry, Feature, GeometryCollection or FeatureCollection. |
| GeoJSON | <code>Object</code> | The input [GeoJSON](https://tools.ietf.org/html/rfc7946) Geometry, Feature, GeometryCollection or FeatureCollection. |

<a name="module_Terraformer.toCircle"></a>

### Terraformer.toCircle(CoordinatePair, [Radius], [Steps]) ⇒ <code>object</code>
Uses an input Coordinate pair to create a GeoJSON Feature containing a Polygon representing a circle with a discrete number of sides.

**Kind**: static method of [<code>Terraformer</code>](#module_Terraformer)  
**Returns**: <code>object</code> - GeoJSON
```js
import { toCircle } from "@terraformer/spatial"

toCircle([ -118, 34 ], 500)

>> { type: "Feature", geometry: { type: "Polygon"}, coordinates: [...] }
```  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| CoordinatePair | <code>Array.&lt;Number, Number&gt;</code> |  | A GeoJSON Coordinate in `[x,y]` format. |
| [Radius] | <code>Number</code> | <code>250</code> | The radius of the circle (in meters). |
| [Steps] | <code>Number</code> | <code>64</code> | The number of sides the output polygon will contain. |

* * *

## Usage

### Browser (from CDN)

This package is distributed as a [UMD](https://github.com/umdjs/umd) module and can also be used in AMD based systems or as a global under the `Terraformer` namespace.

```html
<script src="https://unpkg.com/@terraformer/spatial"></script>
```
```js
const input = {
  'type': 'Polygon',
  'coordinates': [
    [ [41.83, 71.01], [56.95, 33.75], [21.79, 36.56], [41.83, 71.01] ]
  ]
};

Terraformer.isConvex(input.coordinates[0]); // true
```

### Node.js

```js
const Terraformer = require('@terraformer/spatial');

Terraformer.isConvex(/* ... */);
```

### ES module in the browser

```html
<script type='module'>
  import { isConvex } from 'https://unpkg.com/@terraformer/spatial?module';

  // look ma, no build step!
  isConvex(/* ... */);
</script>
```

## FAQ

<details>
  <summary>What's the difference between this project and <a href="https://turfjs.org">Turf.js</a>?</summary>

  Both libraries work with GeoJSON and share many similar functions. Turf.js relies on JSTS, and some folks have [found it to be slower](https://github.com/Esri/terraformer/issues/268#issuecomment-196413416). In the past Turf.js did not include predicates like 'within', 'contains' and 'intersects', but that no longer appears to be the case.
</details>

## [Contributing](./CONTRIBUTING.md)

## [LICENSE](https://raw.githubusercontent.com/terraformer-js/terraformer/master/LICENSE)
