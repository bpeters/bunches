'use strict';

var React = require('react-native');
var Dimensions = require('Dimensions');

var {
  StyleSheet,
  Platform,
} = React;

var window = Dimensions.get('window');
var navBarHeight = 56;
var chatBarHeight = 56;
var statBarHeight = 44;
var bodyHeight = window.height;
var bodyWidth= window.width;


// Platform specific styling
var container; // bunch and chat container
var chatCard; // chat card
var statBar; // stat bar

if(Platform.OS === 'ios'){
  container = bodyHeight - chatBarHeight;
} else {
  container = bodyHeight - chatBarHeight - 25;
  chatCard = {
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#D8D7D3'
  };
  statBar = {
    borderBottomWidth: 1,
    borderBottomColor: '#D8D7D3'
  }
}

module.exports = {
  window: window,
  navBarHeight: navBarHeight,
  chatBarHeight: chatBarHeight,
  bodyHeight: bodyHeight,
  bodyWidth: bodyWidth,
  statBarHeight: statBarHeight,
  medium: '#b4b4b4',
  light: '#FAFAFA',
  yellow: '#F9CA6B',
  green: '#02D04E',
  red: '#ED3D96',
  blue: '#03A9F4',
  dark: '#222222',
  darkMedium: '#5F5F5F',
  darkHighlight: '#1E1E1E',
  gray: '#A8A7A4',
  grayLight: '#D8D7D3',
  white: '#FFFFFF',
  background: '#F1F5F7',
  chatCard: chatCard,
  container: container,
  statBar: statBar,
};