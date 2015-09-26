'use strict';

var React = require('react-native');

var {StyleSheet} = React;

var light = '#f4f4f4';

module.exports = StyleSheet.create({
  navBar: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start',
    height: 88,
    backgroundColor: light,
  },
  navBarLeft: {
    flex: 1,
    justifyContent: 'center',
    height: 88,
  },
  navBarCenter: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 88,
  },
  navBarRight: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-end',
    height: 88,
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
    fontSize: 20,
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
    fontSize: 20,
  },
  bigButton: {
    height: 80,
    backgroundColor: light,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bigButtonText: {
    fontSize: 20,
  },
  list: {
    marginTop: 0,
    height: 300,
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
    fontSize: 20,
  },
  switch: {
    right: 20
  }
});