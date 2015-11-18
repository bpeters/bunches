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
    userChats: [],
    messages: [],
    newChat: null,
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
        this.refreshUserChats();
      }, (err) => {
        this.handleParseError(err);
    });
  },
  refreshChats: function () {
    return this.queryChats(this.store.bunch)
      .then((result) => {
        this.store.chats = result;

        return;
      }, (err) => {
        this.handleParseError(err);
    });
  },
  refreshUserChats: function () {
    return this.queryUserChats()
      .then((result) => {
        this.store.userChats = result;
        this.setState({
          userChats: this.store.userChats
        });
        return;
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

      this.refreshChats()
        .then(() => {

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
                  chat: _.find(this.store.chats, {'id' : key}),
                  messages: messages,
                });
              }
            }

          });

          this.store.messages = _.chain(this.store.messages)
            .sortBy((message) => {
              return message.chat.attributes.expirationDate;
            })
            .value()
            .reverse();

          this.setState({
            messages: this.store.messages,
            chats: this.store.chats,
            bunch: this.store.bunch,
          });

        });
    });
  },
  createChat: function (title, message, photo) {
    var bunch = this.store.bunch;
    var expirationDate = moment().add(bunch.attributes.ttl, 'ms').format();

    ParseReact.Mutation.Create('Chat', {
      name: title,
      expirationDate: new Date(expirationDate),
      belongsTo: bunch,
      createdBy: this.props.user,
      isDead: false,
    })
    .dispatch()
    .then((chat) => {

      this.store.newChat = chat;

      this.setState({
        newChat: {
          attributes: chat,
          message: message,
          photo: photo,
        }
      });

      if (photo) {
        var photo64 = new Parse.File('image.jpeg', { base64: photo.split(',')[1]});
        photo64.save().then((image) => {
          this.createMessage(chat, {
            image: image,
            message: message,
          });
        });
      } else {
        this.createMessage(chat, {
          message: message
        });
      }

    });
  },
  createMessage: function (chat, options) {
    var bunch = this.store.bunch;
    var url = config.firebase.url + '/bunch/' + bunch.id + '/chat/' + (chat.objectId || chat.id);
    var messenger = new Firebase(url);
    var user = this.props.user.attributes;

    ParseReact.Mutation.Create('Chat2User', {
      chat: chat,
      user: this.props.user,
      image: options.image,
      text: options.message,
    })
    .dispatch()
    .then((chat) => {

      this.refreshUserChats();

      messenger.push({
        uid: this.props.user.id,
        name: user.name,
        username: user.username,
        userImageURL: user.image ? user.image.url() : null,
        imageURL: options.image ? options.image.url() : null,
        message: options.message,
        time: new Date().getTime(),
      });

    });
  },
  clearNewChat: function () {
    this.store.newChat = null;

    this.setState({
      newChat: this.store.newChat
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
  queryUserChats: function (chat) {
    var query = (new Parse.Query('Chat2User'))
      .equalTo('user', this.props.user)
      .include('user')
      .include('chat')

    return query.find();
  },
}
