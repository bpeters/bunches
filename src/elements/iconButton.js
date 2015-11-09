'use strict';

var React = require('react-native');

var {
  Icon,
} = require('react-native-icons');

var defaultStyles = require('../styles');

var {
  TouchableOpacity,
  StyleSheet,
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
    icon: React.PropTypes.string,
  },
  render: function() {
    return (
      <TouchableOpacity onPress={this.props.onPress}>
        <Icon
          name={this.props.icon}
          size={24}
          color='#ffffff'
          style={Styles.icon}
        />
      </TouchableOpacity>
    );
  }
});