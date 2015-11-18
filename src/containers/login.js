'use strict';

var React = require('react-native');

var Button = require('../elements/button');
var NavBarOnboard = require('../components/navBarOnboard');

var defaultStyles = require('../styles');

var {
  View,
  Image,
  TextInput,
  StyleSheet,
  Text,
} = React;

var Styles = StyleSheet.create({
  view: {
    flex: 1,
    alignItems: 'stretch',
    backgroundColor: defaultStyles.background,
  },
  inputView: {
    left: 16,
    top: defaultStyles.navBarHeight + 16,
  },
  label: {
    marginTop: 16,
    marginBottom: 16,
    fontFamily: 'Roboto-Bold',
  },
  input: {
    width: defaultStyles.bodyWidth - 16 - 16,
    height: 56,
    borderRadius: 4,
    marginBottom: 16,
    backgroundColor: defaultStyles.white,
    paddingLeft: 16,
    fontFamily: 'Roboto-Light',
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
  getInitialState: function () {
    return {
      email: null,
      password: null,
    };
  },
  onBackPress: function () {
    this.props.navigator.pop();
  },
  onLogin: function () {

  },
  render: function() {
    return (
      <View style={Styles.view}>
        <NavBarOnboard
          title='Sign In'
          onBackPress={this.onBackPress}
        />
        <View style={Styles.inputView}>
          <Text style={Styles.label}>
            Email
          </Text>
          <TextInput
            style={Styles.input}
            onChangeText={(email) => this.setState({email})}
            value={this.state.email}
            keyboardType='email-address'
            returnKeyType='next'
            clearTextOnFocus={true}
            defaultValue='email@email.com'
            onSubmitEditing={() => {
              this.refs.password.focus();
            }}
          />
          <Text style={Styles.label}>
            Password
          </Text>
          <TextInput
            ref='password'
            style={Styles.input}
            onChangeText={(password) => this.setState({password})}
            value={this.state.password}
            secureTextEntry={true}
            returnKeyType='done'
            clearTextOnFocus={true}
            defaultValue='password'
            onSubmitEditing={() => {
              this.onLogin();
            }}
          />
        </View>
        <View style={Styles.buttonView}>
          <Button
            onPress={this.onLogin}
            title='SIGN IN'
            color={defaultStyles.red}
          />
        </View>
        <View style={Styles.buttonView}>
          <Button
            onPress={this.onLogin}
            title='SIGN IN'
            color={defaultStyles.red}
          />
        </View>
      </View>
    );
  }
});