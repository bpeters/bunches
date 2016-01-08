'use strict';

var React = require('react-native');
var _ = require('lodash');

var Button = require('../elements/button');
var NavBarOnboard = require('../components/navBarOnboard');
var Loading = require('../elements/loading');

var defaultStyles = require('../styles');

var {
  View,
  Image,
  TextInput,
  StyleSheet,
  Text,
  ScrollView,
  Alert,
  Platform,
} = React;

var Styles = StyleSheet.create({
  view: {
    flex: 1,
    alignItems: 'stretch',
    backgroundColor: defaultStyles.background,
  },
  scroll: {
    flex: 1,
  },
  inputView: {
    left: 16,
    top: defaultStyles.navBarHeight + 16,
    height: 400,
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

    var usernameCheck = new RegExp("^[A-Za-z0-9]{1,15}$");

    if (this.state.email && this.state.password && this.state.name && this.state.username) {

      if (this.state.password.length < 8) {
        this.setState({
          error: {
            message: 'password must be greater than or equal to 8 characters in length'
          }
        });
      } else if (!usernameCheck.test(this.state.username)) {
        this.setState({
          error: {
            message: 'username needs to be less than 16 characters and contain no spaces or special characters'
          }
        });
      } else {

        this.props.actions.getUserByHandle(this.state.username)
          .then((user) => {

            if (user) {
              this.setState({
                error: {
                  message: 'username is already taken'
                }
              });
            } else {
              this.props.actions.createUser({
                email: _.trim(this.state.email),
                password: _.trim(this.state.password),
                name: _.trim(this.state.name),
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
        error: {
          message: 'all fields are required'
        }
      });
    }
  },
  renderButton: function () {
    return (
      <View style={Styles.buttonView}>
        <Button
          onPress={this.onCreateAccount}
          title='CREATE ACCOUNT'
          color={defaultStyles.blue}
        />
      </View>
    );
  },
  render: function() {
    if (_.get(this.state.error, 'message')) {
      Alert.alert(
        'Failed to Create Account',
        _.get(this.state.error, 'message'),
        [
          {text: 'Try Again', onPress: () => this.setState({error: null})},
        ]
      );
    }
    

    return (
      <View style={Styles.view}>
        <ScrollView
          ref='scrollView'
          keyboardDismissMode='on-drag'
          style={Styles.scroll}
          scrollEnabled={false}
        >
          <NavBarOnboard
            title='Create Account'
            onBackPress={this.onBackPress}
            clearSuccess={this.props.actions.clearSuccess}
            loading={this.props.store.loading}
            success={this.props.store.success}
          />
          <View style={Styles.inputView}>
            <TextInput
              style={Styles.input}
              onChangeText={(name) => this.setState({name})}
              value={this.state.name}
              returnKeyType='next'
              placeholder='Full Name (Sally Joy)'
              placeholderTextColor={defaultStyles.gray}
              autoCorrect={false}
              onSubmitEditing={() => {
                this.refs.username.focus();
              }}
            />
            <TextInput
              ref='username'
              style={Styles.input}
              onChangeText={(username) => this.setState({username})}
              value={this.state.username}
              returnKeyType='next'
              placeholder='Username (sjoy)'
              placeholderTextColor={defaultStyles.gray}
              autoCapitalize='none'
              autoCorrect={false}
              onSubmitEditing={() => {
                this.refs.email.focus();
              }}
            />
            <TextInput
              ref='email'
              style={Styles.input}
              onChangeText={(email) => this.setState({email})}
              value={this.state.email}
              keyboardType='email-address'
              returnKeyType='next'
              placeholder='Email (sally@university.edu)'
              autoCapitalize='none'
              autoCorrect={false}
              placeholderTextColor={defaultStyles.gray}
              onSubmitEditing={() => {
                this.refs.password.focus();
              }}
            />
            <TextInput
              ref='password'
              style={Styles.input}
              onChangeText={(password) => this.setState({password})}
              value={this.state.password}
              secureTextEntry={true}
              returnKeyType='done'
              placeholder='Password'
              autoCapitalize='none'
              autoCorrect={false}
              placeholderTextColor={defaultStyles.gray}
              onSubmitEditing={() => {
                this.onCreateAccount();
              }}
            />
          </View>
        </ScrollView>
        {this.props.store.loading ? null : this.renderButton()}
      </View>
    );
  }
});