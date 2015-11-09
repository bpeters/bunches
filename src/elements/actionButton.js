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
    backgroundColor: defaultStyles.red,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }, 
  icon: {
    width: 24,
    height: 24,
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
            name='fontawesome|plus'
            size={24}
            color='#ffffff'
            style={Styles.icon}
          />
        </View>
      </TouchableOpacity>
    );
  }
});