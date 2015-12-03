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
  medium: '#b4b4b4',
  light: '#FAFAFA',

  dark: '#222222',
  darkMedium: '#5F5F5F',
  darkHighlight: '#1E1E1E',
  gray: '#A8A7A4',
  white: '#FFFFFF',
};