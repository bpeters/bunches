'use strict';

var React = require('react-native');
var Styles = require('../styles');

var Parse = require('parse/react-native');
var ParseReact = require('parse-react/react-native');

var NavBar = require('./navBar');
var SetClasses = require('./setClasses');

var {
  Text,
  TextInput,
  TouchableOpacity,
  View,
} = React;

module.exports = React.createClass({
  propTypes: {
    navigator: React.PropTypes.object,
    route: React.PropTypes.object
  },
  getInitialState: function() {
    return {
      id: null,
      email: null,
      name: null,
      password: null,
      error: null,
    };
  },
  onHandlePress: function() {
    if (this.state.id && this.state.email && this.state.name && this.state.password) {
      var user = new Parse.User();

      user.set('username', this.state.email);
      user.set('password', this.state.password);
      user.set('email', this.state.email);
      user.set('name', this.state.name);
      user.set('studentId', this.state.id);
      user.set('setClasses', false);
      user.set('setTutorClasses', false);

      user.signUp(null, {
        success: (user) => {
          this.props.navigator.push({
            name: 'setClasses',
            component: SetClasses,
            user: user,
          })
        },
        error: (user, error) => {
          this.setState({
            error: error
          });
        }
      });
    }
  },
  render: function() {

    //lazy loading cause cyclical deps
    var LogIn = require('./login');

    return (
      <View>
        <NavBar
          title='Sign Up'
          rightButton={{
            text: 'Log In',
            onPress: () => {
              this.props.navigator.push({
                name: 'login',
                component: LogIn
              });
            }
          }}
        />
        <View style={Styles.container}>
            <TextInput
              style={Styles.formInput}
              placeholder='Student Id'
              iosreturnKeyType='next'
              onChangeText={(id) => this.setState({id})}
              value={this.state.id}
            />
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
              placeholder='Name'
              iosreturnKeyType='next'
              onChangeText={(name) => this.setState({name})}
              value={this.state.name}
            />
            <TextInput
              style={Styles.formInput}
              placeholder='Password'
              iosreturnKeyType='done'
              secureTextEntry={true}
              onChangeText={(password) => this.setState({password})}
              value={this.state.password}
            />
            <TouchableOpacity onPress={this.onHandlePress}>
              <View style={Styles.bigButton}>
                <Text style={Styles.bigButtonText}>
                  Create Account
                </Text>
              </View>
            </TouchableOpacity>
        </View>
      </View>
    );
  }
});