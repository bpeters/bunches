'use strict';

var React = require('react-native');
var Parse = require('parse/react-native');
var Styles = require('../styles');

var LogIn = require('./login');
var Activity = require('./activity');
var SetClasses = require('./setClasses');
var SetTutorClasses = require('./setTutorClasses');

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
        <Component navigator={navigator} route={route} user={this.props.user} />
      </View>
    );
  },
  render: function() {

    var user = this.props.user;
    var route;

    if (user) {
      if (user.setClasses && user.setTutorClasses) {
        route = {
          name: 'activity',
          component: Activity,
        }
      } else if (user.setClasses) {
        route = {
          name: 'setTutorClasses',
          component: SetTutorClasses,
        }
      } else {
        route = {
          name: 'setClasses',
          component: SetClasses,
        }
      }
    } else {
      route = {
        name: 'login',
        component: LogIn
      }
    }

    return (
      <View style={Styles.app}>
        <View style={Styles.statusBar} />
        <Navigator
          renderScene={this.renderScene}
          initialRoute={route}
        />
      </View>
    );
  }
});