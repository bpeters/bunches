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

module.exports= React.createClass({
  propTypes: {
    user: React.PropTypes.object,
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

    if (route.hasSideMenu) {
      return (
        <SideMenu
          menu={<Menu navigator={navigator} user={this.props.user} />}
          touchToClose={this.state.touchToClose}
          onChange={this.handleChange}
        >
          <View style={Styles.shadow}>
            <Component
              navigator={navigator}
              route={route}
              user={this.props.user}
              menuButton={{
                onPress: this.handleOpenWithTouchToClose
              }}
            />
          </View>
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
          hasSideMenu: true,
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
        <Navigator
          renderScene={this.renderScene}
          initialRoute={route}
        />
      </View>
    );
  }
});