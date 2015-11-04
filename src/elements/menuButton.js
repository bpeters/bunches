'use strict';

var React = require('react-native');

var {
  Text,
  TouchableOpacity,
  StyleSheet,
} = React;

var Styles = StyleSheet.create({
  text: {
    left: 20,
    fontSize: 16,
    color: '#2e2e2e',
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