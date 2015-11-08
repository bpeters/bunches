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
    position: 'absolute',
    width: 70,
    height: 70,
    borderRadius: 70,
    top: 160,
    right: 15,
    backgroundColor: defaultStyles.red,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }, 
  icon: {
    width: 70,
    height: 70,
  },
});

module.exports = React.createClass({
  propTypes: {
    user: React.PropTypes.object,
    onPress: React.PropTypes.func,

  },
  render: function() {
    return (
      <View style={Styles.iconView}>
        <TouchableOpacity onPress={this.props.onPress}>
          <Icon
            name='fontawesome|plus'
            size={25}
            color='#ffffff'
            style={Styles.icon}
          />
        </TouchableOpacity>
      </View>
    );
  }



});