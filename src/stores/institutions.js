var Reflux = require('reflux');
var _ = require('lodash');

var InstitutionsActions = require('../actions/institutions');

module.exports = Reflux.createStore({
  listenables: InstitutionsActions,
  data: [
    {
      id: 1,
      name: 'Private University',
      data: true,
    },
    {
      id: 2,
      name: 'University of State',
      data: false,
    }
  ],
  init: function() {},
  getInitialState: function() {
    return this.data;
  },
  onLoad: function(res) {
    this.trigger(
      this.data
    );
  }
});
