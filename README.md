# @terraformer

[![npm][npm-image]][npm-url]
[![travis][travis-image]][travis-url]
[![standard][standard-image]][standard-url]

[npm-image]: https://img.shields.io/npm/v/@terraformer/arcgis.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/@terraformer/arcgis
[travis-image]: https://img.shields.io/travis/com/terraformer-js/terraformer/master.svg?style=flat-square
[travis-url]: https://travis-ci.com/terraformer-js/terraformer
[standard-image]: https://img.shields.io/badge/code%20style-semistandard-brightgreen.svg?style=flat-square
[standard-url]: http://npm.im/semistandard

> A geographic toolkit for dealing with geometry, geography, formats, and building geodatabases.

## Packages

* [`@terraformer/spatial`](./packages/spatial/README.md) - Spatial predicates for [GeoJSON](https://tools.ietf.org/html/rfc7946).
* [`@terraformer/arcgis`](./packages/arcgis/README.md)  -  Convert ArcGIS JSON geometries to GeoJSON geometries and vice versa.
* [`@terraformer/wkt`](./packages/wkt/README.md) - Convert WKT geometries to GeoJSON geometries and vice versa.

## FAQ

<details>
  <summary>What's the difference between this and <a href="https://github.com/Esri/Terraformer">Esri/Terraformer</a>?</summary>

  Very little!

  This project is a standalone [ES Module](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules) port of the original Terraformer project _without_ the [Primitives](https://terraformer-js.github.io/core/#terraformerprimitive).

  If you found instantiating Primitives tedious or you'd like to [cut down on your bundle size](https://github.com/zakjan/leaflet-lasso/issues/10) by importing only the code from Terraformer that you're actually using, you should consider upgrading.
</details>

<details>
  <summary>I'm already using <code>terraformer</code>. How do I upgrade?</summary>

  Previously it was necessary to instantiate a Terraformer Primitive in order to execute spatial operations
  ```bash
  npm install terraformer
  ```

  ```js
  const Terraformer = require('terraformer')

  const polygon = new Terraformer.Primitive({
    type: "LineString",
    coordinates: [
      [ 100, 0 ], [ -45, 122 ], [ 80, -60 ]
    ]
  })

  polygon.convexHull()
  ```

  Now you'll work directly with raw [GeoJSON](https://tools.ietf.org/html/rfc7946)
  ```
  npm install @terraformer/spatial
  ```
  ```js
  const Terraformer = require('@terraformer/spatial')

  Terraformer.convexHull({
    type: "LineString",
    coordinates: [
      [ 100, 0 ], [ -45, 122 ], [ 80, -60 ]
    ]
  })
  ```

</details>

<details>
  <summary>I'm already using <code>terraformer-wkt-parser</code>. How do I upgrade?</summary>

  Instead of this:
  ```bash
  npm install terraformer-wkt-parser
  ```

  ```js
  var wkt = require('terraformer-wkt-parser')

  // parse a WKT file and turn it into GeoJSON
  wkt.parse('LINESTRING (30 10, 10 30, 40 40)')
  wkt.convert(/* ... */)
  ```

  You'll do this:
  ```
  npm install @terraformer/wkt
  ```
  ```js
  const Terraformer = require('@terraformer/wkt')

  Terraformer.wktToGeoJSON(/* ... */)
  Terraformer.geojsonToWKT(/* ... */)
  ```
</details>

<details>
  <summary>I'm already using <code>terraformer-arcgis-parser</code>. How do I upgrade?</summary>

  Instead of this:
  ```bash
  npm install terraformer-arcgis-parser
  ```

  ```js
  var ArcGIS = require('terraformer-arcgis-parser')

  // parse ArcGIS JSON and turn it into GeoJSON
  ArcGIS.parse()
  ArcGIS.convert()
  ```

  You'll do this:
  ```
  npm install @terraformer/wkt
  ```
  ```js
  const Terraformer = require('@terraformer/arcgis')

  Terraformer.arcgisToGeoJSON(/* ... */)
  Terraformer.geojsonToArcGIS(/* ... */)
  ```
</details>

<details>
  <summary>What about <code>terraformer-geostore</code>?</summary>

  This repo does **not** include a port of https://github.com/Esri/terraformer-geostore and there is no plan to tackle it in the future.
  
  Since <code>terraformer-geostore</code> ingests plain ol' [GeoJSON}(https://tools.ietf.org/html/rfc7946), you're welcome to keep on using the original code.
</details>

## Contributing

```shell
npm install && npm test
```
