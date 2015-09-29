'use strict';

var React = require('react-native');
var Styles = require('../styles');

var Parse = require('parse/react-native');
var ParseReact = require('parse-react/react-native');

var NavBar = require('./navBar');
var Activity = require('./activity');

var {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  AlertIOS,
} = React;

module.exports = React.createClass({
  propTypes: {
    navigator: React.PropTypes.object,
    route: React.PropTypes.object
  },
  getInitialState: function() {
    return {
      email: null,
      password: null,
      error: null,
    };
  },
  onHandlePress: function() {
    if (this.state.email && this.state.password) {
      Parse.User.logIn(this.state.email, this.state.password, {
        success: (user) => {
          this.props.navigator.push({
            name: 'activity',
            component: Activity,
            hasSideMenu: true,
          })
        },
        error: (error) => {
          this.setState({
            error: error
          });
        }
      });
    } else {
      this.setState({
        error: {
          message: 'all fields required'
        }
      });
    }
  },
  render: function() {

    //lazy loading cause cyclical deps
    var SignUp = require('./signup');

    if (this.state.error) {
      AlertIOS.alert(
        'Failed to Log In',
        this.state.error.message,
        [
          {text: 'Try Again', onPress: () => this.setState({error: null})},
        ]
      );
    }

    return (
      <View>
        <NavBar
          title='Log In'
          rightButton={{
            text: 'Sign Up',
            onPress: () => {
              this.props.navigator.push({
                name: 'signup',
                component: SignUp
              });
            }
          }}
        />
        <View style={Styles.container}>
            <TextInput
              style={Styles.formInput}
              placeholder='Email'
              iosreturnKeyType='next'
              keyboardType='email-address'
              onChangeText={(email) => this.setState({email})}
              value={this.state.email}
            />
            <TextInput
              style={Styles.formInput}
              placeholder='Password'
              iosreturnKeyType='done'
              secureTextEntry={true}
              onChangeText={(password) => this.setState({password})}
              value={this.state.password}
            />
        </View>
        <View style={Styles.footer}>
          <TouchableOpacity onPress={this.onHandlePress}>
            <View style={Styles.bigButton}>
              <Text style={Styles.bigButtonText}>
                Log In
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
});