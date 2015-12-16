'use strict';

var React = require('react-native');
var _ = require('lodash');

var {
  AsyncStorage,
} = React;

module.exports = {
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
  clean: function (messages) {

    return new Promise((resolve, reject) => {
      return AsyncStorage.getAllKeys()
        .then((storage) => {
          var keys = storage;

          var messageKeys = _.chain(messages)
            .pluck('messages')
            .flatten()
            .pluck('key')
            .value();

          var removeKeys = _.filter(keys, (key) => {
            return !_.find(messageKeys, (mk) => {
              return key === mk;
            });
          });

          return AsyncStorage.multiRemove(removeKeys);
        })
        .then(() => {
          resolve();
        });
    });

  },
}
