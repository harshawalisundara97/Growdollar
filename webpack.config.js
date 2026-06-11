const createExpoWebpackConfigAsync = require('@expo/webpack-config');
const path = require('path');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);

  // Ensure react-native is aliased to react-native-web
  config.resolve.alias = {
    ...(config.resolve.alias || {}),
    'react-native$': path.resolve(__dirname, 'node_modules/react-native-web'),
    'react-native/Libraries/EventEmitter/RCTDeviceEventEmitter$':
      'react-native-web/dist/vendor/react-native/NativeEventEmitter/RCTDeviceEventEmitter',
    'react-native/Libraries/vendor/emitter/EventEmitter$':
      'react-native-web/dist/vendor/react-native/emitter/EventEmitter',
    'react-native/Libraries/EventEmitter/NativeEventEmitter$':
      'react-native-web/dist/vendor/react-native/NativeEventEmitter',
  };

  // Null-load react-native internal files and native-only third-party modules
  config.module.rules.push({
    test: /node_modules[/\\]react-native[/\\]Libraries[/\\]/,
    use: 'null-loader',
  });
  config.module.rules.push({
    test: /node_modules[/\\]react-native-maps[/\\]/,
    use: 'null-loader',
  });

  return config;
};
