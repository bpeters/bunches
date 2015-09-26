'use strict';

var React = require('react-native');

var LogIn = require('./login');
var Activity = require('./activity');
var SetClasses = require('./setClasses');

var {
  View,
  Navigator,
} = React;

module.exports= React.createClass({
  propTypes: {
    user: React.PropTypes.object
  },
  renderScene: function(route, navigator) {
    var Component = route.component;

    return (
      <View>
        <Component navigator={navigator} route={route} />
      </View>
    );
  },
  render: function() {

    var user = this.props.user;
    var route;

    if (user) {
      if (user.verifiedClasses) {
        route = {
          name: 'activity',
          component: Activity
        }
      } else {
        route = {
          name: 'setClasses',
          component: SetClasses
        }
      }
    } else {
      route = {
        name: 'login',
        component: LogIn
      }
    }

    return (
      <Navigator
        renderScene={this.renderScene}
        initialRoute={route}
      />
    );
  }
});