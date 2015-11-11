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