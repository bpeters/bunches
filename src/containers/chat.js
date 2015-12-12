'use strict';

var React = require('react-native');
var _ = require('lodash');
var moment = require('moment');

var NavBar = require('../components/navBar');
var NavBarChat = require('../components/navBarChat');
var ChatContainer = require('../components/chatContainer');
var ChatBar = require('../components/chatBar');
var Success = require('../elements/success');
var Timer = require('../elements/timer');

var defaultStyles = require('../styles');

var {
  View,
  Platform,
  Text,
  ListView,
  StyleSheet,
} = React;

var AddPhoto;
var Loading;

if (Platform.OS === 'android') {
  AddPhoto = require('./addPhotoAndroid');
  Loading = require('../elements/loadingAndroid');
} else {
  AddPhoto = require('./addPhotoIOS')
  Loading = require('../elements/loadingIOS');
}

var Styles = StyleSheet.create({
  body: {
    backgroundColor: defaultStyles.background,
    height: defaultStyles.bodyHeight,
  },
  loadingView: {
    position: 'absolute',
    backgroundColor: 'transparent',
    top: defaultStyles.navBarHeight + defaultStyles.navBarHeight - 28,
    right: (defaultStyles.bodyWidth / 2) - 28,
  },
  successView: {
    position: 'absolute',
    backgroundColor: 'transparent',
    top: defaultStyles.navBarHeight + defaultStyles.navBarHeight - 28,
    left: (defaultStyles.bodyWidth / 2) - 28
  },
});

module.exports = React.createClass({
  propTypes: {
    navigator: React.PropTypes.object,
    route: React.PropTypes.object,
    store: React.PropTypes.object,
    actions: React.PropTypes.object,
    menuButton: React.PropTypes.object,
  },
  onCameraActionButtonPress: function (chat) {
    this.props.navigator.push({
      name: "add photo",
      component: AddPhoto,
      hasSideMenu: false,
      chat: chat,
    });
  },
  onBackPress: function () {
    this.props.navigator.pop();
  },
  renderLoading: function () {
    return (
      <View style={Styles.loadingView}>
        <Loading />
      </View>
    );
  },
  renderSuccess: function () {
    setTimeout(() => {
      this.props.actions.clearSuccess();
    }, 3000);

    return (
      <View style={Styles.successView}>
        <Success />
      </View>
    );
  },
  render: function() {

    var chatId = this.props.route.chatId || _.get(this.props.store.newChat, 'objectId');

    var data = _.find(this.props.store.messages, {'id' : chatId}) || {
      chat: null,
      messages: [],
      score: null,
    };

    var chat = data.chat;

    var chatAttributes = _.get(chat, 'attributes') || this.props.route.newChat;

    var messages = _.chain(data.messages)
      .cloneDeep()
      .sortBy('time')
      .value()
      .reverse();

    var typers = _.find(this.props.store.typers, {'id' : chatId}) || {
      chatId: null,
      users: [],
    };

    var title = this.props.store.bunch.attributes.name;

    return (
      <View style={Styles.body}>
        <ChatBar
          user={this.props.store.user}
          chat={chat}
          createMessage={this.props.actions.createMessage}
          onPress={() => {
            this.onCameraActionButtonPress(chat)}
          }
          store={this.props.store}
          getUsers={this.props.actions.getUsers}
          clearUsers={this.props.actions.clearUsers}
          addTyper={this.props.actions.addTyper}
          deleteTyper={this.props.actions.deleteTyper}
          forChat={true}
        >
          <ChatContainer
            user={this.props.store.user}
            messages={messages}
            typers={typers}
            navigator={this.props.navigator}
            getProfileChats={this.props.actions.getProfileChats}
            queryUser={this.props.actions.queryUser}
          >
            <NavBar
              title={title}
              menuButton={this.props.menuButton}
              score={data.score}
            />
            <NavBarChat
              title={chatAttributes.name}
              onBackPress={this.onBackPress}
            />
            <Timer
              expiration={moment(chatAttributes.expirationDate).toDate()}
              created={moment(chatAttributes.createdAt).toDate()}
              view='bunch'
              width={defaultStyles.bodyWidth - 10}
            />
          </ChatContainer>
        </ChatBar>
        {this.props.store.loading ? this.renderLoading() : null}
        {this.props.store.success ? this.renderSuccess() : null}
      </View>
    );
  }
});