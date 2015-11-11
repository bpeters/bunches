'use strict';

var React = require('react-native');
var {
  StyleSheet,
  View,
  Image,
  TouchableHighlight,
  TouchableOpacity,
} = React;

var {
  Icon,
} = require('react-native-icons');
// var IconButton = require('../elements/iconButton');
var defaultStyles = require('../styles');

var Styles = StyleSheet.create({
  parent: {
    flex:1,
  },
  image: {
    flex:1,
    backgroundColor: defaultStyles.dark,
    width: defaultStyles.bodyWidth,  
  },
  iconView: {
    position:'absolute',
    top: 20,
    right: 20,
    width: 30,
    height: 30, 
  }, 
  icon: {
    width: 30,
    height: 30,
  },
});

module.exports = React.createClass({
  propTypes: {
    route: React.PropTypes.object,
 
  },
  render: function() {
    return (
      <View style={Styles.parent}>
        <TouchableHighlight onPress={this.props.route.onPress} style={Styles.parent}>
          <Image
            source={{
              uri: this.props.route.photo,
            }}
            style={Styles.image}
          />  
        </TouchableHighlight>
        <View style={Styles.iconView}>
          <TouchableOpacity onPress={this.props.route.onPress}>
          <Icon
            name='material|close'
            size={30}
            color='#ffffff'
            style={Styles.icon}
          />
         </TouchableOpacity>
        </View>
      </View>
    );
  }
});