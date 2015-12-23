'use strict';

var React = require('react-native');
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
  registerEvent: function () {
    PushNotificationIOS.addEventListener('register', (token) => {
      this.registerDevice(token)
        .then((result) => {

          AlertIOS.alert(JSON.stringify(result.header));
        })
        .catch((error) => {
          AlertIOS.alert(JSON.stringify(error));
        });
    });
  },
  notificationEvent: function () {
    PushNotificationIOS.addEventListener('notification', (notification) => {
      AlertIOS.alert(
        'Notification Received',
        'Alert message: ' + notification.getMessage(),
        [{
          text: 'Dismiss',
          onPress: null,
        }]
      );
    });
  },
  sendNotification: function() {
    
  },
  registerDevice: function (token) {
    var body = {
      deviceType : 'ios',
      deviceToken : token,
      channels : [
        'bunches'
      ]
    };

    return fetch('https://api.parse.com/1/installations', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'X-Parse-Application-Id': "dsgXdFhexcMreakStwdqPqNLY0tUjMzGFKsF6g5H",
        'X-Parse-REST-API-Key': "PaBg7LZL6tBtGNwXewOL4iHSddo4xNCr6T3ygw1R",
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
  },
}
