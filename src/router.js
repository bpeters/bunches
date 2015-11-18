'use strict';

var React = require('react-native');
var _ = require('lodash');

var Store = require('./store');

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
    this.initStore();
  },
  renderScene: function(route, navigator) {
    var Component = route.component;

    var actions = {
      createMessage: this.createMessage,
      createChat: this.createChat,
      clearNewChat: this.clearNewChat,
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
    if (!_.isEmpty(this.state.bunch)) {
      return (
        <Navigator
          renderScene={this.renderScene}
          initialRoute={{
            name: 'bunch',
            component: Bunch,
            hasSideMenu: true,
          }}
        />
      );
    } else {
      return (
        <Splash />
      );
    }

  }
});