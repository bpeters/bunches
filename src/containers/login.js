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
  ScrollView,
  AlertIOS,
  Platform,
  TouchableOpacity,
} = React;

var Loading;

if (Platform.OS === 'android') {
  Loading = require('../elements/loadingAndroid');
} else {
  Loading = require('../elements/loadingIOS');
}

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
  forgotPassword: {
    fontFamily: 'Roboto-Regular',
    color: defaultStyles.gray
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
      forgotPassword: false,
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
    this.props.actions.loginUser(_.trim(this.state.email), _.trim(this.state.password));
  },
  onResetPassword: function () {
    this.props.actions.resetPassword(this.state.email);
    this.setState({
      forgotPassword: !this.state.forgotPassword
    });
  },
  onPressForgotPassword: function () {
    this.setState({
      forgotPassword: !this.state.forgotPassword
    });
  },
  renderButton: function () {
    return (
      <View style={Styles.buttonView}>
        <Button
          onPress={this.onLogin}
          title='SIGN IN'
          color={defaultStyles.blue}
        />
      </View>
    );
  },
  renderResetButton: function () {
    return (
      <View style={Styles.buttonView}>
        <Button
          onPress={this.onResetPassword}
          title='RESET PASSWORD'
          color={defaultStyles.red}
        />
      </View>
    );
  },
  renderLogin: function () {
    return (
      <View style={Styles.inputView}>
        <TextInput
          style={Styles.input}
          onChangeText={(email) => this.setState({email})}
          value={this.state.email}
          keyboardType='email-address'
          returnKeyType='next'
          placeholder='Email'
          placeholderTextColor={defaultStyles.gray}
          autoCapitalize='none'
          autoCorrect={false}
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
            this.onLogin();
          }}
        />
        <TouchableOpacity activeOpacity={0.9} onPress={this.onPressForgotPassword}>
          <Text style={Styles.forgotPassword}>
            Forgot Password?
          </Text>
        </TouchableOpacity>
      </View>
    );
  },
  renderForgotPassword: function () {
    return (
      <View style={Styles.inputView}>
        <TextInput
          style={Styles.input}
          onChangeText={(email) => this.setState({email})}
          value={this.state.email}
          keyboardType='email-address'
          returnKeyType='next'
          placeholder='Email'
          autoCapitalize='none'
          autoCorrect={false}
          placeholderTextColor={defaultStyles.gray}
          onSubmitEditing={() => {
            this.refs.password.focus();
          }}
        />
      </View>
    );
  },
  render: function() {
    return (
      <View style={Styles.view}>
        <ScrollView
          ref='scrollView'
          keyboardDismissMode='on-drag'
          style={Styles.scroll}
          scrollEnabled={false}
        >
          <NavBarOnboard
            title='Sign In'
            onBackPress={this.onBackPress}
            clearSuccess={this.props.actions.clearSuccess}
            loading={this.props.store.loading}
            success={this.props.store.success}
          />
          {this.state.forgotPassword ? this.renderForgotPassword() : this.renderLogin()}
        </ScrollView>
        {this.props.store.loading ? null : (!this.state.forgotPassword ? this.renderButton() : this.renderResetButton())}
      </View>
    );
  }
});