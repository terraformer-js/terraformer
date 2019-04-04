# @terraformer/arcgis

[![npm][npm-image]][npm-url]
[![travis][travis-image]][travis-url]
[![standard][standard-image]][standard-url]

[npm-image]: https://img.shields.io/npm/v/@terraformer/arcgis.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/@terraformer/arcgis
[travis-image]: https://img.shields.io/travis/terraformer-js/terraformer/master.svg?style=flat-square
[travis-url]: https://travis-ci.org/terraformer-js/terraformer
[standard-image]: https://img.shields.io/badge/code%20style-semistandard-brightgreen.svg?style=flat-square
[standard-url]: http://npm.im/semistandard

> Tools to convert ArcGIS JSON geometries to GeoJSON geometries and vice versa.

## Install

```shell
npm install @terraformer/arcgis
```

## Usage

### ES Module

```js
import { arcgisToGeoJSON, geojsonToArcGIS } from '@terraformer/arcgis';

// parse ArcGIS JSON, convert it to GeoJSON
const geojson = arcgisToGeoJSON({
    "x":-122.6764,
    "y":45.5165,
    "spatialReference": {
      "wkid": 4326
    }
  });

>> { "type": "Point", "coordinates": [ -122.6764, 45.5165 ] }

// parse GeoJSON and convert it to ArcGIS JSON
const arcgis = geojsonToArcGIS({
  "type": "Point",
  "coordinates": [ -122.6764, 45.5165 ]
});

>> { "x":-122.6764, "y":45.5165, "spatialReference": { "wkid": 4326 } }
```

### Browser (from CDN)

This package is distributed as a [UMD](https://github.com/umdjs/umd) module and can also be used in AMD based systems or as a global under the `Terraformer` namespace.

```html
<script src="https://unpkg.com/@terraformer/arcgis"></script>
```
```js
Terraformer.arcgisToGeoJSON({
    "x":-122.6764,
    "y":45.5165,
    "spatialReference": {
      "wkid": 4326
    }
});
```

### Node.js

```js
const Terraformer = require('@terraformer/arcgis');

Terraformer.geojsonToArcGIS(/* ... */);
Terraformer.arcgisToGeoJSON(/* ... */);
```

## [Contributing](./CONTRIBUTING.md)

## Ports

| Project | Language | Status | Maintainer |
| - | - | - | - |
| [`arcgis2geojson`](https://github.com/chris48s/arcgis2geojson/) | Python | Incomplete | [@chris48s](https://github.com/chris48s) |
