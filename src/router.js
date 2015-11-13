'use strict';

var React = require('react-native');
var _ = require('lodash');

var Store = require('./store');

var Bunch = require('./containers/bunch');
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
    route.bunch = this.state.bunch;
    route.chats = this.state.chats;

    var Component = route.component;

    if (route.hasSideMenu) {
      return (
        <SideMenu
          navigator={navigator}
          route={route}
          user={this.props.user}
        />
      );
    } else {
      return (
        <Component
          navigator={navigator}
          route={route}
          user={this.props.user}
        />
      );
    }
  },
  render: function() {

    console.log('Bunch State', this.state.bunch);
    console.log('Chats State', this.state.chats);
    console.log('Messages State', this.state.messages);

    if (!_.isEmpty(this.state.bunch)) {
      return (
        <Navigator
          renderScene={this.renderScene}
          initialRoute={{
            name: "bunch",
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