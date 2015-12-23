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
    backgroundColor: 'transparent',
  },
  image: {
    marginTop: 60,
    alignSelf: 'center',
    width: 159 * 0.8,
    height: 400 * 0.8,
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
          style={Styles.image}
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