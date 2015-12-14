'use strict';

var React = require('react-native');
var Firebase = require('firebase');
var _ = require('lodash');
var moment = require('moment');
var Promise = require('bluebird');

var config = require('../config/default');

var Storage = require('./storage');

var {
  AppStateIOS,
} = React;

function calcPowerScore (chat, messages) {
  var userCount = _.chain(messages)
    .pluck('uid.objectId')
    .uniq()
    .value()
    .length;

  var messageCount = messages.length;

  var timeLeft = Math.abs(moment().diff(chat.attributes.expirationDate));
  var timeSince = moment().diff(chat.attributes.createdAt);
  var timePoints = Math.abs(timeLeft - timeSince) / (3600000 * 24);
  var activityPoints = Math.log((userCount * 0.2) + (messageCount * 0.8));

  var score = timePoints + activityPoints;

  return Math.round(100 * score);
}

function handleNotification (message, user) {

  if (user) {
    var words = _.words(message.message, /[^, ]+/g);

    var mention = _.find(words, (word) => {
      return _.includes(word, '@');
    });

    mention = mention ? mention.substring(1, mention.length) : null;

    if (user.objectId !== message.uid) {
      message.new = true;
    }

    if (mention === user.handle) {
      message.notify = true;
    }
  }

  return message;
}

module.exports = {
  listenToUserStatus: function () {

    AppStateIOS.addEventListener('change', (currentAppState) => {
      if (currentAppState === 'background'){
        this.deleteUserStatus(this.store.bunch.id, this.store.user.objectId);
      } else {
        this.addUserStatus(this.store.bunch.id, this.store.user.objectId);
      }
    });

  },
  addUserStatus: function (bunchId, userId) {
    var url = config.firebase.url + '/bunch/' + bunchId + '/status/';
    var ref = new Firebase(url);

    ref.push(userId);
  },
  deleteUserStatus: function(bunchId, userId) {
    if (this.store.user) {
      var url = config.firebase.url + '/bunch/' + bunchId + '/status/';
      var ref = new Firebase(url);

      ref.once('value', (snapshot) => {

        _.forEach(snapshot.val(), (value, key) => {
          if (value === userId) {
            new Firebase(url + '/' + key)
              .remove();
          }
        });

      });
    }
  },
  listenToTyper: function () {

    var url = config.firebase.url + '/typers/bunch/' + this.store.bunch.id;

    new Firebase(url).on('value', (snapshot) => {
      var data = snapshot.val();

      var typers = [];

      if (data) {
        _.forEach(data.chat, (value, key) => {
          if (_.find(this.store.chats, {'id' : key})) {

            var users = [];

            _.forEach(value, (v, k) => {
              users.push(v);
            });

            if (!_.isEmpty(users)) {
              typers.push({
                id: key,
                users: users,
              });
            }
          }
        });
      }

      this.store.typers = typers;

      this.setState({
        typers: this.store.typers
      });

    });

  },
  addTyper: function (chatId) {
    var url = config.firebase.url + '/typers/bunch/' + this.store.bunch.id + '/chat/' + chatId;
    var ref = new Firebase(url);

    ref.push({
      'uid' : this.store.user.objectId,
      'handle' : this.store.user.handle
    });
  },
  deleteTyper: function (chatId) {
    if (this.store.user) {
      var url = config.firebase.url + '/typers/bunch/' + this.store.bunch.id + '/chat/' + chatId;
      var getTypers = new Firebase(url);
      var uid = this.store.user.objectId;

      getTypers.once('value', (snapshot) => {

        _.forEach(snapshot.val(), (value, key) => {
          if (value.uid === uid) {
            new Firebase(url + '/' + key)
              .remove();
          }
        });

      });
    }
  },
  listenToChats: function () {
    var url = config.firebase.url + '/bunch/' + this.store.bunch.id;

    new Firebase(url).on('value', this.prepareMessages);
  },
  stopListeningToChats: function () {
    var url = config.firebase.url + '/bunch/' + this.store.bunch.id;

    new Firebase(url).off('value', this.prepareMessages);
  },
  prepareMessages: function (snapshot) {

    if (snapshot.val()) {

      var data = snapshot.val().chat;

      var status = snapshot.val().status;

      this.refreshChats()
        .then(() => {

          var promiseChats = [];

          _.forEach(data, (value, key) => {

            if (_.find(this.store.chats, {'id' : key})) {
              promiseChats.push(this.handleChats(value, key));
            }

          });

          Promise.each(promiseChats, (promise) => {
            return promise;
          })
          .then(() => {
            this.store.messages = _.chain(this.store.messages)
              .map((message) => {

                var newCount = 0;
                var mention;

                _.forEach(message.messages, (m) => {
                  var set;
                  _.forEach(status, (i, j) => {
                    if (m.uid === i) {
                      m.online = true;
                      set = true;
                    } else if (!set) {
                      m.online = false;
                    }
                  });

                  if (m.notify) {
                    mention = true;
                  }

                  if (m.new) {
                    newCount ++;
                  }
                });

                message.newCount = newCount;
                message.mention = mention;

                return message;
              })
              .sortBy((message) => {
                return message.score;
              })
              .value()
              .reverse();

            this.setState({
              messages: this.store.messages,
              chats: this.store.chats,
              bunch: this.store.bunch,
              user: this.store.user,
              loading: false,
            });
          });

        });
    } else {
      this.setState({
        messages: this.store.messages,
        chats: this.store.chats,
        bunch: this.store.bunch,
        user: this.store.user,
        loading: false,
      });
    }
  },
  handleChats: function (value, key) {
    var chat = _.find(this.store.messages, {'id' : key});

    var messages = _.get(chat, 'messages') || [];

    var promiseMessages = [];

    _.forEach(value, (v, k) => {

      if (!_.find(messages, {'key' : k})) {
        v.key = k;

        promiseMessages.push(
          Storage.getItem(k).then((stored) => {

            if (!stored) {
              v = handleNotification(v, this.store.user);
            }

            messages.push(v);

            return;
          })
        );

      }

    });

    return Promise.each(promiseMessages, (promise) => {
      return promise;
    })
    .then(() => {

      if (!chat) {

        var chat = _.find(this.store.chats, {'id' : key});

        var score = calcPowerScore(chat, messages);

        this.store.messages.push({
          id: key,
          chat: chat,
          score: score,
          messages: messages,
        });

      } else {
        chat.score = calcPowerScore(chat.chat, messages);
      }

      return;
    });
  },
}
