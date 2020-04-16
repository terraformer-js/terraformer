# @terraformer

[![npm][npm-image]][npm-url]
[![travis][travis-image]][travis-url]
[![standard][standard-image]][standard-url]

[npm-image]: https://img.shields.io/npm/v/@terraformer/arcgis.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/@terraformer/arcgis
[travis-image]: https://img.shields.io/travis/terraformer-js/terraformer/master.svg?style=flat-square
[travis-url]: https://travis-ci.org/terraformer-js/terraformer
[standard-image]: https://img.shields.io/badge/code%20style-semistandard-brightgreen.svg?style=flat-square
[standard-url]: http://npm.im/semistandard

> A geographic toolkit for dealing with geometry, geography, formats, and building geodatabases.

See the [@terraformer](https://terraformer-js.github.io/terraformer/module-@terraformer_spatial.html) website for more information.

## Packages

* **[`@terraformer/spatial`](./packages/spatial/)** - Spatial predicates for [GeoJSON](https://tools.ietf.org/html/rfc7946).
* **[`@terraformer/arcgis`](./packages/arcgis/)**  -  Convert ArcGIS JSON geometries to GeoJSON geometries and vice versa.
* **[`@terraformer/wkt`](./packages/wkt/)** - Convert WKT geometries to GeoJSON geometries and vice versa.

## Contributing

```shell
npm install
npm run bootstrap
npm test
```


## Modules

<dl>
<dt><a href="#module_@terraformer/arcgis">@terraformer/arcgis</a></dt>
<dd></dd>
<dt><a href="#module_@terraformer/spatial">@terraformer/spatial</a></dt>
<dd></dd>
<dt><a href="#module_@terraformer/wkt">@terraformer/wkt</a></dt>
<dd></dd>
</dl>

<a name="module_@terraformer/arcgis"></a>

## @terraformer/arcgis

* [@terraformer/arcgis](#module_@terraformer/arcgis)
    * [.arcgisToGeoJSON(JSON, [idAttribute])](#module_@terraformer/arcgis.arcgisToGeoJSON) ⇒ <code>object</code>
    * [.geojsonToArcGIS(GeoJSON, [idAttribute])](#module_@terraformer/arcgis.geojsonToArcGIS) ⇒ <code>object</code>

<a name="module_@terraformer/arcgis.arcgisToGeoJSON"></a>

### @terraformer/arcgis.arcgisToGeoJSON(JSON, [idAttribute]) ⇒ <code>object</code>
Converts [ArcGIS JSON](https://developers.arcgis.com/documentation/core-concepts/features-and-geometries/) into GeoJSON.

**Kind**: static method of [<code>@terraformer/arcgis</code>](#module_@terraformer/arcgis)
**Returns**: <code>object</code> - GeoJSON.
```js
import { arcgisToGeoJSON } from "@terraformer/arcgis"

arcgisToGeoJSON({
  "x":-122.6764,
  "y":45.5165,
  "spatialReference": {
    "wkid": 4326
  }
});

>> { "type": "Point", "coordinates": [ -122.6764, 45.5165 ] }
```

| Param | Type | Description |
| --- | --- | --- |
| JSON | <code>object</code> | The input ArcGIS geometry, feature or feature collection. |
| [idAttribute] | <code>string</code> | When converting an ArcGIS Feature its attributes will contain the ID of the feature. If something other than OBJECTID or FID stores the ID, you should pass through the fieldname explicitly. |

<a name="module_@terraformer/arcgis.geojsonToArcGIS"></a>

### @terraformer/arcgis.geojsonToArcGIS(GeoJSON, [idAttribute]) ⇒ <code>object</code>
Converts [GeoJSON](https://tools.ietf.org/html/rfc7946) into ArcGIS JSON.

**Kind**: static method of [<code>@terraformer/arcgis</code>](#module_@terraformer/arcgis)
**Returns**: <code>object</code> - ArcGIS JSON.
```js
import { geojsonToArcGIS } from "@terraformer/arcgis"

geojsonToArcGIS({
  "type": "Point",
  "coordinates": [45.5165, -122.6764]
})

>> { "x":-122.6764, "y":45.5165, "spatialReference": { "wkid": 4326 } }
```

| Param | Type | Description |
| --- | --- | --- |
| GeoJSON | <code>object</code> | The input [GeoJSON](https://tools.ietf.org/html/rfc7946) Geometry, Feature, GeometryCollection or ReatureCollection. |
| [idAttribute] | <code>string</code> | When converting GeoJSON features, the id will be set as the OBJECTID unless another fieldname is supplied. |

<a name="module_@terraformer/spatial"></a>

## @terraformer/spatial

* [@terraformer/spatial](#module_@terraformer/spatial)
    * [.calculateBounds(GeoJSON)](#module_@terraformer/spatial.calculateBounds) ⇒ <code>Array.&lt;Number&gt;</code>
    * [.calculateEnvelope(GeoJSON)](#module_@terraformer/spatial.calculateEnvelope) ⇒ <code>Object</code>
    * [.positionToGeographic(CoordinatePair)](#module_@terraformer/spatial.positionToGeographic) ⇒ <code>Array.&lt;Number, Number&gt;</code>
    * [.toMercator(GeoJSON)](#module_@terraformer/spatial.toMercator) ⇒ <code>object</code>
    * [.toGeographic(GeoJSON)](#module_@terraformer/spatial.toGeographic) ⇒ <code>object</code>
    * [.convexHull(GeoJSON)](#module_@terraformer/spatial.convexHull) ⇒ <code>Array.&lt;Coordinates&gt;</code>
    * [.polygonContainsPoint(GeoJSON, GeoJSON)](#module_@terraformer/spatial.polygonContainsPoint) ⇒ <code>Boolean</code>
    * [.within(GeoJSON, GeoJSON)](#module_@terraformer/spatial.within) ⇒ <code>Boolean</code>
    * [.contains(GeoJSON, GeoJSON)](#module_@terraformer/spatial.contains) ⇒ <code>Boolean</code>
    * [.intersects(GeoJSON, GeoJSON)](#module_@terraformer/spatial.intersects) ⇒ <code>Boolean</code>
    * [.toCircle(CoordinatePair, [Radius], [Steps])](#module_@terraformer/spatial.toCircle) ⇒ <code>GeoJSON</code>

<a name="module_@terraformer/spatial.calculateBounds"></a>

### @terraformer/spatial.calculateBounds(GeoJSON) ⇒ <code>Array.&lt;Number&gt;</code>
Calculate the bounding box of the input.

**Kind**: static method of [<code>@terraformer/spatial</code>](#module_@terraformer/spatial)
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
| GeoJSON | <code>object</code> | The input [GeoJSON](https://tools.ietf.org/html/rfc7946) Geometry, Feature, GeometryCollection or ReatureCollection. |

<a name="module_@terraformer/spatial.calculateEnvelope"></a>

### @terraformer/spatial.calculateEnvelope(GeoJSON) ⇒ <code>Object</code>
Calculate the envelope surrounding the input.

**Kind**: static method of [<code>@terraformer/spatial</code>](#module_@terraformer/spatial)
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
| GeoJSON | <code>object</code> | The input [GeoJSON](https://tools.ietf.org/html/rfc7946) Geometry, Feature, GeometryCollection or ReatureCollection. |

<a name="module_@terraformer/spatial.positionToGeographic"></a>

### @terraformer/spatial.positionToGeographic(CoordinatePair) ⇒ <code>Array.&lt;Number, Number&gt;</code>
Reprojects the passed Coordinate pair to WGS84 (4326) spatial reference.

**Kind**: static method of [<code>@terraformer/spatial</code>](#module_@terraformer/spatial)
**Returns**: <code>Array.&lt;Number, Number&gt;</code> - CoordinatePair.
```js
import { positionToGeographic } from "@terraformer/spatial"

positionToGeographic([ -13580978, 5621521 ]) // [ 45, 60  ]
```

| Param | Type | Description |
| --- | --- | --- |
| CoordinatePair | <code>Array.&lt;Number, Number&gt;</code> | An X,Y position. |

<a name="module_@terraformer/spatial.toMercator"></a>

### @terraformer/spatial.toMercator(GeoJSON) ⇒ <code>object</code>
Reproject WGS84 (Lat/Lng) GeoJSON to Web Mercator.

**Kind**: static method of [<code>@terraformer/spatial</code>](#module_@terraformer/spatial)
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
| GeoJSON | <code>object</code> | The input [GeoJSON](https://tools.ietf.org/html/rfc7946) Geometry, Feature, GeometryCollection or ReatureCollection. |

<a name="module_@terraformer/spatial.toGeographic"></a>

### @terraformer/spatial.toGeographic(GeoJSON) ⇒ <code>object</code>
Reproject Web Mercator GeoJSON to WGS84 (Lat/Long).

**Kind**: static method of [<code>@terraformer/spatial</code>](#module_@terraformer/spatial)
**Returns**: <code>object</code> - GeoJSON
```js
import { toGeographic } from "@terraformer/spatial"

toGeographic({
  type: "Point",
  coordinates: [ -13580978, 5621521 ]
})

>> { type: "Point", coordinates: [ 45, 60 ] }
```

| Param | Type | Description |
| --- | --- | --- |
| GeoJSON | <code>object</code> | The input [GeoJSON](https://tools.ietf.org/html/rfc7946) Geometry, Feature, GeometryCollection or ReatureCollection. |

<a name="module_@terraformer/spatial.convexHull"></a>

### @terraformer/spatial.convexHull(GeoJSON) ⇒ <code>Array.&lt;Coordinates&gt;</code>
Calculate the [convex hull](https://en.wikipedia.org/wiki/Convex_hull) of GeoJSON input.

**Kind**: static method of [<code>@terraformer/spatial</code>](#module_@terraformer/spatial)
**Returns**: <code>Array.&lt;Coordinates&gt;</code> - An array of GeoJSON coordinates representing the convex hull of the input GeoJSON.
```js
import { convexHull } from "@terraformer/spatial"

convexHull({
  'type': 'LineString',
  'coordinates': [
    [100, 0], [-45, 122], [80, -60]
  ]
})

>>
{
  type: "Polygon",
  coordinates: [
    [ 100, 0 ], [ -45, 122 ], [ 80, -60 ], [ 100, 0 ]
  ]
}
```

| Param | Type | Description |
| --- | --- | --- |
| GeoJSON | <code>object</code> | The input [GeoJSON](https://tools.ietf.org/html/rfc7946) Geometry, Feature, GeometryCollection or ReatureCollection. |

<a name="module_@terraformer/spatial.polygonContainsPoint"></a>

### @terraformer/spatial.polygonContainsPoint(GeoJSON, GeoJSON) ⇒ <code>Boolean</code>
Accepts the geometry of a polygon and point and returns `true` if the point falls within the polygon.

**Kind**: static method of [<code>@terraformer/spatial</code>](#module_@terraformer/spatial)
**Returns**: <code>Boolean</code> - ```js
import { polygonContainsPoint } from "@terraformer/spatial"

polygonContainsPoint(
  [
    [1, 2], [2, 2], [2, 1], [1, 1], [1, 2]
  ],
  [10, 10]
)

>> false
```

| Param | Type | Description |
| --- | --- | --- |
| GeoJSON | <code>Object</code> | [GeoJSON Polygon](https://tools.ietf.org/html/rfc7946#section-3.1.6) coordinates. |
| GeoJSON | <code>Object</code> | [GeoJSON Point](https://tools.ietf.org/html/rfc7946#section-3.1.2) coordinates. |

<a name="module_@terraformer/spatial.within"></a>

### @terraformer/spatial.within(GeoJSON, GeoJSON) ⇒ <code>Boolean</code>
Returns `true` if the GeoJSON passed as the first argument is completely inside the GeoJSON object passed in the second position.

**Kind**: static method of [<code>@terraformer/spatial</code>](#module_@terraformer/spatial)
**Returns**: <code>Boolean</code> - ```js
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

<a name="module_@terraformer/spatial.contains"></a>

### @terraformer/spatial.contains(GeoJSON, GeoJSON) ⇒ <code>Boolean</code>
Returns `true` if the GeoJSON passed as the second argument is completely inside the GeoJSON object passed in the first position.

**Kind**: static method of [<code>@terraformer/spatial</code>](#module_@terraformer/spatial)
**Returns**: <code>Boolean</code> - ```js
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

<a name="module_@terraformer/spatial.intersects"></a>

### @terraformer/spatial.intersects(GeoJSON, GeoJSON) ⇒ <code>Boolean</code>
Returns `true` if the two input GeoJSON objects intersect one another.

**Kind**: static method of [<code>@terraformer/spatial</code>](#module_@terraformer/spatial)
**Returns**: <code>Boolean</code> - ```js
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
| GeoJSON | <code>Object</code> | The input [GeoJSON](https://tools.ietf.org/html/rfc7946) Geometry, Feature, GeometryCollection or ReatureCollection. |
| GeoJSON | <code>Object</code> | The input [GeoJSON](https://tools.ietf.org/html/rfc7946) Geometry, Feature, GeometryCollection or ReatureCollection. |

<a name="module_@terraformer/spatial.toCircle"></a>

### @terraformer/spatial.toCircle(CoordinatePair, [Radius], [Steps]) ⇒ <code>GeoJSON</code>
Uses an input Coordinate pair to create a GeoJSON Feature containing a Polygon representing a circle with a discrete number of sides.

**Kind**: static method of [<code>@terraformer/spatial</code>](#module_@terraformer/spatial)
**Returns**: <code>GeoJSON</code> - ```js
import { toCircle } from "@terraformer/spatial"

toCircle([ -118, 34 ], 500)

>> { type: "Feature", geometry: { type: "Polygon"}, coordinates: [...] }
```

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| CoordinatePair | <code>Array.&lt;Number, Number&gt;</code> |  | A GeoJSON Coordinate in `[x,y]` format. |
| [Radius] | <code>Number</code> | <code>250</code> | The radius of the circle (in meters). |
| [Steps] | <code>Number</code> | <code>64</code> | The number of sides the output polygon will contain. |

<a name="module_@terraformer/wkt"></a>

## @terraformer/wkt

* [@terraformer/wkt](#module_@terraformer/wkt)
    * [.wktToGeoJSON(WKT)](#module_@terraformer/wkt.wktToGeoJSON) ⇒ <code>object</code>
    * [.geojsonToWKT(GeoJSON)](#module_@terraformer/wkt.geojsonToWKT) ⇒ <code>string</code>

<a name="module_@terraformer/wkt.wktToGeoJSON"></a>

### @terraformer/wkt.wktToGeoJSON(WKT) ⇒ <code>object</code>
Converts a [WKT](https://en.wikipedia.org/wiki/Well-known_text_representation_of_geometry) geometry into a GeoJSON geometry.

**Kind**: static method of [<code>@terraformer/wkt</code>](#module_@terraformer/wkt)
**Returns**: <code>object</code> - GeoJSON.

```js
import { wktToGeoJSON } from "@terraformer/wkt"

wktToGeoJSON("POINT (-122.6764 45.5165)");

>> { "type": "Point", "coordinates": [ -122.6764, 45.5165 ] }
```

| Param | Type | Description |
| --- | --- | --- |
| WKT | <code>string</code> | The input WKT geometry. |

<a name="module_@terraformer/wkt.geojsonToWKT"></a>

### @terraformer/wkt.geojsonToWKT(GeoJSON) ⇒ <code>string</code>
Converts a GeoJSON geometry or GeometryCollection into a [WKT](https://en.wikipedia.org/wiki/Well-known_text_representation_of_geometry) string.

**Kind**: static method of [<code>@terraformer/wkt</code>](#module_@terraformer/wkt)
**Returns**: <code>string</code> - WKT.
```js
import { geojsonToWKT } from "@terraformer/wkt"

const geojsonPoint = {
  "type": "Point",
  "coordinates": [-122.6764, 45.5165]
}

geojsonToWKT(geojsonPoint)

>> "POINT (-122.6764 45.5165)"
```

| Param | Type | Description |
| --- | --- | --- |
| GeoJSON | <code>object</code> | The input GeoJSON geometry or GeometryCollection. |
