'use strict';

var React = require('react-native');
var Parse = require('parse/react-native');
var ParseReact = require('parse-react/react-native');

var NavBar = require('./components/navBar');

var {
  View,
} = React;

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
      bunch: (new Parse.Query('Bunch2User'))
        .equalTo('user', this.props.user)
        .equalTo('isMain', true)
    };
  },
  render: function() {
    var bunch = this.props.route.bunch || this.data.bunch;

    return (
      <View>
        <NavBar
          title={bunch.name}
          menuButton={this.props.menuButton}
        />
      </View>
    );
  }
});