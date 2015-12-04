'use strict';

var React = require('react-native');
var Parse = require('parse/react-native');
var ParseReact = require('parse-react/react-native');
var Firebase = require('firebase');
var _ = require('lodash');
var moment = require('moment');

var config = require('./config/default');

var nouns = require('./assets/nouns');

var {
  AsyncStorage,
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

module.exports = {
  store: {
    user: null,
    bunch: null,
    chats: [],
    users: [],
    userChats: [],
    messages: [],
    newChat: null,
    error: null,
    loading: false,
    success: false,
    profileUser: null,
    profileMessages: [],
  },
  initStore: function (user) {
    if (user) {

      this.setState({
        loading: true,
      });

      this.store.user = user;

      this.queryMainBunch(user)
        .then((result) => {
          this.store.bunch = result.get('bunch');

          return this.queryChats(this.store.bunch)
        })
        .then((result) => {
          this.store.chats = result;

          this.listenToChats();
          this.refreshUserChats();
          this.listenToUserStatus();

          this.addUserStatus();
        }, (err) => {
          this.handleParseError(err);
      });
    }
  },
  tearDownStore: function () {
    this.store = {
      user: null,
      bunch: null,
      chats: [],
      userChats: [],
      messages: [],
      newChat: null,
      error: null,
      loading: false,
      success: false,
      profileUser: null,
      profileMessages: [],
    };

    this.setState(this.store);
  },
  listenToUserStatus: function () {

    AppStateIOS.addEventListener('change', (currentAppState) => {
        console.log(currentAppState);
      if (currentAppState === 'background'){
        this.deleteUserStatus();
      } else {
        this.addUserStatus();
      }
    });

  },
  deleteUserStatus: function() {
    if (this.store.user) {
      var url = config.firebase.url + '/bunch/' + this.store.bunch.id + '/status/';
      var getStatus = new Firebase(url);
      var uid = this.store.user.objectId;
      var bunchId = this.store.bunch.id;

      getStatus.once('value', (snapshot) => {

        _.forEach(snapshot.val(), (value, key) => {
          if (value === uid) {
            new Firebase(config.firebase.url + '/bunch/' + bunchId + '/status/' + key)
              .remove();
          }
        });

      });
    }
  },
  addUserStatus: function () {
    var url = config.firebase.url + '/bunch/' + this.store.bunch.id + '/status/';
    var ref = new Firebase(url);

    ref.push(this.store.user.objectId || this.store.user.id);
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

        var chatIds = _.pluck(this.store.chats, 'id');

        var userChats = _.filter(result, (chat) => {
          return _.indexOf(chatIds, chat.get('chat').id) >= 0;
        });

        this.store.userChats = userChats;
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

        this.setState({
          error: err,
          loading: false,
        });
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
  listenToChats: function () {
    var url = config.firebase.url + '/bunch/' + this.store.bunch.id;

    new Firebase(url).on('value', (snapshot) => {
      var data = snapshot.val().chat;

      var status = snapshot.val().status;

      this.refreshChats()
        .then(() => {

          _.forEach(data, (value, key) => {

            if (_.find(this.store.chats, {'id' : key})) {
              var chat = _.find(this.store.messages, {'id' : key});

              var messages = _.get(chat, 'messages') || [];

              _.forEach(value, (v, k) => {

                if (!_.find(messages, {'key' : k})) {
                  v.key = k;

                  //this.setItem(key, k);
                  messages.push(v);
                }

              });

              if (!chat) {
                //this.setItem(this.store.bunch.id, key);

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
            }

          });

          this.store.messages = _.chain(this.store.messages)
            .map((message) => {

              _.forEach(message.messages, (m) => {
                _.forEach(status, (i, j) => {
                  if (m.uid === i) {
                    m.online = true;
                  }
                });
              });

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

      this.refreshUserChats();

      messenger.push({
        uid: user.objectId || user.id,
        name: user.name,
        handle: user.handle,
        username: user.username,
        userImageURL: user.image ? user.image.url() : null,
        imageURL: options.image ? options.image.url() : null,
        message: options.message || 'Added Photo',
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
      error: null,
      loading: true,
    });

    var user = new Parse.User();

    user.set('username', params.email);
    user.set('password', params.password);
    user.set('email', params.email);
    user.set('handle', params.username);
    user.set('name', params.name);

    user.signUp(null, {
      success: (user) => {
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
              user.objectId = user.id;
              this.initStore(user);

              this.store.user = user;
              this.store.bunch = bunch;

              this.esIndexUser(user.id, {
                name: params.name,
                handle: params.username,
              })
              .then(() => {
                this.setState({
                  user: this.store.user,
                  bunch: this.store.bunch,
                  loading: false,
                });
              });
            });
          },
          error: (user, error) => {
            this.handleParseError(error);
          }
        });
      },
      error: (user, error) => {
        this.handleParseError(error);
      }
    });
  },
  loginUser: function (email, password) {

    this.setState({
      error: null,
      loading: true,
    });

    Parse.User.logIn(email, password, {
      success: (user) => {
        var newUser = _.assign(user, user.attributes);

        this.initStore(newUser);
      },
      error: (user, err) => {
        this.handleParseError(err);
      }
    });
  },
  logoutUser: function () {
    Parse.User.logOut();
    this.deleteUserStatus();
    this.tearDownStore();
  },
  checkUsername: function (username) {
    var query = new Parse.Query('User');
    query.equalTo('handle', username);

    return query.first();
  },
  clearErrors: function () {
    this.store.error = null;

    this.setState({
      error: this.store.error
    });
  },
  updateUser: function (field, value) {
    this.setState({
      error: null,
      loading: true,
    });

    var setUser = (changes) => {
      ParseReact.Mutation.Set(this.state.user, changes)
      .dispatch()
      .then((user) => {

        if (field === 'handle') {
          this.esUpdateUser(user.objectId, {
            'handle': value
          })
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
        this.handleParseError(err);
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
    this.queryChatsByUser(user)
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
    this.esSearchUsers(query)
      .then((result) => {

        var hits = _.pluck(JSON.parse(result._bodyText).hits.hits, '_source');

        this.store.users = hits;
        this.setState({
          users: this.store.users
        });
      });
  },
  clearUsers: function () {
    this.store.users = [];
    this.setState({
      users: this.store.users
    });
  },
  queryUser: function (id) {
    var query = new Parse.Query('User');

    return query.get(id);
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
      .equalTo('user', this.store.user)
      .include('user')
      .include('chat')

    return query.find();
  },
  queryChatsByUser: function (user) {
    var query = (new Parse.Query('Chat'))
      .equalTo('createdBy', user)
      .include('createdBy')

    return query.find();
  },
  esIndexUser: function (id, body) {
    return fetch(config.elasticsearch.url + '/bunches/users/'+ id, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  },
  esUpdateUser: function (id, changes) {
    return fetch(config.elasticsearch.url + '/bunches/users/' + id + '/_update', {
      method: 'POST',
      body: JSON.stringify({
        doc : changes
      }),
    });
  },
  esSearchUsers: function (query) {

    var body;

    if (query) {
      body = {
        query : {
          multi_match : {
            query : query,
            fields: ['name', 'handle'],
            fuzziness: 'AUTO',
          }
        }
      }
    } else {
      body = {
        query : {
          match_all : {}
        }
      };
    }

    return fetch(config.elasticsearch.url + '/bunches/users/_search', {
      method: 'POST',
      body: JSON.stringify(body),
    });
  },
}
