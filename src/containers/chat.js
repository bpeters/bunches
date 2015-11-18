'use strict';

var React = require('react-native');
var _ = require('lodash');

var NavBar = require('../components/navBar');
var NavBarChat = require('../components/navBarChat');
var ChatContainer = require('../components/chatContainer');
var ChatBar = require('../components/chatBar');

var defaultStyles = require('../styles');

var {
  View,
  Platform,
  Text,
  ListView,
  StyleSheet,
} = React;

var Styles = StyleSheet.create({
  body: {
    backgroundColor: defaultStyles.background,
  },
});

module.exports = React.createClass({
  propTypes: {
    navigator: React.PropTypes.object,
    route: React.PropTypes.object,
    user: React.PropTypes.object,
    store: React.PropTypes.object,
    actions: React.PropTypes.object,
    menuButton: React.PropTypes.object,
  },
  onBackPress: function () {
    this.props.navigator.pop();
  },
  render: function() {

    var chatId = this.props.route.chatId || _.get(this.props.store.newChat, 'objectId');

    var chat = _.chain(this.props.store.messages)
      .find({'id' : chatId})
      .result('chat')
      .value();

    var chatAttributes = _.get(chat, 'attributes') || this.props.route.newChat;

    var messages = _.chain(this.props.store.messages)
      .find({'id' : chatId})
      .result('messages')
      .cloneDeep()
      .sortBy('time')
      .value()
      .reverse();

    var userCount = _.chain(messages)
      .pluck('uid')
      .uniq()
      .value()
      .length;

    var title = this.props.store.bunch.attributes.name;

    return (
      <View style={Styles.body}>
        <ChatBar
          user={this.props.user}
          chat={chat}
          createMessage={this.props.actions.createMessage}
          height={0}
        >
          <ChatContainer
            user={this.props.user}
            messages={messages}
            navigator={this.props.navigator}
          >
            <NavBar
              title={title}
              menuButton={this.props.menuButton}
              userCount={userCount}
              msgCount={messages.length}
            />
            <NavBarChat
              title={chatAttributes.name}
              onBackPress={this.onBackPress}
              expiration={chatAttributes.expirationDate}
              created={chatAttributes.createdAt}
            />
          </ChatContainer>
        </ChatBar>
      </View>
    );
  }
});