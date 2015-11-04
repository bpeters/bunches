'use strict';

var React = require('react-native');
var Parse = require('parse/react-native');
var ParseReact = require('parse-react/react-native');
Parse.initialize("dsgXdFhexcMreakStwdqPqNLY0tUjMzGFKsF6g5H", "T0bfFv1Tt7av6go36WcIWmnmYDqi1ciSHZtDwC0Z");

var Router = require('./router');
var Splash = require('./elements/splash');

module.exports= React.createClass({
  mixins: [ParseReact.Mixin],
  observe: function() {
    return {
      user: ParseReact.currentUser
    };
  },
  intializeBunch: function(user) {
    var query = new Parse.Query('Bunch');
    query.equalTo('name', 'Global');
    query.first({
      success: (bunch) => {
        ParseReact.Mutation.Create('Bunch2User', {
          bunch: bunch,
          user: user,
          isMain: true,
        });
      },
      error: (error) => {
        console.log(error);
      }
    });
  },
  generateAnonUser: function() {
    var user = new Parse.User();
    var random = Math.floor(Math.random() * 10000000000) + 1;

    user.set('username', random);
    user.set('password', random);
    user.set('email', random + '@bunches.io');
    user.set('name', 'User ' + random);

    user.signUp(null, {
      success: (user) => {
        this.intializeBunch(user);
      },
      error: (user, error) => {
        console.log(error);
      }
    });
  },
  render: function() {
    if (this.data.user) {
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