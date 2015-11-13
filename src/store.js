'use strict';

var React = require('react-native');
var Parse = require('parse/react-native');
var ParseReact = require('parse-react/react-native');
var Firebase = require('firebase');
var _ = require('lodash');

var config = require('./config/default');

var {
  AsyncStorage,
} = React;

module.exports = {
  store: {
    bunch: null,
    chats: [],
  },
  initStore: function () {
    var query = new Parse.Query('Bunch2User');
    query.equalTo('user',  this.props.user);
    query.equalTo('isMain', true);
    query.include('bunch');

    query.first().then((result) => {
      var bunch = result.get('bunch');
      var url = config.firebase.url + '/bunch/' + bunch.id;
      this.store.bunch = bunch;

      new Firebase(url).on('child_added', (snapshot) => {
        var data = snapshot.val();
        console.log('Firechild Added', data);

        _.forEach(data, (value, key) => {
          this.setItem(bunch.id, key);

          var messages = [];

          _.forEach(value, (v, k) => {
            this.setItem(key, k);
            messages.push(v);
          });

          this.store.chats.push({
            id: key,
            messages: messages
          })
        });

        this.setState({
          bunch: this.store.bunch,
          chats: this.store.chats,
        });
      });

    }, (err) => {
      this.handleParseError(err);
    });
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
  getItem: function (key) {
    return AsyncStorage.getItem(key)
      .then((value) => {
        return value
      })
      .catch((err) => {
        console.log(err);
      });
  },
  setItem: function (key, value) {
    return AsyncStorage.setItem(key, value)
      .then((result) => {
        return;
      })
      .catch((err) => {
        console.log(err);
      });
  },
  removeItem: function (key) {
    return AsyncStorage.removeItem(key)
      .then((result) => {
        return;
      })
      .catch((err) => {
        console.log(err);
      });
  },
}