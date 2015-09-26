'use strict';

var React = require('react-native');

var Router = require('./router');
var Splash = require('./splash');

var Parse = require('parse/react-native');
var ParseReact = require('parse-react/react-native');
Parse.initialize("dsgXdFhexcMreakStwdqPqNLY0tUjMzGFKsF6g5H", "T0bfFv1Tt7av6go36WcIWmnmYDqi1ciSHZtDwC0Z");

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