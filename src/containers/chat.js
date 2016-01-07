'use strict';

var React = require('react-native');
var _ = require('lodash');
var moment = require('moment');

var NavBar = require('../components/navBar');
var NavBarChat = require('../components/navBarChat');
var ChatContainer = require('../components/chatContainer');
var ChatBar = require('../components/chatBar');
var Timer = require('../elements/timer');
var PhotoPreview = require('./photoPreview');

var defaultStyles = require('../styles');

var {
  View,
  Platform,
  Text,
  ListView,
  StyleSheet,
} = React;

var AddPhoto;

if (Platform.OS === 'android') {
  AddPhoto = require('./addPhotoAndroid');
} else {
  AddPhoto = require('./addPhotoIOS')
}

var Styles = StyleSheet.create({
  body: {
    backgroundColor: defaultStyles.background,
    height: defaultStyles.bodyHeight,
  },
  titleWarning: {
    flex: 1,
    position: 'absolute',
    top: 100,
    height: 50,
    width: defaultStyles.bodyWidth,
    backgroundColor: defaultStyles.blue,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.8,
  },
  titleWarningText: {
    fontSize: 14,
    color: defaultStyles.white,
    fontFamily: 'Roboto-Regular',
    textAlign: 'center',
  },
  textBold: {
    fontFamily: 'Roboto-Bold',
  }
});

module.exports = React.createClass({
  propTypes: {
    navigator: React.PropTypes.object,
    route: React.PropTypes.object,
    store: React.PropTypes.object,
    actions: React.PropTypes.object,
    menuButton: React.PropTypes.object,
  },
  onCameraActionButtonPress: function (chat, orientation) {
    this.props.navigator.push({
      name: "add photo",
      component: AddPhoto,
      hasSideMenu: false,
      chat: chat,
      orientation: orientation,
    });
  },
  onPressCameraRollPhoto: function (chat, image) {
    this.props.navigator.push({
      name: "photo preview",
      component: PhotoPreview,
      hasSideMenu: false,
      photo: image,
      chat: chat,
    });
  },
  onBackPress: function () {
    this.props.navigator.pop();
  },
  countdown: function (expiration, chatId){
    var timeLeft = moment(expiration) - moment();
    setTimeout(() => {
      this.props.navigator.pop();
      this.props.actions.removeExpiredChats(chatId);
    }, timeLeft);
  },
  renderTitleWarning: function() {
    return (
      <View style={Styles.titleWarning}>
        <Text style={Styles.titleWarningText}>
          {'Looks like your chat needs a title. Send a message with a hashtag to update title. i.e. '}
          <Text style={Styles.textBold}>
            #bunches4life
          </Text>
        </Text>
      </View>
    );
  },
  renderNotification: function () {
    return (
      <Notification
        notification={this.props.store.pushNotification}
        onPressNotificationClose={this.props.actions.clearPushNotification}
        onPressNotification={this.onPressNotification}
      />
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
      id: null,
      users: [],
    };

    var userCount = _.uniq(data.messages, 'uid').length;

    var shouldUpdateTitle = (chatAttributes.name === this.props.store.user.handle);

    this.countdown(moment(chatAttributes.expirationDate).toDate(), chatId);

    return (
      <View style={Styles.body}>
        <ChatBar
          user={this.props.store.user}
          chat={chat}
          createMessage={this.props.actions.createMessage}
          onCameraPress={() => {
            this.onCameraActionButtonPress(chat,'back')}
          }
          onSelfiePress={() => {
            this.onCameraActionButtonPress(chat,'front')}
          }
          onPressCameraRollPhoto={(image) => {
            this.onPressCameraRollPhoto(chat, image)}
          }
          store={this.props.store}
          getUsers={this.props.actions.getUsers}
          clearMentions={this.props.actions.clearMentions}
          addTyper={this.props.actions.addTyper}
          deleteTyper={this.props.actions.deleteTyper}
          forChat={true}
          verified={true}
        >
          <ChatContainer
            user={this.props.store.user}
            messages={messages}
            typers={typers}
            navigator={this.props.navigator}
            squashMessages={this.props.actions.squashMessages}
            queryUser={this.props.actions.queryUser}
          >
            <NavBarChat
              title={chatAttributes.name}
              onBackPress={this.onBackPress}
              score={data.score}
              userCount={userCount}
              expiration={moment(chatAttributes.expirationDate).toDate()}
              clearSuccess={this.props.actions.clearSuccess}
              loading={this.props.store.loading}
              success={this.props.store.success}
            />
            <Timer
              expiration={moment(chatAttributes.expirationDate).toDate()}
              created={moment(chatAttributes.createdAt).toDate()}
              view='bunch'
              width={defaultStyles.bodyWidth - 10}
            />
            {shouldUpdateTitle ? this.renderTitleWarning() : null}
          </ChatContainer>
        </ChatBar>
        {this.props.store.pushNotification ? this.renderNotification() : null}
      </View>
    );
  }
});