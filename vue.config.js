process.env.VUE_APP_VERSION = process.env.npm_package_version;

module.exports = {
  pages: {
    index: {
      entry: "src/main.js",
      title: "OWL FREELANCE " + process.env.VUE_APP_VERSION
    }
  },
  pluginOptions: {
    electronBuilder: {
      preload: "src/preload.js"
    }
  }
};
