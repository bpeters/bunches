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
  status: {
    height: 12,
    width: 12,
    borderRadius: 6,
    position: 'absolute',
    bottom: 0,
    left: 0,
    borderWidth: 2,
    borderColor: defaultStyles.white,
  },
});

module.exports = React.createClass({
  propTypes: {
    onPress: React.PropTypes.func,
    imageURL: React.PropTypes.string,
    online: React.PropTypes.bool,
    self: React.PropTypes.bool,
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
  renderStatus: function() {
    var color = defaultStyles.medium;

    if (this.props.online) {
      color = defaultStyles.green;
    }

    return (
      <View 
        style={[Styles.status, {
          backgroundColor: color,
        }]}
      />
    );
  },
  render: function() {
    return (
      <TouchableOpacity onPress={this.props.onPress}>
        <View style={Styles.body}>
          {this.props.imageURL ? this.renderImage() : this.renderIcon()}
        </View>
        {!this.props.self ? this.renderStatus() : null}
      </TouchableOpacity>
    );
  }
});