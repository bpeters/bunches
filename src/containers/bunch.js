'use strict';

var React = require('react-native');
var Parse = require('parse/react-native');
var ParseReact = require('parse-react/react-native');
var _ = require('lodash');

var NavBar = require('../components/navBar');
var ChatBar = require('../components/chatBar');

var defaultStyles = require('../styles');

var {
  View,
  TextInput,
  Text,
  StyleSheet,
} = React;

var Styles = StyleSheet.create({
  body: {
    backgroundColor: defaultStyles.background,
  },
});

module.exports = React.createClass({
  mixins: [ParseReact.Mixin],
  propTypes: {
    navigator: React.PropTypes.object,
    route: React.PropTypes.object,
    user: React.PropTypes.object,
    menuButton: React.PropTypes.object,
  },
  observe: function() {
    return {
      bunches: (new Parse.Query('Bunch2User'))
        .equalTo('user', this.props.user)
        .equalTo('isMain', true)
        .include("bunch"),
    };
  },
  render: function() {

    var bunch = _.chain(this.data.bunches)
      .first()
      .get('bunch')
      .value();

    return (
      <View style={Styles.body}>
        <NavBar
          title={bunch ? bunch.name : ''}
          menuButton={this.props.menuButton}
        />
        <ChatBar
          user={this.props.user}
        />
      </View>
    );
  }
});