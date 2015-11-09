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

module.exports = React.createClass({
  propTypes: {
    title: React.PropTypes.string,
    onBackPress: React.PropTypes.func,
  },
  render: function() {
    return (
      <View style={Styles.body}>
        <View style={Styles.left}>
          <IconButton
            onPress={this.props.onBackPress}
            icon='fontawesome|arrow-left'
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