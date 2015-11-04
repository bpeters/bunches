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
    left: 20,
    fontSize: 16,
    color: defaultStyles.dark,
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