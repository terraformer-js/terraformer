Esri welcomes contributions from anyone and everyone. Please see our [guidelines for contributing](https://github.com/esri/contributing).

## Publishing a release

1. Update CHANGELOG.md manually
1. `npm test` to ensure all is well
1. `npm run doc` shouldn't result in any changed files
1. `npm run release`

under the hood, this will call `lerna publish`. you'll get a chance to specify `patch | minor | major` and only the packages that have changed since last time will be published.

