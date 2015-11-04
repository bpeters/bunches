'use strict';

var React = require('react-native');

var {
  View,
  Image,
  StyleSheet,
} = React;

var Styles = StyleSheet.create({
  view: {
    flex: 1,
    alignItems: 'stretch',
  },
  image: {
    flex: 1,
  },
});

module.exports = React.createClass({
  render: function() {
    return (
      <View style={Styles.view}>
        <Image
          style={Styles.image}
          source={require('image!splash')}
        />
      </View>
    );
  }
});