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
  loadingView: {
    position: 'absolute',
    backgroundColor: 'transparent',
    top: defaultStyles.navBarHeight - 28,
    right: (defaultStyles.bodyWidth / 2) - 28,
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
      error: this.props.store.error
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

    this.setState({
      error: nextProps.store.error
    });
  },
  onBackPress: function () {
    this.props.navigator.pop();
  },
  onLogin: function () {
    this.props.actions.loginUser(this.state.email, this.state.password);
  },
  renderLoading: function () {
    return (
      <View style={Styles.loadingView}>
        <Loading />
      </View>
    );
  },
  renderButton: function () {
    return (
      <View style={Styles.buttonView}>
        <Button
          onPress={this.onLogin}
          title='SIGN IN'
          color={defaultStyles.red}
        />
      </View>
    );
  },
  render: function() {

    if(Platform.OS === 'ios'){
      if (_.get(this.state.error, 'message')) {
        AlertIOS.alert(
          'Failed to Sign In',
          _.get(this.state.error, 'message'),
          [
            {text: 'Try Again', onPress: () => this.setState({error: null})},
          ]
        );
      }
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
            title='Sign In'
            onBackPress={this.onBackPress}
          />
          <View style={Styles.inputView}>
            <TextInput
              style={Styles.input}
              onChangeText={(email) => this.setState({email})}
              value={this.state.email}
              keyboardType='email-address'
              returnKeyType='next'
              placeholder='Email'
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
              onSubmitEditing={() => {
                this.onLogin();
              }}
            />
          </View>
        </ScrollView>
        {this.props.store.loading ? this.renderLoading() : this.renderButton()}
      </View>
    );
  }
});