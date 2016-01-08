'use strict';

var React = require('react-native');
var Parse = require('parse/react-native');
var _ = require('lodash');
var moment = require('moment');
var Promise = require('bluebird');

var config = require('../config/default');

var {
  AlertIOS,
  PushNotificationIOS,
} = React;

module.exports = {
  requestPermissions: function () {
    PushNotificationIOS.requestPermissions();
  },
  registerEvent: function (userId, setInstallationId) {
    PushNotificationIOS.addEventListener('register', (token) => {
      this.registerDevice(token, userId)
        .then((result) => {
          setInstallationId(JSON.parse(result._bodyText).objectId);
        })
        .catch((error) => {
          console.log(error);
        });
    });
  },
  notificationEvent: function (handlePushNotifications) {
    PushNotificationIOS.addEventListener('notification', (notification) => {

      if (notification.getData().chatId) {
        handlePushNotifications(notification.getData().chatId);
      }

      if (notification.getBadgeCount()) {
        PushNotificationIOS.setApplicationIconBadgeNumber(notification.getBadgeCount());
      }
    });
  },
  setBadge: function (installationId, badgeCount) {

    var body = {
      badge: badgeCount
    };

    fetch('https://api.parse.com/1/installations/' + installationId, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'X-Parse-Application-Id': config.parse.applicationId,
        'X-Parse-REST-API-Key': config.parse.rest,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
    .then((result) => {
      PushNotificationIOS.setApplicationIconBadgeNumber(badgeCount);
    });
  },
  mention: function (sender, userId, message, chat) {
    var body = {
      where: {
        userId: userId
      },
      data: {
        alert: '@' + sender.handle + ' mentioned you in a chat',
        badge: 'Increment',
        message: message,
        chatId: chat.objectId,
      }
    };

    this.sendNotification(body)
      .then((result) => {
        console.log(result);
      })
      .catch((error) => {
        console.log(error);
      });
  },
  sendNotification: function(body) {

    return fetch('https://api.parse.com/1/push', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'X-Parse-Application-Id': config.parse.applicationId,
        'X-Parse-REST-API-Key': config.parse.rest,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
  },
  updateChannels: function(url, channels) {
    var body = {
      channels: channels
    };

    return fetch(url, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'X-Parse-Application-Id': config.parse.applicationId,
        'X-Parse-REST-API-Key': config.parse.rest,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
  },
  registerDevice: function (token, userId) {
    var body = {
      deviceType : 'ios',
      deviceToken : token,
      channels : [
        'bunches'
      ],
      userId: userId
    };

    return fetch('https://api.parse.com/1/installations', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'X-Parse-Application-Id': config.parse.applicationId,
        'X-Parse-REST-API-Key': config.parse.rest,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
  },
}
