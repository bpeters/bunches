var Reflux = require('reflux');
var _ = require('lodash');

var UserClassesActions = require('../actions/userClasses');

module.exports = Reflux.createStore({
  listenables: UserClassesActions,
  data: [
    {
      id: 1,
      name: 'Math 101',
      verified: true,
    },
    {
      id: 2,
      name: 'English 101',
      verified: true,
    },
    {
      id: 3,
      name: 'Math 102',
      verified: true,
    },
    {
      id: 4,
      name: 'English 102',
      verified: true,
    },
    {
      id: 5,
      name: 'Math 103',
      verified: true,
    },
    {
      id: 6,
      name: 'English 103',
      verified: true,
    },
    {
      id: 7,
      name: 'Math 104',
      verified: true,
    },
    {
      id: 8,
      name: 'English 104',
      verified: true,
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
