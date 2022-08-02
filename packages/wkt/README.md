# @terraformer/wkt

[![npm][npm-image]][npm-url]
[![travis][travis-image]][travis-url]
[![standard][standard-image]][standard-url]

[npm-image]: https://img.shields.io/npm/v/@terraformer/wkt.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/@terraformer/wkt
[travis-image]: https://app.travis-ci.com/terraformer-js/terraformer.svg?branch=main
[travis-url]: https://app.travis-ci.com/terraformer-js/terraformer
[standard-image]: https://img.shields.io/badge/code%20style-semistandard-brightgreen.svg?style=flat-square
[standard-url]: http://npm.im/semistandard

> Tools to convert WKT geometries to GeoJSON geometries and vice versa.

## Install

```shell
npm install @terraformer/wkt
```

## API Reference

<a name="module_Terraformer"></a>

## Terraformer

* [Terraformer](#module_Terraformer)
    * [.wktToGeoJSON(WKT)](#module_Terraformer.wktToGeoJSON) ⇒ <code>object</code>
    * [.geojsonToWKT(GeoJSON)](#module_Terraformer.geojsonToWKT) ⇒ <code>string</code>

<a name="module_Terraformer.wktToGeoJSON"></a>

### Terraformer.wktToGeoJSON(WKT) ⇒ <code>object</code>
Converts a [WKT](https://en.wikipedia.org/wiki/Well-known_text_representation_of_geometry) geometry into a GeoJSON geometry.

**Kind**: static method of [<code>Terraformer</code>](#module_Terraformer)  
**Returns**: <code>object</code> - GeoJSON.

```js
import { wktToGeoJSON } from "@terraformer/wkt"

wktToGeoJSON("POINT (-122.6764 45.5165)");

>> { "type": "Point", "coordinates": [ -122.6764, 45.5165 ] }
```  

| Param | Type | Description |
| --- | --- | --- |
| WKT | <code>string</code> | The input WKT geometry. |

<a name="module_Terraformer.geojsonToWKT"></a>

### Terraformer.geojsonToWKT(GeoJSON) ⇒ <code>string</code>
Converts a GeoJSON geometry or GeometryCollection into a [WKT](https://en.wikipedia.org/wiki/Well-known_text_representation_of_geometry) string.

**Kind**: static method of [<code>Terraformer</code>](#module_Terraformer)  
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

* * *

## Usage

### Browser (from CDN)

This package is distributed as a [UMD](https://github.com/umdjs/umd) module and can also be used in AMD based systems or as a global under the `Terraformer` namespace.

```html
<script src="https://unpkg.com/@terraformer/wkt"></script>
```
```js
Terraformer.wktToGeoJSON("POINT (-122.6764 45.5165)");
```

### Node.js

```js
const Terraformer = require('@terraformer/wkt');

Terraformer.geojsonToWKT(/* ... */);
Terraformer.wktToGeoJSON(/* ... */);
```

### ES module in the browser

```html
<script type='module'>
  import { wktToGeoJSON } from 'https://unpkg.com/@terraformer/wkt?module';

  // look ma, no build step!
  wktToGeoJSON(/* ... */);
</script>
```

## [Contributing](./CONTRIBUTING.md)

## [LICENSE](https://raw.githubusercontent.com/terraformer-js/terraformer/master/LICENSE)
