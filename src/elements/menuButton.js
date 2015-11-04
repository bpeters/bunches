'use strict';

var React = require('react-native');

/* Not Working
var {
  Icon,
} = require('react-native-icons');
*/

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
  icon: {
    top: 16,
    left: 16,
    width: 24,
    height: 24,
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