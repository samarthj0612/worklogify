const { getDefaultConfig } = require("expo/metro-config");

module.exports = (() => {
  const config = getDefaultConfig(__dirname);
  config.transformer.assetPlugins = ["expo-asset/tools/hashAssetFiles"];
  config.resolver.assetExts = config.resolver.assetExts.filter(ext => ext !== "svg");
  config.resolver.sourceExts.push("svg");
  return config;
})();
