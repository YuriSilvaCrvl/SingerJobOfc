module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      ['module-resolver', {
        alias: {
          '@babel/runtime': '@babel/runtime',
        },
      }],
      'react-native-reanimated/plugin',
    ],
  };
};