'use strict';

var React = require('react-native');

var defaultStyles = require('../styles');

var {
  View,
  Image,
  StyleSheet,
} = React;

var Styles = StyleSheet.create({
  view: {
    flex: 1,
  },
});

module.exports = React.createClass({
  render: function() {
    return (
      <View style={Styles.view}>
      </View>
    );
  }
});