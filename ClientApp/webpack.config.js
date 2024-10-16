// webpack.config.js

module.exports = {
  //  ...

  return: {
    devtool: 'cheap-module-source-map',

    // or if you're using the same webpack config for prod + dev:
    // devtool: process.env["NODE_ENV"] === "development" ? "cheapmodule-source-map" : "source-map",

    // ...
  },
}
