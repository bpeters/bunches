'use strict';

var React = require('react-native');
var _ = require('lodash');
var Parse = require('parse/react-native');
var Styles = require('../styles');

var SideMenu = require('react-native-side-menu');
var Menu = require('./menu');
var LogIn = require('./login');
var Activity = require('./activity');
var SetClasses = require('./setClasses');
var SetTutorClasses = require('./setTutorClasses');

var {
  View,
  Navigator,
} = React;

var SIDE_MENU_ROUTES = [
  'activity',
];

module.exports= React.createClass({
  propTypes: {
    user: React.PropTypes.object
  },
  getInitialState: function() {
    return {
      touchToClose: false,
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
  renderScene: function(route, navigator) {
    var Component = route.component;

    if (_.indexOf(SIDE_MENU_ROUTES, route.name) >= 0) {
      return (
        <SideMenu
          menu={<Menu />}
          touchToClose={this.state.touchToClose}
          onChange={this.handleChange}
        >
          <Component
            navigator={navigator}
            route={route}
            user={this.props.user}
            menuButton={{
              onPress: this.handleOpenWithTouchToClose
            }}
          />
        </SideMenu>
      );
    } else {
      return (
        <View>
          <Component navigator={navigator} route={route} user={this.props.user} />
        </View>
      );
    }

  },
  render: function() {

    var user = this.props.user;
    var route;

    if (user) {
      if (user.setClasses && user.setTutorClasses) {
        route = {
          name: 'activity',
          component: Activity,
        }
      } else if (user.setClasses) {
        route = {
          name: 'setTutorClasses',
          component: SetTutorClasses,
        }
      } else {
        route = {
          name: 'setClasses',
          component: SetClasses,
        }
      }
    } else {
      route = {
        name: 'login',
        component: LogIn
      }
    }

    return (
      <View style={Styles.app}>
        <View style={Styles.statusBar} />
        <Navigator
          renderScene={this.renderScene}
          initialRoute={route}
        />
      </View>
    );
  }
});