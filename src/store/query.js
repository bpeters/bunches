'use strict';

var Parse = require('parse/react-native');
var moment = require('moment');

module.exports = {
  user: function (id) {
    var query = new Parse.Query('User');

    return query.get(id);
  },
  userBunches: function (user) {
    var query = (new Parse.Query('Bunch2User'))
      .equalTo('user',  user)
      .include('bunch');

    return query.find();
  },
  chats: function (bunch) {
    var now = moment().toDate();

    var query = (new Parse.Query('Chat'))
      .equalTo('belongsTo', bunch)
      .equalTo('isDead', false)
      .greaterThan("expirationDate", now)
      .include('createdBy')
      .descending('expirationDate')

    return query.find();
  },
  chatsByUser: function (user) {
    var query = (new Parse.Query('Chat'))
      .equalTo('createdBy', user)
      .include('createdBy')

    return query.find();
  },
  userByHandle: function (handle) {
    var query = new Parse.Query('User');
    query.equalTo('handle', handle);

    return query.first();
  },
}
