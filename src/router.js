'use strict';

var React = require('react-native');
var _ = require('lodash');

var Store = require('./store');

var Landing = require('./containers/landing');
var Bunch = require('./containers/bunch');
var Chat = require('./containers/chat');
var SideMenu = require('./containers/sideMenu');
var Splash = require('./elements/splash');

var {
  View,
  Navigator,
} = React;

module.exports= React.createClass({
  mixins: [Store],
  propTypes: {
    user: React.PropTypes.object,
  },
  getInitialState: function () {
    return this.store;
  },
  renderScene: function(route, navigator) {
    var Component = route.component;

    var actions = {
      createMessage: this.createMessage,
      createChat: this.createChat,
      clearNewChat: this.clearNewChat,
      logoutUser: this.logoutUser,
    };

    if (route.hasSideMenu) {
      return (
        <SideMenu
          navigator={navigator}
          route={route}
          user={this.props.user}
          store={this.state}
          actions={actions}
        />
      );
    } else {
      return (
        <Component
          navigator={navigator}
          route={route}
          user={this.props.user}
          store={this.state}
          actions={actions}
        />
      );
    }
  },
  render: function() {
    var route;

    if (this.props.user) {
      route = {
        name: 'bunch',
        component: Bunch,
        hasSideMenu: true,
      };
    } else {
      route = {
        name: 'landing',
        component: Landing,
      };
    }

    return (
      <Navigator
        renderScene={this.renderScene}
        initialRoute={route}
      />
    );
  }
});