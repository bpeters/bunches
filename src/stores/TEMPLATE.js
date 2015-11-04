var Reflux = require('reflux');
var _ = require('lodash');

var Actions = require('../actions');

module.exports = Reflux.createStore({
  listenables: Actions, // Listen to Actions
  data: {}, // Data Structure
  init: function() {}, //  Runs on store mount
  getInitialState: function() { // Used to return initial data on container's connect to store
    return this.data;
  },
  onLoad: function(res) { // Function mapped to action. Always needs `on` before the action
    this.data = res;
    this.trigger(this.data); // Emits store data to containers connected
  }
});
