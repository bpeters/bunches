'use strict';

var React = require('react-native');

var routes = require('./routes');
var SideMenu = require('./containers/sideMenu');

var {
  View,
  Navigator,
  StyleSheet,
} = React;

var Styles = StyleSheet.create({
  view: {
    flex: 1,
  },
});

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
      <View style={Styles.view}>
        <Navigator
          renderScene={this.renderScene}
          initialRoute={routes.bunch}
        />
      </View>
    );
  }
});