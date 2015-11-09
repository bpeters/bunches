'use strict';

var React = require('react-native');

var IconButton = require('../elements/iconButton');

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
    shadowOpacity: 0.5,
    shadowRadius: 2,
    shadowOffset: {
      width: 0,
      height: 1
    },
  },
  left: {
    flex: 1,
    alignItems: 'flex-start',
    height: defaultStyles.navBarHeight,
  },
  center: {
    flex: 4,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  right: {
    flex: 1,
    alignItems: 'flex-end',
  },
  title: {    
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
          <IconButton
            onPress={this.onHandlePress}
            icon='material|menu'
          />
        </View>
        <View style={Styles.center}>
          <Text style={Styles.title}>
            {this.props.title}
          </Text>
        </View>
        <View style={Styles.right}>
        </View>
      </View>
    );
  }
});

NavBar.contextTypes = {
  menuActions: React.PropTypes.object.isRequired
};

module.exports = NavBar;