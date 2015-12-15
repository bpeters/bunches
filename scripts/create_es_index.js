var elasticsearch = require('elasticsearch');
var config = require('../src/config/default');

var es = new elasticsearch.Client({
  host: config.elasticsearch.url,
  log: 'trace'
});

var index = 'bunches';

var mappings = {
  users : {
    properties : {
      name : {
        type : 'string'
      },
      handle : {
        type : 'string'
      }
    }
  }
};

var settings = {};

console.log('Checking for index');

es.indices.exists({
  index : index
})
.then((exists) => {
  if (exists) {
    console.log('Index alread exists');
    return;
  } else {
    console.log('Creating new index');
    return es.indices.create({
      index: index,
      body: {
        settings: settings,
        mappings: mappings
      }
    })
  }
})
.then(() => {
  console.log('Done!');
})
.catch((err) => {
  console.log('ERROR', err);
});
