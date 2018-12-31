# Change log

All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/).

## [Unreleased]

## [2.0.0] - 2019-??-??

### Changed

* New Package names:
  * `terraformer` > `@terraformer/spatial`.
  * `terraformer-arcgis-parser` > `@terraformer/arcgis`.
  * `terraformer-wkt-parser` > `@terraformer/wkt`.

* All packages are now standalone.

## [1.3.0] - 2018-07-06

### Added

* capability to convert ArcGIS Extent/Envelopes to GeoJSON [Polygon](https://tools.ietf.org/html/rfc7946#section-3.1.6). (🙏CorinChappy🙏 [#34](https://github.com/Esri/arcgis-to-geojson-utils/pull/34))

## [1.2.0] - 2018-03-29

### Added

* its now possible to convert an array of ArcGIS JSON features to a GeoJSON [FeatureCollection](https://tools.ietf.org/html/rfc7946#section-3.3). (🙏chris48s🙏 [#28](https://github.com/Esri/arcgis-to-geojson-utils/pull/28))

## [1.1.1] - 2018-03-08

### Fixed

* ensure ES6 module is publicized in package.json as the `module` for Rollup and other modern bundlers.

## [1.1.0]

### Changed

* Ring-winding order for GeoJSON Polygons prescribed by [RFC 7946](https://tools.ietf.org/html/rfc7946#section-3.1.6) is now enforced. (🙏chris48s🙏 [#22](https://github.com/Esri/arcgis-to-geojson-utils/pull/22))

## [1.0.5]

### Changed

* Maintain z value when translating from ArcGIS to GeoJSON

## [1.0.4]

### Changed

* published package in [`@esri`](https://www.npmjs.com/org/esri) namespace on npm.

### Fixed

* ensure built version of lib can be minified using `uglify-js`. #17 thanks @chidg!

## [1.0.3]

### Fixed

* ensured `/test`, the bundled `.zip` and other unnecessary files are omitted from npm release

## [1.0.2]

### Added

* `default` export

### Fixed

* pass through a `null` geometry when invalid input is encountered

## [1.0.1]

### Fixed

* first npm release

## 1.0.0
* First Release

[Unreleased]: https://github.com/Esri/arcgis-to-geojson-utils/compare/v2.0.0...HEAD
[1.3.0]: https://github.com/Esri/arcgis-to-geojson-utils/compare/v1.3.0...v2.0.0
[1.3.0]: https://github.com/Esri/arcgis-to-geojson-utils/compare/v1.2.0...v1.3.0
[1.2.0]: https://github.com/Esri/arcgis-to-geojson-utils/compare/v1.1.1...v1.2.0
[1.1.1]: https://github.com/Esri/arcgis-to-geojson-utils/compare/v1.1.0...v1.1.1
[1.1.0]: https://github.com/Esri/arcgis-to-geojson-utils/compare/v1.0.5...v1.1.0
[1.0.5]: https://github.com/Esri/arcgis-to-geojson-utils/compare/v1.0.4...v1.0.5
[1.0.4]: https://github.com/Esri/arcgis-to-geojson-utils/compare/v1.0.3...v1.0.4
[1.0.3]: https://github.com/Esri/arcgis-to-geojson-utils/compare/v1.0.2...v1.0.3
[1.0.2]: https://github.com/Esri/arcgis-to-geojson-utils/compare/v1.0.1...v1.0.2
[1.0.1]: https://github.com/Esri/arcgis-to-geojson-utils/compare/v1.0.0...v1.0.1
