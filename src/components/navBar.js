'use strict';

var React = require('react-native');
var Styles = require('../styles');

var NavButton = require('./navButton');
var MenuButton = require('./menuButton');

var {
  Text,
  View,
  TouchableOpacity,
} = React;

module.exports = React.createClass({
  propTypes: {
    title: React.PropTypes.string,
    leftButton: React.PropTypes.object,
    rightButton: React.PropTypes.object,
    menuButton: React.PropTypes.object,
  },
  renderLeftButton: function() {
    if (this.props.menuButton) {
      return (
         <MenuButton
          onPress={this.props.menuButton.onPress}
        />
      );
    } else if (this.props.leftButton) {
      return (
        <NavButton
          text={this.props.leftButton.text}
          onPress={this.props.leftButton.onPress}
          side='left'
        />
      );
    }
  },
  renderRightButton: function() {
    if (this.props.rightButton) {
      return (
        <NavButton
          text={this.props.rightButton.text}
          onPress={this.props.rightButton.onPress}
          side='right'
        />
      );
    }
  },
  render: function() {
    return (
      <View style={Styles.navBar}>
        <View style={Styles.navBarLeft}>
          {this.renderLeftButton()}
        </View>
        <View style={Styles.navBarCenter}>
          <Text style={Styles.navBarTitle}>
            {this.props.title}
          </Text>
        </View>
        <View style={Styles.navBarRight}>
          {this.renderRightButton()}
        </View>
      </View>
    );
  }
});