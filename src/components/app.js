'use strict';

var React = require('react-native');
var Styles = require('../styles/app');

var {
  Text,
  View,
} = React;

var App = React.createClass({
  render: function() {
    return (
      <View style={Styles.container}>
        <Text style={Styles.welcome}>
          Welcome to React Native!
        </Text>
        <Text style={Styles.instructions}>
          To get started, edit index.ios.js
        </Text>
        <Text style={Styles.instructions}>
          Press Cmd+R to reload,{'\n'}
          Cmd+D or shake for dev menu
        </Text>
      </View>
    );
  }
});

module.exports = App;