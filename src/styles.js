'use strict';

var React = require('react-native');
var Dimensions = require('Dimensions');

var {StyleSheet} = React;

var window = Dimensions.get('window');
var statusBarHeight = 20;
var navBarHeight = 44;
var bodyHeight = window.height - statusBarHeight - navBarHeight;
var white = '#ffffff';
var light = '#f4f4f4';
var dark = '#2e2e2e';
var medium = '#b4b4b4';

module.exports = StyleSheet.create({
  app: {
    flex: 1,
  },
  shadow: {
    shadowColor: dark,
    shadowOpacity: 0.5,
    shadowOffset: {
      width: 0,
      height: 2
    },
  },
  statusBar: {
    height: statusBarHeight,
    backgroundColor: light
  },
  menu: {
    backgroundColor: medium,
    height: bodyHeight + navBarHeight,
  },
  menuRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
    paddingLeft: 30,
  },
  menuRowText: {
    flex: 1,
    fontSize: 14,
    color: light,
  },
  menuSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
    paddingLeft: 20,
    marginTop: 20,
  },
  menuSectionText: {
    flex: 1,
    fontSize: 14,
    fontWeight: 'bold',
    color: light,
  },
  splash: {
    flex: 1,
    alignItems: 'stretch',
  },
  splashImage: {
    flex: 1,
  },
  navBar: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start',
    height: navBarHeight,
    backgroundColor: light,
  },
  navBarLeft: {
    flex: 1,
    justifyContent: 'center',
    height: navBarHeight,
  },
  navBarCenter: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
    height: navBarHeight,
  },
  navBarRight: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-end',
    height: navBarHeight,
  },
  leftNavButton: {
    left: 20,
    fontSize: 16,
    color: dark,
  },
  rightNavButton: {
    right: 20,
    fontSize: 16,
    color: dark,
  },
  navBarTitle: {
    fontSize: 18,
    color: dark,
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    backgroundColor: white,
    width: window.width,
    height: bodyHeight,
  },
  footer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    height: 80,
    top: -80,
  },
  body: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
  },
  formInput: {
    height: 80,
    borderColor: light,
    paddingLeft: 20,
    borderWidth: 1,
    fontSize: 18,
    color: dark,
  },
  bigButton: {
    height: 80,
    backgroundColor: light,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bigButtonText: {
    fontSize: 18,
    color: dark,
  },
  list: {
    marginTop: 0,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 80,
    paddingLeft: 20,
  },
  rowSeparator: {
    height: 1,
    backgroundColor: light,
  },
  rowText: {
    flex: 1,
    fontSize: 18,
    color: dark,
  },
  switch: {
    right: 20
  },
  channel: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    backgroundColor: white,
    height: bodyHeight - 40,
  },
  channelList: {
    marginTop: 0,
  },
  channelRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
    paddingLeft: 20,
  },
  channelUser: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    paddingLeft: 20,
  },
  channelUserText: {
    flex: 1,
    fontSize: 14,
    color: dark,
    fontWeight: 'bold',
  },
  channelRowText: {
    flex: 1,
    fontSize: 14,
    color: dark,
    paddingLeft: 20,
  },
  channelInput: {
    height: 40,
    borderColor: light,
    paddingLeft: 20,
    borderWidth: 1,
    fontSize: 18,
    color: dark,
    backgroundColor: white,
  },
  picker: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: light,
  },
});