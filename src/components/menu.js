'use strict';

var React = require('react-native');
var Styles = require('../styles');

var {
  View,
  Image,
} = React;

module.exports= React.createClass({
  render: function() {
    return (
      <View style={Styles.splash}>
        <Image
          style={Styles.splashImage}
          source={require('image!splash')}
        />
      </View>
    );
  }
});