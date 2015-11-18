'use strict';

var React = require('react-native');
var Parse = require('parse/react-native');
var ParseReact = require('parse-react/react-native');
var config = require('./config/default');

var Router = require('./router');
var Splash = require('./elements/splash');

Parse.initialize(config.parse.applicationId, config.parse.key);

module.exports= React.createClass({
  mixins: [ParseReact.Mixin],
  observe: function() {
    return {
      user: ParseReact.currentUser
    };
  },
  render: function() {
    if (this.data.user !== undefined) {
      return (
        <Router user={this.data.user} />
      );
    } else {
      return (
        <Splash />
      );
    }
  }
});