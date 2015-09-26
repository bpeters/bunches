'use strict';

var React = require('react-native');

var LogIn = require('./login');
var Activity = require('./activity');

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

    var route;

    if (this.data.user || this.state.user) {
      route = {
        name: 'activity',
        component: Activity
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