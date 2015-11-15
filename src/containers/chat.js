'use strict';

var React = require('react-native');
var _ = require('lodash');

var NavBar = require('../components/navBar');
var NavBarChat = require('../components/navBarChat');
var ChatContainer = require('../components/chatContainer');
var NewChat = require('./newChat');
var ChatBar = require('../components/chatBar');

var defaultStyles = require('../styles');

var {
  View,
  Platform,
  Text,
  ListView,
  ScrollView,
  StyleSheet,
} = React;

var Styles = StyleSheet.create({
  body: {
    backgroundColor: defaultStyles.background,
  },
  scroll: {
    flex: 1,
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
  componentDidMount: function () {
    this.props.actions.clearNewChat();
  },
  onBackPress: function () {
    this.props.navigator.pop();
  },
  render: function() {

    var chatId = this.props.route.chatId;

    var chat = _.chain(this.props.store.messages)
      .find({'id' : chatId})
      .result('chat')
      .value();

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
        <NavBar
          title={title}
          menuButton={this.props.menuButton}
          userCount={userCount}
          msgCount={messages.length}
        />
        <NavBarChat
          title={chat.attributes.name}
          onBackPress={this.onBackPress}
          expiration={chat.attributes.expirationDate}
          created={chat.createdAt}
        />
        <ScrollView
          ref='scrollView'
          keyboardDismissMode='on-drag'
          style={Styles.scroll}
          contentContainerStyle={Styles.contentContainerStyle}
          scrollEnabled={false}
        >
          <ChatContainer
            user={this.props.user}
            messages={messages}
            navigator={this.props.navigator}
          />
          <ChatBar
            scrollView={this.refs.scrollView}
            user={this.props.user}
            chat={chat}
            navigator={this.props.navigator}
            bunch={this.props.store.bunch}
            createMessage={this.props.actions.createMessage}
          />
        </ScrollView>
      </View>
    );
  }
});