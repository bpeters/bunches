'use strict';

var React = require('react-native');
var {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableHighlight,
} = React;

var NavBarNewChat = require('../components/navBarNewChat');
var Camera = require('react-native-camera');

var defaultStyles = require('../styles');

var Styles = StyleSheet.create({
    captured: {
      backgroundColor: defaultStyles.dark,
      height: defaultStyles.bodyHeight,
      width: defaultStyles.bodyWidth,      
    },
    navbar: {
      opacity: 0.5,
    },
});

module.exports = React.createClass({
  propTypes: {
    image: React.PropTypes.string,
  },
  getInitialState: function() {
    return ({
      capturedBase64: ''
    });
  },

  render: function() {
    console.log(this.props);
    return (
      <View>
        <NavBarNewChat
          title="Preview Image"
          onBackPress={this.goBackNav}
          onSubmitPress={this.addNewChat}
          style={Styles.navbar}
        />  
        <Image
          source={{
            isStatic: true,
            uri: 'data:image/jpeg;base64,' + this.props.route.image,
          }}
          style={Styles.captured}
          />
      </View>
    );
  }
});