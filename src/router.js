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
      getUserByHandle: this.getUserByHandle,
      updateUser: this.updateUser,
      clearSuccess: this.clearSuccess,
      getProfileChats: this.getProfileChats,
      queryUser: this.queryUser,
      getUsers: this.getUsers,
      clearMentions: this.clearMentions,
      clearNotifications: this.clearNotifications,
      addTyper: this.addTyper,
      deleteTyper: this.deleteTyper,
      switchBunches: this.switchBunches,
      resetPassword: this.resetPassword,
      squashMessages: this.squashMessages,
      getHashtagChats: this.getHashtagChats,
      removeExpiredChats: this.removeExpiredChats,
    };

    if (route.name === 'profile' && route.uid !== this.state.profileUser && !this.state.loading) {
      this.queryUser(route.uid)
        .then((user) => {
          this.getProfileChats(user);
        });
    } else if (route.name === 'hashtag' && route.hashtag !== this.state.hashtag && !this.state.loading) {
      setTimeout(() => {
        this.getHashtagChats(route.hashtag);
      }, 300);
    } else if (route.name === 'chat' && !this.store.wait && route.chatId !== this.store.chat) {
      this.store.wait = true;
      this.store.chat = route.chatId;

      setTimeout(() => {
        var notification = _.find(this.state.notifications, {id : route.chatId});

        if (notification) {
          this.clearNotifications(route.chatId);
        }

        this.clearPushNotifications(route.chatId);

        this.store.wait = false;
      }, 300);

    } else if (route.name !== 'chat') {
      this.store.chat = null;
    }

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
  configureScene: function (route) {
    if (route.name) {
      switch (route.name) {
        case 'enlarge photo':
          return Navigator.SceneConfigs.FadeAndroid;
        case 'settings':
          return Navigator.SceneConfigs.FloatFromRight;
        case 'add photo':
        case 'photo preview':
          return Navigator.SceneConfigs.VerticalUpSwipeJump;
        default:
          return Navigator.SceneConfigs.FloatFromRight;
      }
    } else {
      return Navigator.SceneConfigs.FloatFromRight;
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
        configureScene={this.configureScene}
      />
    );
  }
});