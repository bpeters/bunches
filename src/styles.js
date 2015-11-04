'use strict';

var React = require('react-native');
var Dimensions = require('Dimensions');

var {StyleSheet} = React;

var window = Dimensions.get('window');
var navBarHeight = 56;
var bodyHeight = window.height - navBarHeight;
var bodyWidth= window.width;

module.exports = {
  window: window,
  navBarHeight: navBarHeight,
  bodyHeight: bodyHeight,
  bodyWidth: bodyWidth,
  blue: '#31C3D9',
  red: '#B96B6B',
  yellow: '#F9CA6B',
  background: '#F1F5F7',
  white: '#ffffff',
  light: '#f4f4f4',
  dark: '#2e2e2e',
  medium: '#b4b4b4',
};