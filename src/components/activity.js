'use strict';

var React = require('react-native');
var Styles = require('../styles');

var Parse = require('parse/react-native');
var ParseReact = require('parse-react/react-native');

var NavBar = require('./navBar');
var LogIn = require('./login');
var SideMenu = require('react-native-side-menu');
var Menu = require('./menu');

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
  },
  getInitialState: function() {
    return {
      touchToClose: false,
    };
  },
  observe: function() {
    return {
      classes: (new Parse.Query('UserClass'))
        .equalTo('user', Parse.User.current())
        .descending('createdAt')
    };
  },
  handleOpenWithTouchToClose: function () {
    this.setState({
      touchToClose: true,
    });
  },
  handleChange: function (isOpen) {
    if (!isOpen) {
      this.setState({
        touchToClose: false,
      });
    }
  },
  render: function() {

    //lazy loading cause cyclical deps
    var LogIn = require('./login');

    return (
      <SideMenu
        menu={<Menu />}
        touchToClose={this.state.touchToClose}
        onChange={this.handleChange}
      >
        <View>
          <NavBar
            title='Activity'
            menuButton={{
              onPress : this.handleOpenWithTouchToClose
            }}
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
      </SideMenu>
    );
  }
});