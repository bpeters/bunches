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
  mixins: [ParseReact.Mixin],
  propTypes: {
    navigator: React.PropTypes.object,
    route: React.PropTypes.object,
    user: React.PropTypes.object,
    menuButton: React.PropTypes.object,
  },
  observe: function() {
    return {
      classes: (new Parse.Query('UserClass'))
        .equalTo('user', Parse.User.current())
        .descending('createdAt')
    };
  },
  render: function() {

    //lazy loading cause cyclical deps
    var LogIn = require('./login');

    return (
      <View>
        <NavBar
          title='Activity'
          menuButton={this.props.menuButton}
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