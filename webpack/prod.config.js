/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-unused-vars */
const baseConfig = require('./base.config.js');
const merge = require('webpack-merge');

const config = merge(baseConfig, {
  mode: 'production',
});

module.exports = config;
