var elasticsearch = require('elasticsearch');
var Promise = require('bluebird');
var Parse = require('parse/node');
var _ = require('lodash');
var config = require('../src/config/default');

Parse.initialize(config.parse.applicationId, config.parse.key);

var es = new elasticsearch.Client({
  host: config.elasticsearch.url,
  log: 'trace'
});

var index = 'bunches';

var getUsers = function (skip, limit) {
  console.log('Getting', skip, 'to', limit, 'users');

  var user = new Parse.Query('User');
  user.skip(skip);
  user.limit(limit);

  return user.find();
};

console.log('Counting Parse users');

var query = new Parse.Query('User');

query.count()
.then((result) => {
  console.log('Found', result, 'users');

  var rounds = Math.ceil(result / 100);

  var getAllUsers = [];

  _.times(rounds, (i) => {
    var skip = (i) * 100;
    var limit = (i + 1) * 100;

    getAllUsers.push(
      getUsers(skip, limit)
    );
  });

  return Promise.all(getAllUsers);
})
.then((result) => {
  var users = _.flatten(result);
  var bulk = [];

  console.log('Bulk Indexing', users.length, 'users');

  _.forEach(users, (user) => {
    console.log(user);

    bulk.push({
      index:  { _index: index, _type: 'users', _id: user.id }
    });

    bulk.push({
      name: user.get('name'),
      handle: user.get('handle')
    });
  });

  return es.bulk({
    body: bulk
  });
})
.then(() => {
  console.log('Done!');
}, (err) => {
  console.log('ERROR', err);
});
