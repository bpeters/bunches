'use strict';

var React = require('react-native');
var _ = require('lodash');

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
  error: {
    marginTop: 16,
    marginBottom: 16,
    fontFamily: 'Roboto-Bold',
    color: defaultStyles.red,
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
    store: React.PropTypes.object,
  },
  getInitialState: function () {
    return {
      email: null,
      password: null,
    };
  },
  componentWillReceiveProps: function (nextProps) {
    var Bunch = require('./bunch');

    if (nextProps.store.user) {
      this.props.navigator.replace({
        name: 'bunch',
        component: Bunch,
        hasSideMenu: true,
      });
    }
  },
  onBackPress: function () {
    this.props.navigator.pop();
  },
  onLogin: function () {
    this.props.actions.loginUser(this.state.email, this.state.password);
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
            placeholder='sally@university.edu'
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
            placeholder='*******'
            onSubmitEditing={() => {
              this.onLogin();
            }}
          />
          <Text style={Styles.error}>
            {_.get(this.props.store.error, 'message')}
          </Text>
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