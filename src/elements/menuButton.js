'use strict';

var React = require('react-native');

var {
  Icon,
} = require('react-native-icons');

var defaultStyles = require('../styles');

var {
  TouchableOpacity,
  StyleSheet,
  View
} = React;

var Styles = StyleSheet.create({
  icon: {
    width: defaultStyles.navBarHeight,
    height: defaultStyles.navBarHeight,
  },
});

module.exports = React.createClass({
  propTypes: {
    onPress: React.PropTypes.func,
  },
  render: function() {
    return (
      <TouchableOpacity onPress={this.props.onPress}>
        <Icon
          name='fontawesome|bars'
          size={24}
          color='#ffffff'
          style={Styles.icon}
        />
      </TouchableOpacity>     
    );
  }
});