'use strict';

var React = require('react-native');

var LogIn = require('./login');
var Activity = require('./activity');
var VerifyClasses = require('./verifyClasses');

var Parse = require('parse/react-native');
var ParseReact = require('parse-react/react-native');
Parse.initialize("dsgXdFhexcMreakStwdqPqNLY0tUjMzGFKsF6g5H", "T0bfFv1Tt7av6go36WcIWmnmYDqi1ciSHZtDwC0Z");

var {
  View,
  Navigator,
} = React;

module.exports= React.createClass({
  mixins: [ParseReact.Mixin],
  getInitialState: function() {
    return {
      user: ParseReact.currentUser
    };
  },
  observe: function() {
    return {
      user: ParseReact.currentUser
    };
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

    var user = this.data.user || this.state.user;
    var route;

    if (user) {
      if (user.verifiedClasses) {
        route = {
          name: 'activity',
          component: Activity
        }
      } else {
        route = {
          name: 'verifyClasses',
          component: VerifyClasses
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