'use strict';

var React = require('react-native');
var Parse = require('parse/react-native');
var ParseReact = require('parse-react/react-native');

var Router = require('./router');
var Splash = require('./elements/splash');
var config = require('./config');

Parse.initialize(config.parse.applicationId, config.parse.key);

module.exports= React.createClass({
  getInitialState: function () {
    return {
      user: null
    }
  },
  componentDidMount: function () {
    if (!this.state.user) {
      this.generateAnonUser();
    }
  },
  handleParseError: function (err) {
    switch (err.code) {
      case Parse.Error.INVALID_SESSION_TOKEN:
        Parse.User.logOut();
        break;
      default:
        console.log(err);
    }
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
        })
        .dispatch()
        .then(() => {
          this.setState({
            user: user
          });
        });
      },
      error: (error) => {
        this.handleParseError(error);
      }
    });
  },
  generateAnonUser: function() {
    var user = new Parse.User();
    var random = (Math.floor(Math.random() * 10000000000) + 1).toString();

    user.set('username', random);
    user.set('password', random);
    user.set('email', random + '@bunches.io');
    user.set('name', 'User ' + random);

    user.signUp(null, {
      success: (user) => {
        this.intializeBunch(user);
      },
      error: (user, error) => {
        this.handleParseError(error);
      }
    });
  },
  render: function() {
    if (this.state.user) {
      return (
        <Router user={this.state.user} />
      );
    } else {
      return (
        <Splash />
      );
    }
  }
});