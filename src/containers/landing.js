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
  imageBubble: {
    marginTop: 160,
    alignSelf: 'center',
    width: 295 * 0.5,
    height: 299 * 0.5,
  },
  imageLogo: {
    marginTop: 60,
    alignSelf: 'center',
    width: 400 * 0.6,
    height: 74 * 0.6,
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
    this.props.navigator.push({
      name: 'login',
      component: Login,
    });
  },
  onCreateAccountPress: function () {
    this.props.navigator.push({
      name: 'signup',
      component: Signup,
    });
  },
  render: function() {
    return (
      <View style={Styles.view}>
        <Image
          style={Styles.imageBubble}
          source={require('../assets/bubble.png')}
        />
        <Image
          style={Styles.imageLogo}
          source={require('../assets/logo.png')}
        />
        <View style={Styles.buttonView}>
          <Button
            onPress={this.onLoginPress}
            title='SIGN IN'
            color={defaultStyles.red}
          />
          <Button
            onPress={this.onCreateAccountPress}
            title='CREATE ACCOUNT'
            color={defaultStyles.blue}
          />
          </View>
      </View>
    );
  }
});