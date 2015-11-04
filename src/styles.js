'use strict';

var React = require('react-native');
var Dimensions = require('Dimensions');

var {StyleSheet} = React;

var window = Dimensions.get('window');
var navBarHeight = 44;
var bodyHeight = window.height - navBarHeight;
var white = '#ffffff';
var light = '#f4f4f4';
var dark = '#2e2e2e';
var medium = '#b4b4b4';

module.exports = {
  window: window,
  navBarHeight: navBarHeight,
  bodyHeight: bodyHeight,
  white: white,
  light: light,
  dark: dark,
  medium: medium,
};