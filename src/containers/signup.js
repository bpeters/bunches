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
      name: null,
      username: null,
      email: null,
      password: null,
      error: null,
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
  onCreateAccount: function () {
    this.setState({
      error: null
    });

    if (this.state.email && this.state.password && this.state.name && this.state.username) {

      if (this.state.password.length >= 8) {
        this.setState({
          error: 'password must be greater than or equal to 8 characters in length'
        });
      } else {

        this.props.actions.checkUsername(this.state.username)
          .then((user) => {

            if (user) {
              this.setState({
                error: 'username is already taken'
              });
            } else {
              this.props.actions.createUser({
                email: this.state.email,
                password: this.state.password,
                name: this.state.name,
                username: this.state.username,
              });

              this.setState({
                error: null
              });
            }

          });

      }

    } else {
      this.setState({
        error: 'all fields are required'
      });
    }
  },
  render: function() {
    return (
      <View style={Styles.view}>
        <NavBarOnboard
          title='Create Account'
          onBackPress={this.onBackPress}
        />
        <View style={Styles.inputView}>
          <Text style={Styles.label}>
            Full Name
          </Text>
          <TextInput
            style={Styles.input}
            onChangeText={(name) => this.setState({name})}
            value={this.state.name}
            returnKeyType='next'
            placeholder='Sally Joy'
            onSubmitEditing={() => {
              this.refs.username.focus();
            }}
          />
          <Text style={Styles.label}>
            Username
          </Text>
          <TextInput
            ref='username'
            style={Styles.input}
            onChangeText={(username) => this.setState({username})}
            value={this.state.username}
            returnKeyType='next'
            placeholder='sjoy'
            onSubmitEditing={() => {
              this.refs.email.focus();
            }}
          />
          <Text style={Styles.label}>
            University or Private Email
          </Text>
          <TextInput
            ref='email'
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
              this.onCreateAccount();
            }}
          />
          <Text style={Styles.error}>
            {_.get(this.props.store.error, 'message') || this.state.error}
          </Text>
        </View>
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