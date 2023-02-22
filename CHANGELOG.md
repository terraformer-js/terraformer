# Change log

All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/).

## [Unreleased]

## [2.2.0]
### Added
* `@terraformer/wkt`
  * Parse WKT Geometry Collection to GeoJSON Geomtery Collection.

## [2.1.2]
### Fixed

* `@terraformer/spatial`
  * fix `intersects` for multipolygons
  * start exporting `applyConverter`
## [2.1.1] - 2022-05-31

### Fixed

* ensure Z values of 0 are carried through when converting GeoJSON to ArcGIS Geometries.

## [2.1.0] - 2021-07-22

### Added

* added support for Z values when converting GeoJSON to ArcGIS Geometries.

## [2.0.7] - 2020-05-18

### Fixed

* all UMD and ESM files are now transpiled to make them safe to use in older browsers.

## [2.0.5] - 2020-05-17

### Fixed

* `@terraformer/spatial`
  * `toCircle()` now returns polygons of equal area, regardless of their latitude

## 2.0.0 - 2020-04-15

### Changed

* New Package names:
  * `terraformer` > `@terraformer/spatial`.
  * `terraformer-arcgis-parser` > `@terraformer/arcgis`.
  * `terraformer-wkt-parser` > `@terraformer/wkt`.

* All packages are now standalone.

[2.1.2]: https://github.com/terraformer-js/terraformer/compare/v2.1.1...v2.1.2
[2.1.1]: https://github.com/terraformer-js/terraformer/compare/v2.1.0...v2.1.1
[2.1.0]: https://github.com/terraformer-js/terraformer/compare/v2.0.7...v2.1.0
[2.0.7]: https://github.com/terraformer-js/terraformer/compare/v2.0.5...v2.0.7
[2.0.5]: https://github.com/terraformer-js/terraformer/compare/v2.0.0...v2.0.5
[Unreleased]: https://github.com/terraformer-js/terraformer/compare/v2.1.0...HEAD
