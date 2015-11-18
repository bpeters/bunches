'use strict';

var React = require('react-native');

var {
  Icon,
} = require('react-native-icons');

var defaultStyles = require('../styles');

var {
  View,
  TouchableOpacity,
  StyleSheet,
} = React;

var Styles = StyleSheet.create({
  actionButton: {
    position: 'absolute',
    backgroundColor: 'transparent',
    bottom: 76,
    right: 16,
  },
  iconView: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'transparent',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: defaultStyles.dark,
    shadowOpacity: 0.5,
    shadowRadius: 4,
    shadowOffset: {
      width: 0,
      height: 0
    },
  }, 
  icon: {
    borderRadius: 28,
    backgroundColor: defaultStyles.red,
    width: 56,
    height: 56,
  },
});

module.exports = React.createClass({
  propTypes: {
    onPress: React.PropTypes.func,
    show: React.PropTypes.bool,
  },
  render: function() {
    return (
      <View style={Styles.actionButton}>
        <TouchableOpacity activeOpacity={0.9} onPress={this.props.onPress}>
          <View style={Styles.iconView}>
            <Icon
              name={this.props.show ? 'material|more-vert' : 'material|more'}
              size={30}
              color='#ffffff'
              style={Styles.icon}
            />
          </View>
        </TouchableOpacity>
      </View>
    );
  }
});