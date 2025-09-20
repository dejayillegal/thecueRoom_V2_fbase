/* eslint-disable @typescript-eslint/no-var-requires */
const { getDefaultConfig } = require('expo/metro-config');
const { resolve } = require('metro-resolver');

const disallowedNodeBuiltins = new Set([
  'fs',
  'path',
  'url',
  'http',
  'https',
  'zlib',
  'stream',
  'crypto',
  'util',
  'net',
  'tls',
  'events'
]);

const config = getDefaultConfig(__dirname);

config.resolver.assetExts = config.resolver.assetExts.filter((ext) => ext !== 'svg');
config.resolver.sourceExts.push('svg');
config.transformer.babelTransformerPath = require.resolve('react-native-svg-transformer');
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (disallowedNodeBuiltins.has(moduleName)) {
    throw new Error(
      `Node builtin "${moduleName}" is not available in React Native. Move the logic to a server workspace.`,
    );
  }

  return resolve(context, moduleName, platform);
};

module.exports = config;
