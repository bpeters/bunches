'use strict';

var React = require('react-native');
var _ = require('lodash');

var Store = require('./store/index');

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
  componentDidMount: function () {
    this.initStore(this.props.user);
  },
  renderScene: function(route, navigator) {
    var Component = route.component;

    var actions = {
      createMessage: this.createMessage,
      createChat: this.createChat,
      createImageMessage: this.createImageMessage,
      logoutUser: this.logoutUser,
      loginUser: this.loginUser,
      createUser: this.createUser,
      checkUsername: this.checkUsername,
      updateUser: this.updateUser,
      clearSuccess: this.clearSuccess,
      getProfileChats: this.getProfileChats,
      queryUser: this.queryUser,
      getUsers: this.getUsers,
      clearUsers: this.clearUsers,
      clearNotifications: this.clearNotifications,
      addTyper: this.addTyper,
      deleteTyper: this.deleteTyper,
      switchBunches: this.switchBunches,
      resetPassword: this.resetPassword,
    };

    if (route.hasSideMenu) {
      return (
        <SideMenu
          navigator={navigator}
          route={route}
          store={this.state}
          actions={actions}
        />
      );
    } else {
      return (
        <Component
          navigator={navigator}
          route={route}
          store={this.state}
          actions={actions}
        />
      );
    }
  },
  render: function() {
    var route;

    if (this.props.user || this.state.user) {
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