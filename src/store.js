'use strict';

var React = require('react-native');
var Parse = require('parse/react-native');
var ParseReact = require('parse-react/react-native');
var Firebase = require('firebase');
var _ = require('lodash');
var moment = require('moment');

var config = require('./config/default');

var {
  AsyncStorage,
} = React;

module.exports = {
  store: {
    bunch: null,
    chats: [],
    messages: [],
  },
  initStore: function () {
    this.queryMainBunch(this.props.user)
      .then((result) => {
        this.store.bunch = result.get('bunch');

        return this.queryChats(this.store.bunch)
      })
      .then((result) => {
        this.store.chats = result;

        this.listenToFirebase();
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
  listenToFirebase: function () {
    var url = config.firebase.url + '/bunch/' + this.store.bunch.id;

    new Firebase(url).on('value', (snapshot) => {
      var data = snapshot.val().chat;

      console.log('Firebase', data);

      _.forEach(data, (value, key) => {

        if (_.find(this.store.chats, {'id' : key})) {
          var chat = _.find(this.store.messages, {'id' : key});

          var messages = _.get(chat, 'messages') || [];

          _.forEach(value, (v, k) => {

            if (!_.find(messages, {'key' : k})) {
              v.key = k;

              this.setItem(key, k);
              messages.push(v);
            }

          });

          if (!chat) {
            this.setItem(this.store.bunch.id, key);

            this.store.messages.push({
              id: key,
              messages: messages
            });
          }
        }

      });

      this.setState({
        messages: this.store.messages,
      });
    });
  },
  queryMainBunch: function (user) {
    var query = (new Parse.Query('Bunch2User'))
      .equalTo('user',  user)
      .equalTo('isMain', true)
      .include('bunch');

    return query.first();
  },
  queryChats: function (bunch) {
    var now = moment().toDate();

    var query = (new Parse.Query('Chat'))
      .equalTo('belongsTo', bunch)
      .equalTo('isDead', false)
      .greaterThan("expirationDate", now)
      .include('createdBy')
      .descending('expirationDate')

    return query.find();
  },
}