'use strict';

var React = require('react-native');

var MenuButton = require('../elements/menuButton');

var defaultStyles = require('../styles');

var {
  Text,
  View,
  StyleSheet,
} = React;

var Styles = StyleSheet.create({
  body: {
    flex: 1,
    flexDirection: 'row',
    height: defaultStyles.navBarHeight,
    backgroundColor: defaultStyles.blue,
  },
  left: {
    flex: 1,
    alignItems: 'flex-start',
  },
  center: {
    flex: 4,
    alignItems: 'flex-start',
  },
  title: {
    top: 16,
    fontSize: 20,
    color: defaultStyles.white,
    fontFamily: 'Roboto-Medium',
  },
});

var NavBar = React.createClass({
  propTypes: {
    title: React.PropTypes.string,
    menuButton: React.PropTypes.object,
  },
  onHandlePress: function(e) {
    this.context.menuActions.toggle();
    this.props.menuButton.onPress(e);
  },
  render: function() {
    return (
      <View style={Styles.body}>
        <View style={Styles.left}>
          <MenuButton
            onPress={this.onHandlePress}
          />
        </View>
        <View style={Styles.center}>
          <Text style={Styles.title}>
            {this.props.title}
          </Text>
        </View>
      </View>
    );
  }
});

NavBar.contextTypes = {
  menuActions: React.PropTypes.object.isRequired
};

module.exports = NavBar;