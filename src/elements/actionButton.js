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
  iconView: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'transparent',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  },
  render: function() {
    return (
      <TouchableOpacity onPress={this.props.onPress}>
        <View style={Styles.iconView}>
          <Icon
            name='material|plus'
            size={30}
            color='#ffffff'
            style={Styles.icon}
          />
        </View>
      </TouchableOpacity>
    );
  }
});