var Bunch = require('./containers/bunch');
var NewChat = require('./containers/newChat');

module.exports = {
  bunch : {
    name: 'bunch',
    component: Bunch,
    hasSideMenu: true,
  },
   newChat : {
    name: 'new chat',
    component: NewChat,
    hasSideMenu: true,
  },
};