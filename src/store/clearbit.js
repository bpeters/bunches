'use strict';

var config = require('../config/default');

module.exports = {
	authenticate: function (email) {
    return fetch(config.clearbit.url + email, {
      method: 'GET',
      headers: {
      	'Content-Type': 'application/json',
      	'Authorization' : 'Bearer ' + config.clearbit.secret
      }
    })
  },
}