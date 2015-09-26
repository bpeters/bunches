var Reflux = require('reflux');
var _ = require('lodash');

var UserPastClassesActions = require('../actions/userPastClasses');

module.exports = Reflux.createStore({
  listenables: UserPastClassesActions,
  data: [
    {
      id: 1,
      name: 'Geo 101',
      tutoring: true,
    },
  ],
  init: function() {},
  getInitialState: function() {
    return this.data;
  },
  onLoad: function(res) {
    this.trigger(this.data);
  }
});
