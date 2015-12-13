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

module.exports = React.createClass({
  propTypes: {
    onPress: React.PropTypes.func,
    onLongPress: React.PropTypes.func,
    icon: React.PropTypes.string,
    size: React.PropTypes.number,
    color: React.PropTypes.string,
  },
  render: function() {

    var Styles = StyleSheet.create({
      icon: {
        width: this.props.size || defaultStyles.navBarHeight,
        height: this.props.size || defaultStyles.navBarHeight,
      },
    });

    return (
      <TouchableOpacity onPress={this.props.onPress} onLongPress={this.props.onLongPress}>
        <Icon
          name={this.props.icon}
          size={this.props.size || 24}
          color={this.props.color || defaultStyles.white}
          style={Styles.icon}
        />
      </TouchableOpacity>
    );
  }
});