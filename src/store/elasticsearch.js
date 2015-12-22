'use strict';

var config = require('../config/default');

module.exports = {
  indexUser: function (id, body) {
    return fetch(config.elasticsearch.url + '/bunches/users/'+ id, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  },
  updateUser: function (id, changes) {
    return fetch(config.elasticsearch.url + '/bunches/users/' + id + '/_update', {
      method: 'POST',
      body: JSON.stringify({
        doc : changes
      }),
    });
  },
  users: function (query) {

    var body;

    if (query) {
      body = {
        query : {
          bool : {
            should : [
              {
                fuzzy : {
                  handle : {
                    value : query,
                    fuzziness : 2
                  }
                }
              },
              {
                fuzzy : {
                  name : {
                    value : query,
                    fuzziness : 2
                  }
                }
              },
              {
                prefix : {
                  handle :  {
                    prefix : query,
                    boost : 3.0
                  }
                }
              }
            ],
            minimum_should_match : 1,
            boost : 1.0
          }
        }
      };
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
