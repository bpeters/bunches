var Reflux = require('reflux');
var _ = require('lodash');

var UserClassesActions = require('../actions/userClasses');

function formatClasses (classes) {
  var current = _.filter(classes, (classItem) => {
    return classItem.enrolled;
  });

  var past = _.filter(classes, (classItem) => {
    return !classItem.enrolled;
  });

  return {
    current: current,
    past: past,
  };
}

module.exports = Reflux.createStore({
  listenables: UserClassesActions,
  data: [
    {
      id: 1,
      name: 'Math 101',
      verified: true,
      enrolled: true,
    },
    {
      id: 2,
      name: 'English 101',
      verified: true,
      enrolled: true,
    },
    {
      id: 3,
      name: 'Math 102',
      verified: true,
      enrolled: true,
    },
    {
      id: 4,
      name: 'English 102',
      verified: true,
      enrolled: true,
    },
    {
      id: 5,
      name: 'Math 103',
      verified: true,
      enrolled: true,
    },
    {
      id: 6,
      name: 'English 103',
      verified: true,
      enrolled: true,
    },
    {
      id: 7,
      name: 'Math 104',
      verified: true,
      enrolled: true,
    },
    {
      id: 8,
      name: 'English 104',
      verified: true,
      enrolled: true,
    },
    {
      id: 9,
      name: 'Geo 101',
      verified: true,
      enrolled: false,
    },
  ],
  init: function() {},
  getInitialState: function() {
    return formatClasses(this.data);
  },
  onLoad: function(res) {
    this.trigger(
      formatClasses(this.data)
    );
  }
});
