'use strict';

var React = require('react-native');
var _ = require('lodash');
var moment = require('moment');

var NewChatContainer = require('../components/newChatContainer');
var NavBarNewChat = require('../components/navBarNewChat');
var EnlargePhoto = require('./enlargePhoto');
var Bunch = require('./bunch');

var defaultStyles = require('../styles');

var {
  View,
  StyleSheet,
  Platform,
  Text,
  ListView,
  Platform,
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
  getInitialState: function(){
    return {
      title: null,
      message: null,
      photo: null,
      error: null,
    }
  },
  componentWillReceiveProps: function (nextProps) {
    var Chat = require('./chat');

    if (nextProps.store.newChatId) {
      this.props.navigator.replace({
        name: 'chat',
        component: Chat,
        hasSideMenu: true,
        chatId: nextProps.store.newChatId,
      });
    }
  },
  goBackNav: function() {
    this.props.navigator.pop();
  },
  addNewChat: function() {
    if (this.state.title) {
      this.props.actions.createChat(this.state.title, this.state.message, this.state.photo);
    } else {
      this.setState({
        error: 'Missing Title'
      });
    }
  },
  onTitleChange: function(title) {
    this.setState({title});
  },
  onMessageChange: function(message) {
    this.setState({message});
  },
  onPhotoChange: function(photo) {
    this.setState({photo});
    this.props.navigator.pop();
  },
  onAddPhoto: function() {
    this.props.navigator.push({
      name: "add photo",
      component: AddPhoto,
      hasSideMenu: false,
      bunch: this.props.route.bunch,
      onPhotoChange: this.onPhotoChange,
    });
  },
  onPressImage: function() {
    this.props.navigator.push({
      name: "enlarge photo",
      component: EnlargePhoto,
      hasSideMenu: false,
      photo: this.state.photo,
    });
  },
  render: function() {
    return (
      <View style={Styles.body}>
        <NavBarNewChat
          title="Create New Chat"
          onBackPress={this.goBackNav}
          onSubmitPress={this.addNewChat}
        />
        <NewChatContainer
          error={this.state.error}
          title={this.state.title}
          message={this.state.message}
          photo={this.state.photo}
          onTitleChange={this.onTitleChange}
          onMessageChange={this.onMessageChange}
          onAddPhoto={this.onAddPhoto}
          onPressImage={this.onPressImage}
        />
      </View>
    );
  }
});