'use strict';

var React = require('react-native');

var Button = require('../elements/button');

var defaultStyles = require('../styles');

var {
  View,
  Image,
  StyleSheet,
} = React;

var Styles = StyleSheet.create({
  view: {
    flex: 1,
    alignItems: 'stretch',
    backgroundColor: defaultStyles.white,
  },
  buttonView: {
    alignSelf: 'flex-end'
  },
});

module.exports = React.createClass({
  render: function() {
    return (
      <View style={Styles.view}>
        <View style={Styles.buttonView}>
          <Button
            onPress={this.onLoginPress}
            title='Sign In'
          />
          </View>
      </View>
    );
  }
});