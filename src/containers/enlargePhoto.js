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
    navigator: React.PropTypes.object,
    route: React.PropTypes.object,
    user: React.PropTypes.object,
  },
  onPress: function() {
    this.props.navigator.pop();
  },
  render: function() {
    return (
      <View style={Styles.parent}>
        <TouchableHighlight onPress={this.onPress} style={Styles.parent}>
          <Image
            source={{
              uri: this.props.route.photo,
            }}
            style={Styles.image}
          />
        </TouchableHighlight>
        <View style={Styles.iconView}>
          <TouchableOpacity onPress={this.onPress}>
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