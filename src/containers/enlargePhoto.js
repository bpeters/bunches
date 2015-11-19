'use strict';

var React = require('react-native');
var {
  StyleSheet,
  View,
  Image,
  TouchableHighlight,
  TouchableOpacity,
} = React;

var IconButton = require('../elements/iconButton');

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
});

module.exports = React.createClass({
  propTypes: {
    navigator: React.PropTypes.object,
    route: React.PropTypes.object,
  },
  onPress: function() {
    this.props.navigator.pop();
  },
  render: function() {
    console.log(this.props.route.photo);
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
          <IconButton
            onPress={this.onPress}
            icon='material|close'
            size={30}
          />
        </View>
      </View>
    );
  }
});