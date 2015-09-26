'use strict';

var React = require('react-native');
var Styles = require('../styles');

var Parse = require('parse/react-native');
var ParseReact = require('parse-react/react-native');

var NavBar = require('./navBar');
var LogIn = require('./login');

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
  render: function() {

    //lazy loading cause cyclical deps
    var LogIn = require('./login');

    return (
      <View>
        <NavBar
          title='Activity'
          rightButton={{
            text: 'Log Out',
            onPress: () => {
              Parse.User.logOut();
               this.props.navigator.push({
                  name: 'login',
                  component: LogIn
                });
            }
          }}
        />
        <View style={Styles.container}>

        </View>
      </View>
    );
  }
});