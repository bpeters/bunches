'use strict';

var React = require('react-native');
var Parse = require('parse/react-native');
var ParseReact = require('parse-react/react-native');
var Firebase = require('firebase');
var _ = require('lodash');
var moment = require('moment');

var config = require('../config/default');
var nouns = require('../assets/nouns');

var Query = require('./query');
var ES = require('./elasticsearch');
var Listen = require('./listen');
var Storage = require('./storage');

var {
  AlertIOS,
  Platform,
} = React;

var storeDefaults = {
  user: null,
  bunch: null,
  bunches: [],
  chats: [],
  messages: [],
  newChat: null,
  loading: false,
  success: false,
  profileUser: null,
  profileMessages: [],
  typers: [],
  mentions: [],
};

module.exports = {
  mixins: [Listen],
  store: _.cloneDeep(storeDefaults),
  initStore: function (user) {
    if (user) {

      this.store.user = user;

      this.setState({
        loading: true,
      });

      Query.userBunches(user)
        .then((results) => {

          _.forEach(results, (userBunch) => {
            if (userBunch.get('isMain')) {
              this.store.bunch = userBunch.get('bunch');
            }

            this.store.bunches.push(userBunch.get('bunch'));
          });

          return Query.chats(this.store.bunch)
        })
        .then((chats) => {
          this.store.chats = chats;
          return this.authenticateFirebase();
        })
        .then(() => {

          this.listenToChats();
          this.listenToUserStatus();
          this.listenToTyper();
          this.addUserStatus(this.store.bunch.id, this.store.user.objectId);

        }, (err) => {
          this.handleParseError(err);
      });
    }
  },
  tearDownStore: function () {
    this.store = _.cloneDeep(storeDefaults);
    this.setState(this.store);
  },
  switchBunches: function (bunch) {
    this.stopListeningToChats();
    this.store.bunch = bunch;
    this.store.chats = [];
    this.store.messages = [];

    Query.chats(this.store.bunch)
      .then((chats) => {
        this.store.chats = chats;

        this.listenToChats();
      }, (err) => {
        this.handleParseError(err);
      });
  },
  refreshChats: function () {
    return Query.chats(this.store.bunch)
      .then((result) => {
        this.store.chats = result;

        return;
      }, (err) => {
        this.handleParseError(err);
    });
  },
  handleParseError: function (err, title) {
    switch (err.code) {
      case Parse.Error.INVALID_SESSION_TOKEN:
        Parse.User.logOut();
        break;
      default:
        console.log(err);

        if (Platform.OS === 'ios') {
          AlertIOS.alert(
            title || 'Error',
            err.message,
            [{text: 'Try Again'}]
          );
        }

        this.setState({
          loading: false,
        });
    }
  },
  uploadImage: function (photo) {
    var photo64 = new Parse.File('image.jpeg', { base64: photo});

    return photo64.save().then((image) => {
      return image;
    });
  },
  createChat: function (message, photo) {
    this.setState({
      loading: true,
    });

    var bunch = this.store.bunch;
    var expirationDate = moment().add(bunch.attributes.ttl, 'ms').format();

    ParseReact.Mutation.Create('Chat', {
      name: this.store.user.handle + "'s " + _.sample(nouns),
      expirationDate: new Date(expirationDate),
      belongsTo: bunch,
      createdBy: this.store.user,
      isDead: false,
    })
    .dispatch()
    .then((chat) => {

      this.store.newChat = chat;

      this.setState({
        newChat: this.store.newChat
      });

      if (photo) {
        this.uploadImage(photo)
          .then((image) => {
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
  createImageMessage: function (chat, photo) {
    this.setState({
      loading: true,
    });

    this.uploadImage(photo)
      .then((image) => {
        this.createMessage(chat, {
          image: image,
        });
      });
  },
  createMessage: function (chat, options) {
    var bunch = this.store.bunch;
    var url = config.firebase.url + '/bunch/' + bunch.id + '/chat/' + (chat.objectId || chat.id);
    var messenger = new Firebase(url);
    var user = this.store.user;

    ParseReact.Mutation.Create('Chat2User', {
      chat: chat,
      user: user,
      image: options.image,
      text: options.message,
    })
    .dispatch()
    .then((chat) => {

      messenger.push({
        uid: user.objectId || user.id,
        name: user.name,
        handle: user.handle,
        username: user.username,
        userImageURL: user.image ? user.image.url() : null,
        imageURL: options.image ? options.image.url() : null,
        message: options.message,
        time: new Date().getTime(),
      });

      this.setState({
        loading: false,
        success: true,
      });

    });
  },
  createUser: function (params) {
    this.setState({
      loading: true,
    });

    var user = new Parse.User();

    user.set('username', params.email ? params.email.toLowerCase() : '');
    user.set('password', params.password);
    user.set('email', params.email ? params.email.toLowerCase() : '');
    user.set('handle', params.username ? params.username.toLowerCase() : '');
    user.set('name', params.name);

    user.signUp(null, {
      success: (user) => {
        var query = new Parse.Query('Bunch');
        query.containedIn('name', ['Global', 'Feedback']);

        query.find({
          success: (bunches) => {

            var batch = new ParseReact.Mutation.Batch();

            _.forEach(bunches, (bunch) => {

              var isMain;

              if (bunch.get('name') === 'Global') {
                isMain = true;
              }

              ParseReact.Mutation.Create('Bunch2User', {
                bunch: bunch,
                user: user,
                isMain: isMain,
              })
              .dispatch({ batch: batch });

            });

            batch.dispatch()
            .then(() => {
              var newUser = _.assign(user, user.attributes);
              newUser.objectId = user.id;

              this.initStore(newUser);

              ES.indexUser(user.id, {
                name: params.name,
                handle: params.username,
              })
              .then(() => {
                this.setState({
                  loading: false,
                });
              });
            });
          },
          error: (user, error) => {
            this.handleParseError(error, 'Failed to Create Account');
          }
        });
      },
      error: (user, error) => {
        this.handleParseError(error, 'Failed to Create Account');
      }
    });
  },
  loginUser: function (email, password) {

    this.setState({
      loading: true,
    });

    Parse.User.logIn(email ? email.toLowerCase() : '', password, {
      success: (user) => {
        var newUser = _.assign(user, user.attributes);

        newUser.objectId = user.id;

        this.initStore(newUser);
      },
      error: (user, err) => {
        this.handleParseError(err, 'Failed to sign in');
      }
    });
  },
  logoutUser: function () {
    Storage.clean(this.store.messages)
      .then(() => {
        Parse.User.logOut();
        this.deleteUserStatus();
        this.tearDownStore();
      });
  },
  resetPassword: function (email) {
    Parse.User.requestPasswordReset(email ? email.toLowerCase() : '', {
      success: () => {
        if (Platform.OS === 'ios') {
          AlertIOS.alert('Reset password link sent');
        }
      },
      error: (err) => {
        this.handleParseError(err, 'Failed to reset password');
      }
    });
  },
  checkUsername: function (username) {
    return Query.username(username);
  },
  updateUser: function (field, value) {
    this.setState({
      loading: true,
    });

    var setUser = (changes) => {
      ParseReact.Mutation.Set(this.store.user, changes)
      .dispatch()
      .then((user) => {

        if (field === 'handle' || field === 'name') {
          if (field === 'handle') {
            value = value.toLowerCase();
          }

          var esObject = {}
          esObject[field] = value;

          ES.updateUser(user.objectId, esObject)
          .then(() => {
            this.store.user = user;
            this.setState({
              user: this.store.user,
              loading: false,
              success: true,
            });
          });
        } else {
          this.store.user = user;
          this.setState({
            user: this.store.user,
            loading: false,
            success: true,
          });
        }

      }, (err) => {
        this.handleParseError(err, 'Failed to Update Account');
      });
    };

    var changes = {};

    if (field === 'image') {

      this.uploadImage(value)
        .then((image) => {
          changes[field] = image;

          setUser(changes);
        });

    } else {
      changes[field] = value;
      setUser(changes);
    }
  },
  clearSuccess: function () {
    this.store.success = false;

    this.setState({
      success: this.store.success
    });
  },
  getProfileChats: function (user) {
    Query.chatsByUser(user)
      .then((chats) => {

        var chatIds = _.pluck(chats,'id');

        var messages = _.filter(this.store.messages,(message) => {
          return _.indexOf(chatIds, message.chat.id) >= 0;
        });

        this.store.profileMessages = messages;
        this.setState({
          profileMessages: this.store.profileMessages
        });
      });
  },
  getUsers: function (query) {
    ES.users(query)
      .then((result) => {

        var hits = _.pluck(JSON.parse(result._bodyText).hits.hits, '_source');

        this.store.mentions = hits;
        this.setState({
          mentions: this.store.mentions
        });
      });
  },
  clearUsers: function () {
    this.store.mentions = [];
    this.setState({
      mentions: this.store.mentions
    });
  },
  clearNotifications: function (chatId) {

    _.forEach(this.store.messages, (message) => {
      if (message.id === chatId) {

        message.mention = false;
        message.newCount = 0;

        _.forEach(message.messages, (m) => {
          m.new = false;
          message.notify = false;
          Storage.setItem(m.key, m.key).done();
        });
      }
    });

    this.setState({
      messages: this.store.messages
    });
  },
  queryUser: function (id) {
    return Query.user(id);
  },
  squashMessages: function (data) {

    var messages = _.cloneDeep(data).reverse()
    var userId = null;
    var key = -1;
    var squash = [];

    _.forEach(messages, (message, i) => {
      if (userId === message.uid) {
        squash[key].squash.push(message);
      } else {
        key++;
        userId = message.uid;
        squash.push(message);
        squash[key]['squash'] = [];
      }
    });

    return squash.reverse();
  },
}
