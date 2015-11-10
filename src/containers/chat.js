'use strict';

var React = require('react-native');
var _ = require('lodash');
var Parse = require('parse/react-native');
var ParseReact = require('parse-react/react-native');
var Firebase = require('firebase');
var config = require('../config/default');

var NavBar = require('../components/navBar');
var NavBarChat = require('../components/navBarChat');
var ChatContainer = require('../components/chatContainer');
var NewChat = require('./newChat');
var ChatBar = require('../components/chatBar');

var defaultStyles = require('../styles');

var {
  View,
  StyleSheet,
  Platform,
  Text,
  ListView,
} = React;

var Styles = StyleSheet.create({
  body: {
    backgroundColor: defaultStyles.background,
  },
  actionButton: {
    position: 'absolute',
    bottom: 16,
    right: 16,
  }
});

module.exports = React.createClass({
  mixins: [ParseReact.Mixin],
  propTypes: {
    navigator: React.PropTypes.object,
    route: React.PropTypes.object,
    user: React.PropTypes.object,
    menuButton: React.PropTypes.object,
  },
  observe: function() {
    var chat = _.get(this, 'props.route.chat');

    return {
      chats: (new Parse.Query('Chat2User'))
        .equalTo('chat', chat)
        .include('user')
    };
  },
  getInitialState: function() {
    var chat = this.props.route.chat;
    var url = config.firebase.url + '/bunch/' + chat.belongsTo.objectId + '/chat/' + chat.objectId;

    return {
      messenger: new Firebase(url),
      messages: [],
    };
  },
  componentDidMount: function() {
    var messages = _.cloneDeep(this.state.messages);

    this.state.messenger.on('child_added', (snapshot) => {
      var data = snapshot.val();

      messages.push(data);

      this.setState({
        messages: messages
      });

    });
  },
  onBackPress: function () {
    this.props.navigator.pop();
  },
  render: function() {
    var chat = _.get(this, 'props.route.chat');
    var users = _.pluck(this.data.chats, 'user');

    var messages = _.chain(this.state.messages)
      .cloneDeep()
      .forEach((message) => {
        message.user = _.find(users, {'objectId' : message.uid});
      })
      .sortBy('time')
      .value()
      .reverse();

    return (
      <View style={Styles.body}>
        <NavBar
          title={this.props.route.chat.belongsTo.name}
          menuButton={this.props.menuButton}
        />
        <NavBarChat
          title={this.props.route.chat.name}
          onBackPress={this.onBackPress}
        />
        <ChatContainer
          user={this.props.user}
          messages={messages}
        />
        <ChatBar
          user={this.props.user}
          chat={chat}
          messenger={this.state.messenger}
          navigator={this.props.navigator}
        />
      </View>
    );
  }
});