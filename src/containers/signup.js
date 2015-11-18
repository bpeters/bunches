'use strict';

var React = require('react-native');

var Button = require('../elements/button');
var NavBarOnboard = require('../components/navBarOnboard');

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
    position: 'absolute',
    bottom: 16,
    left: 16,
  },
});

module.exports = React.createClass({
  propTypes: {
    navigator: React.PropTypes.object,
  },
  onBackPress: function () {
    this.props.navigator.pop();
  },
  onCreateAccount: function () {

  },
  render: function() {
    return (
      <View style={Styles.view}>
        <NavBarOnboard
          title='Create Account'
          onBackPress={this.onBackPress}
        />
        <View style={Styles.buttonView}>
          <Button
            onPress={this.onCreateAccount}
            title='CREATE ACCOUNT'
            color={defaultStyles.red}
          />
        </View>
      </View>
    );
  }
});