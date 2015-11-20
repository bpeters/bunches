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
    userChats: [],
    messages: [],
    newChat: null,
    error: null,
    loading: false,
    success: false,
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

          this.listenToFirebase();
          this.refreshUserChats();
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
      profileMessages: [],
    };

    this.setState(this.store);
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
  listenToFirebase: function () {
    var url = config.firebase.url + '/bunch/' + this.store.bunch.id;

    new Firebase(url).on('value', (snapshot) => {
      var data = snapshot.val().chat;

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
        username: user.username,
        userImageURL: user.image ? user.image.url() : null,
        imageURL: options.image ? options.image.url() : null,
        message: options.message || 'Added Photo',
        time: new Date().getTime(),
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
              this.initStore(user);

              this.store.user = user;
              this.store.bunch = bunch;

              this.setState({
                user: this.store.user,
                bunch: this.store.bunch,
                loading: false,
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
        this.initStore(user);

        this.store.user = user;

        this.setState({
          user: this.store.user,
          loading: false,
        });
      },
      error: (user, err) => {
        this.handleParseError(err);
      }
    });
  },
  logoutUser: function () {
    Parse.User.logOut();
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
        this.store.user = user;
        this.setState({
          user: this.store.user,
          loading: false,
          success: true,
        });
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
  getProfileChats: function(id){
    this.queryChatsByUserId(id)
      .then((chats)=>{
        var chatIds = _.pluck(chats,'objectId');
        var messages = _.filter(this.store.messages,(message)=>{
          return _.indexOf(chatIds,message.chat.objectId) >= 0;
        });
        this.store.profileMessages = messages;
        console.log(messages);
        this.setState({profileMessages:this.store.profileMessages});
      })
  },
  queryUser: function (user) {
    var query = new Parse.Query('User');
    query.equalTo('id', user.id);

    return query.first();
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
  queryChatsByUserId: function (id) {
    var query = (new Parse.Query('Chat'))
      .equalTo('createdBy', id)
      .include('user')
      .include('chat')

    return query.find();
  },
}
