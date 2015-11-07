'use strict';

var React = require('react-native');
var Dimensions = require('Dimensions');

var {StyleSheet} = React;

var window = Dimensions.get('window');
var navBarHeight = 56;
var chatBarHeight = 76;
var bodyHeight = window.height - navBarHeight - chatBarHeight- 20;
var bodyWidth= window.width;

module.exports = {
  window: window,
  navBarHeight: navBarHeight,
  chatBarHeight: chatBarHeight,
  bodyHeight: bodyHeight,
  bodyWidth: bodyWidth,
  blue: '#31C3D9',
  red: '#B96B6B',
  yellow: '#F9CA6B',
  background: '#F1F5F7',
  light: '#FAFAFA',
  white: '#ffffff',
  dark: '#2e2e2e',
  medium: '#b4b4b4',
};