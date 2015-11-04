'use strict';

var React = require('react-native');

var defaultStyles = require('../styles');

var {
  Text,
  TouchableOpacity,
  StyleSheet,
} = React;

var Styles = StyleSheet.create({
  text: {
    top: 16,
    left: 16,
    fontSize: 20,
    color: defaultStyles.white,
  },
});

module.exports = React.createClass({
  propTypes: {
    onPress: React.PropTypes.func,
  },
  render: function() {
    return (
      <TouchableOpacity onPress={this.props.onPress}>
        <Text style={Styles.text}>
          Menu
        </Text>
      </TouchableOpacity>
    );
  }
});