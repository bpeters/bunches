'use strict';

var React = require('react-native');

var {
  Icon,
} = require('react-native-icons');

var defaultStyles = require('../styles');

var {
  TouchableOpacity,
  View,
  Image,
  StyleSheet,
} = React;

var Styles = StyleSheet.create({
  body: {
    width: 40,
    height: 40,
    backgroundColor: defaultStyles.medium,
    borderRadius: 20,
  },
  icon: {
    left: 8,
    top: 8,
    width: 24,
    height: 24,
  },
  image: {
    height: 40,
    width: 40,
    borderRadius: 20,
    justifyContent: 'center',
  },
});

module.exports = React.createClass({
  propTypes: {
    onPress: React.PropTypes.func,
    imageURL: React.PropTypes.string,
  },
  renderIcon: function() {
    return (
      <Icon
        name='ion|person'
        size={24}
        color='#ffffff'
        style={Styles.icon}
      />
    );
  },
  renderImage: function() {
    return (
      <Image
        style={Styles.image}
        source={{uri: this.props.imageURL}}
      />
    );
  },
  render: function() {
    return (
      <TouchableOpacity onPress={this.props.onPress}>
        <View style={Styles.body}>
          {this.props.imageURL ? this.renderImage() : this.renderIcon()}
        </View>
      </TouchableOpacity>
    );
  }
});