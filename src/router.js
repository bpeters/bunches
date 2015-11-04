'use strict';

var React = require('react-native');

var routes = require('./routes');
var SideMenu = require('./containers/sideMenu');

var {
  View,
  Navigator,
} = React;

module.exports= React.createClass({
  propTypes: {
    user: React.PropTypes.object,
  },
  renderScene: function(route, navigator) {
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
    return (
      <Navigator
        renderScene={this.renderScene}
        initialRoute={routes.bunch}
      />
    );
  }
});