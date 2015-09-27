'use strict';

var React = require('react-native');

var {StyleSheet} = React;

var light = '#f4f4f4';

module.exports = StyleSheet.create({
  app: {
    flex: 1,
  },
  statusBar: {
    height: 20,
    backgroundColor: light
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
    height: 44,
    backgroundColor: light,
  },
  navBarLeft: {
    flex: 1,
    justifyContent: 'center',
    height: 44,
  },
  navBarCenter: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
    height: 44,
  },
  navBarRight: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-end',
    height: 44,
  },
  leftNavButton: {
    left: 20,
    fontSize: 16,
  },
  rightNavButton: {
    right: 20,
    fontSize: 16,
  },
  navBarTitle: {
    fontSize: 18,
    flexWrap: 'wrap'
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
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
  },
  bigButton: {
    height: 80,
    backgroundColor: light,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bigButtonText: {
    fontSize: 18,
  },
  list: {
    marginTop: 0,
    height: 600,
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
  },
  switch: {
    right: 20
  }
});