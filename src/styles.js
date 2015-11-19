'use strict';

var React = require('react-native');
var Dimensions = require('Dimensions');

var {StyleSheet} = React;

var window = Dimensions.get('window');
var navBarHeight = 56;
var chatBarHeight = 56;
var bodyHeight = window.height;
var bodyWidth= window.width;

module.exports = {
  window: window,
  navBarHeight: navBarHeight,
  chatBarHeight: chatBarHeight,
  bodyHeight: bodyHeight,
  bodyWidth: bodyWidth,
  blue: '#ED3D96',
  red: '#03A9F4',
  yellow: '#F9CA6B',
  green: '#02D04E',
  background: '#F1F5F7',
  light: '#FAFAFA',
  white: '#ffffff',
  dark: '#2e2e2e',
  medium: '#b4b4b4',
};