'use strict';

var React = require('react-native');

var Button = require('../elements/button');
var Login = require('./login');
var Signup = require('./signup');

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
    actions: React.PropTypes.object,
  },
  componentDidMount: function () {
    this.props.actions.logoutUser();
  },
  onLoginPress: function () {
    this.props.actions.clearErrors();

    this.props.navigator.push({
      name: 'login',
      component: Login,
    });
  },
  onCreateAccountPress: function () {
    this.props.actions.clearErrors();

    this.props.navigator.push({
      name: 'signup',
      component: Signup,
    });
  },
  render: function() {
    return (
      <View style={Styles.view}>
        <View style={Styles.buttonView}>
          <Button
            onPress={this.onLoginPress}
            title='SIGN IN'
            color={defaultStyles.blue}
          />
          <Button
            onPress={this.onCreateAccountPress}
            title='CREATE ACCOUNT'
            color={defaultStyles.red}
          />
          </View>
      </View>
    );
  }
});