# var-library-alias-webpack-plugin

Webpack plugin to create an alias for var library builds. Works both with webpack 5 and webpack 4.

## Install

`npm install --saved-dev var-library-alias-webpack-plugin`
or
`yarn add --dev var-library-alias-webpack-plugin`

## Usage

1. Require plugin at the top of your webpack.config.js

```const VarLibraryAliasWebpackPlugin = require('var-library-alias-webpack-plugin');```

2. Add a plugin to plugins array

```
module.exports = {
  output: {
    ...
    libraryTarget: 'var',
    library: 'MyLib',
  },
  ...
  plugins: [
    new VarLibraryAliasWebpackPlugin({
      alias: 'MyLibAlias',
    }),
  ...
}
```

Following config will result in this code

```var MyLib=function(e){ ...WEBPACK GENERATED CODE... }();var MyLibAlias=MyLib;```

## Options

`alias` - name of the library alias
