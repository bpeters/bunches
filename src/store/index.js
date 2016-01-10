'use strict';

var React = require('react-native');
var Parse = require('parse/react-native');
var ParseReact = require('parse-react/react-native');
var Firebase = require('firebase');
var _ = require('lodash');
var moment = require('moment');
var Promise = require('bluebird');

var config = require('../config/default');
var nouns = require('../assets/nouns');

var Query = require('./query');
var ES = require('./elasticsearch');
var Listen = require('./listen');
var Storage = require('./storage');
var Clearbit = require('./clearbit');
var Notification = require('./notification');

var {
  Alert,
  Platform,
} = React;

var storeDefaults = {
  user: null,
  bunch: null,
  bunches: [],
  chats: [],
  chat: null,
  messages: [],
  newChat: null,
  loading: false,
  success: false,
  profileUser: null,
  profileMessages: [],
  hashtag: null,
  hashtagMessages: [],
  typers: [],
  mentions: [],
  notifications: [],
  wait: false,
  notificationId: null,
  pushNotifications: [],
};

module.exports = {
  mixins: [Listen],
  store: _.cloneDeep(storeDefaults),
  initStore: function (user, newUser) {
    if (user) {

      user.emailVerified = Parse.User.current().get('emailVerified');

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

          Notification.requestPermissions();
          
          Notification.registerEvent(this.store.user.objectId, this.setInstallationId);
          Notification.notificationEvent(this.handlePushNotifications);

          if (newUser) {
            this.createWelcomeChat(this.store.user, this.store.bunch);
          }

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
  removeExpiredChats: function(chatId) {
    var messages = this.store.messages;

    this.store.messages = _.filter(messages, (message) => {
      return message.id !== chatId;
    });

    this.setState({
      messages: this.store.messages,
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

        Alert.alert(
          title || 'Error',
          err.message,
          [{text: 'Try Again'}]
        );

        this.setState({
          loading: false,
        });
    }
  },
  uploadImage: function (photo) {
    if(_.startsWith(photo,'data:image/jpeg;base64,')) {
      photo = photo.replace('data:image/jpeg;base64,','');
    }
    var photo64 = new Parse.File('image.jpeg', { base64: photo});

    return photo64.save().then((image) => {
      return image;
    });
  },
  checkForHashtags: function (message) {

    return new Promise((resolve, reject) => {

      if (message) {
        var words = message.split(' ');
        var hashExpression = /(#[a-z\d]+)/gi;
        var hashRegex = new RegExp(hashExpression);

        if (message.match(hashRegex)) {
          _.forEach(words, (word, i) => {
            if (_.startsWith(word, '#')) {
              return resolve(word);
            }
          });
        }
      }

      return resolve();
    });

  },
  updateChatTitle: function (chat, title) {
    var Chat = Parse.Object.extend("Chat");
    var newChat = new Chat();
    newChat.id = chat.id;

    newChat.set("name", title);

    newChat.save(null, {
      success: (chat) => {},
      error: (chat, error) => {
        this.handleParseError(error, 'Failed to Update Chat Name');
      }
    });
  },











  createChat: function (message, image, video) {
    this.setState({
      loading: true,
    });

    this.checkForHashtags(message)
      .then((hashtag) => {

        var title = hashtag ? (this.store.user.handle + ' ' + hashtag) : this.store.user.handle;

        var bunch = this.store.bunch;
        var expirationDate = moment().add(bunch.attributes.ttl, 'ms').format();

        return ParseReact.Mutation.Create('Chat', {
          name: title,
          expirationDate: new Date(expirationDate),
          belongsTo: bunch,
          createdBy: this.store.user,
          isDead: false,
        })
        .dispatch();
      })
      .then((chat) => {

        this.store.newChat = chat;

        this.setState({
          newChat: this.store.newChat
        });

        this.createMessage(chat, {
          message: message,
          image: image,
          video: video,
        });
      }, (error) => {
        this.handleParseError(error, 'Failed to Create Chat');
      });
  },
  createMessage: function (chat, options) {
    var bunch = this.store.bunch;
    var url = config.firebase.url + '/bunch/' + bunch.id + '/chat/' + (chat.objectId || chat.id);
    var messenger = new Firebase(url);
    var user = this.store.user;

    var message, newChat, newPath;

    ParseReact.Mutation.Create('Chat2User', {
      chat: chat,
      user: user,
      text: options.message,
    })
    .dispatch()
    .then((chat2user) => {

      newChat = chat2user;
      newPath = url + '/' + chat2user.objectId;

      message = {
        uid: user.objectId || user.id,
        name: user.name,
        handle: user.handle,
        username: user.username,
        userImageURL: user.image ? user.image.url() : null,
        time: new Date().getTime(),
      };

      var promiseMentions = [];

      if (options.message) {
        var mentions = _.chain(options.message)
          .words(/[^, ]+/g)
          .filter((word) => {
            return _.startsWith(word, '@');
          })
          .value();

        _.forEach(mentions, (mention) => {

            var handle = _.trimLeft(mention, '@');

            promiseMentions.push(
              this.getUserByHandle(handle)
                .then((user) => {
                  if (user) {
                    Notification.mention(this.store.user, user.id, options.message, chat);
                    return mention + '/?/?/?/' + user.id + '/?/?/?/';
                  } else {
                    return;
                  }
                })
            );
        });
      }

      return Promise.each(promiseMentions, (promise) => {
        return promise;
      })
    })
    .then((mentions) => {

      if (options.message) {
        var words = options.message.split(' ');
        var formatted = _.map(words, (word) => {
          _.forEach(mentions, (mention) => {

            if (mention) {
              var split = mention.split('/?/?/?/');
              var old = split[0];

              if (old === word) {
                word = mention;
              }
            }

          });

          return word;
        });

        message.message = formatted.join(' ');
      }

      var messenger = new Firebase(newPath);
      messenger.set(message);

      if (options.image || options.video) {
        this.updateMessage(newChat, messenger, options.image, options.video)
      }
      

      var name = chat.name || chat.attributes.name;

      if (name === this.store.user.handle) {
        return this.checkForHashtags(options.message);
      } else {
        return;
      }
    })
    .then((hashtag) => {
      if (hashtag) {
        this.updateChatTitle(chat, this.store.user.handle + ' ' + hashtag);
      }
    }, (error) => {
      this.handleParseError(error, 'Failed to Create Message');
    });
  },
  updateMessage: function (chat, messenger, image, video) {

    if(image) {
      this.uploadImage(image)
        .then((img) => {
          messenger.update({imageURL: img.url()});
          return ParseReact.Mutation.Set(chat,{
              image: img,
            })
            .dispatch();
        }, (error) => {
          this.handleParseError(error, 'Failed to Save Image');
        })
    } else {
      video.then((obj) => {
          messenger.update({videoURL: obj.url});
          return Query.videoById(obj.id);
        }).then((vid) => {
            return ParseReact.Mutation.Set(chat,{
              video: vid,
            })
            .dispatch();
        }, (error) => {
          this.handleParseError(error, 'Failed to Save Video');
        })
    }
  },
  checkEducationEmail: function (email) {
    var urlExpression = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.+-]+\.edu?/gi;
    var urlRegex = new RegExp(urlExpression);

    if (email.match(urlRegex)) {
      return Clearbit.authenticate(email)
        .then((response) => response.text())
        .then((data) => {
          var data = JSON.parse(data);
          if (data.error) {
            console.log(data.error);
          } else {
            var institution = data.company.name;
            var institutionUrl = data.company.domain;
            return this.updateInstitution(institution, institutionUrl);
          }
        })
        .then((institutionName) => {
          return institutionName;
        })
        .catch((error) => {
          this.handleParseError(error, 'Failed to Create Account');
        });
    } else {
      return Promise.resolve();
    }
  },
  updateInstitution: function (name, domain) {
    var query = (new Parse.Query('Institution'))
      .equalTo('domain',  domain);

    return query.find()
      .then((institution) => {
        if (!institution.length){
          return ParseReact.Mutation.Create('Bunch', {
            name: name,
            ttl: 86400000
          })
          .dispatch()
        } else {
          return;
        }
      })
      .then((object) => {
        if (object) {
          return ParseReact.Mutation.Create('Institution', {
            name: name,
            domain: domain,
            bunchId: object.id
          })
          .dispatch();
        } else {
          return;
        }
      })
      .then((obj) => {
        return name;
      }, (error) => {
        this.handleParseError(error, 'Failed to Create Account');
      });
  },
  createWelcomeChat: function (user, bunch) {
    var newChat;
    var brennen;
    var hunter;
    var expirationDate = moment().add(bunch.attributes.ttl, 'ms').format();

    return ParseReact.Mutation.Create('Chat', {
      name: user.handle + ' #welcome',
      expirationDate: new Date(expirationDate),
      belongsTo: bunch,
      createdBy: user,
      isDead: false,
    })
    .dispatch()
    .then((chat) => {
      newChat = chat;

      return this.createMessage(chat, {
        message: '#welcome'
      });
    })
    .then(() => {
      return Promise.all([this.getUserByHandle('b'), this.getUserByHandle('h')]);
    })
    .then((users) => {

      brennen = _.assign(users[0], users[0].attributes);
      brennen.objectId = users[0].id;

      hunter = _.assign(users[1], users[1].attributes);
      hunter.objectId = users[1].id;

      return this.createMessage(newChat, {
        message: 'Hey! @' + user.handle + ' thank you for signing up for Bunches. If you have any questions feel free to reach out to @b and @h',
        user: brennen,
      })
    })
    .then(() => {
      return this.createMessage(newChat, {
        message: 'Welcome to Bunches. And remember... Zeppelin rules. The end.',
        user: hunter,
      });
    });
  },
  createUser: function (params) {
    this.setState({
      loading: true,
    });

    var newUser;
    var newBunch;

    var bunches = ['Global', 'Feedback'];

    this.checkEducationEmail(params.email.toLowerCase())
      .then((name) => {

        if(name){
          bunches.push(name);
        }
        var user = new Parse.User();

        user.set('username', params.email ? params.email.toLowerCase() : '');
        user.set('password', params.password);
        user.set('email', params.email ? params.email.toLowerCase() : '');
        user.set('handle', params.username ? params.username.toLowerCase() : '');
        user.set('name', params.name);

        user.signUp(null, {
          success: (user) => {
            var query = new Parse.Query('Bunch');
            query.containedIn('name', bunches);

            query.find({
              success: (results) => {

                var batch = new ParseReact.Mutation.Batch();

                _.forEach(results, (bunch) => {

                  var isMain;

                  if (bunch.get('name') === 'Global') {
                    isMain = true;
                    newBunch = bunch;
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
                  newUser = _.assign(user, user.attributes);
                  newUser.objectId = user.id;

                  this.initStore(newUser, true);

                  ES.indexUser(user.id, {
                    name: params.name,
                    handle: params.username,
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
      })
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
        this.deleteUserStatus(this.store.bunch.id, this.store.user.objectId);
        this.tearDownStore();
      });
  },
  resetPassword: function (email) {
    Parse.User.requestPasswordReset(email ? email.toLowerCase() : '', {
      success: () => {
        Alert.alert('Reset password link sent');
      },
      error: (err) => {
        this.handleParseError(err, 'Failed to reset password');
      }
    });
  },
  getUserByHandle: function (username) {
    return Query.userByHandle(username);
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
    this.setState({
      loading: true,
    });

    var messages = _.filter(this.store.messages, (message) => {

      var userMessages = _.filter(message.messages, (m) => {
        return m.uid === user.id;
      });

      return userMessages.length > 0;
    });

    this.store.profileMessages = messages;
    this.store.profileUser = user.id;
    this.setState({
      profileMessages: this.store.profileMessages,
      profileUser: this.store.profileUser,
      loading: false,
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
  clearMentions: function () {
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

    this.store.notifications = _.filter(this.store.notifications, (chat) => {
      return chat.id !== chatId;
    });

    this.setState({
      messages: this.store.messages,
      notifications: this.store.notifications,
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
  getHashtagChats: function (hashtag) {
    this.setState({
      loading: true,
    });

    var messages = _.filter(this.store.messages, (message) => {

      var words = _.chain(message.messages)
        .map((m) => {
          if (m.message) {
            return m.message.split(' ');
          }
        })
        .flatten()
        .filter((word) => {
          return word === hashtag;
        })
        .value();

      return words.length > 0;
    });

    this.store.hashtagMessages = messages;
    this.store.hashtag = hashtag;
    this.setState({
      hashtagMessages: this.store.hashtagMessages,
      hashtag: this.store.hashtag,
      loading: false,
    });
  },
  setInstallationId: function (installationId) {
    this.store.notificationId = installationId;
  },
  handlePushNotifications: function (chatId) {
    this.store.pushNotifications.push(chatId);

    this.setState({
      pushNotifications: this.store.pushNotifications
    });
  },
  clearPushNotifications: function (chatId) {
    this.store.pushNotifications = _.filter(this.store.pushNotifications, chatId);

    this.setState({
      pushNotifications: this.store.pushNotifications
    });

    Notification.setBadge(this.store.notificationId, this.store.pushNotifications.length);
  },
}
