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
    justifyContent: 'center',
    alignItems: 'flex-start',
    height: 44,
    backgroundColor: defaultStyles.light,
  },
  left: {
    flex: 1,
    justifyContent: 'center',
    height: 44,
  },
  center: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
    height: 44,
  },
  title: {
    fontSize: 18,
    color: defaultStyles.dark,
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