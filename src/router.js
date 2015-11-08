'use strict';

var React = require('react-native');
var Parse = require('parse/react-native');
var ParseReact = require('parse-react/react-native');
var _ = require('lodash');

var routes = require('./routes');
var SideMenu = require('./containers/sideMenu');


var {
  View,
  Navigator,
} = React;

module.exports= React.createClass({
  mixins: [ParseReact.Mixin],
  propTypes: {
    user: React.PropTypes.object,
  },
  observe: function() {
    return {
      bunches: (new Parse.Query('Bunch2User'))
        .equalTo('user', this.props.user)
        .equalTo('isMain', true)
        .include("bunch"),
    };
  },
  renderScene: function(route, navigator) {
    route.bunch = _.chain(this.data.bunches)
      .first()
      .get('bunch')
      .value();

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