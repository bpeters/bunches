'use strict';

var React = require('react-native');
var _ = require('lodash');
var moment = require('moment');
var Parse = require('parse/react-native');
var ParseReact = require('parse-react/react-native');
var Firebase = require('firebase');
var config = require('../config/default');

var NewChatContainer = require('../components/newChatContainer');
var NavBarNewChat = require('../components/navBarNewChat');
var AddPhoto = require('./addPhoto');
var EnlargePhoto = require('./enlargePhoto');
var Bunch = require('./bunch');

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
});

module.exports = React.createClass({
  propTypes: {
    navigator: React.PropTypes.object,
    route: React.PropTypes.object,
    user: React.PropTypes.object,
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
  goBackNav: function() {
    this.props.navigator.pop();
  },
  saveChatDetails: function (chat, image) {
    var bunch = this.props.route.bunch;
    var url = config.firebase.url + '/bunch/' + bunch.objectId + '/chat/' + chat.objectId;

    var user = this.props.user.attributes;

    if (image || this.state.message) {
      new Firebase(url).push({
        uid: this.props.user.id,
        name: user.name,
        username: user.username,
        userImageURL: user.image ? user.image.url() : null,
        imageURL: image ? image.url() : null,
        message: this.state.message,
        time: new Date().getTime(),
      });

      ParseReact.Mutation.Create('Chat2User', {
        chat: chat,
        user: this.props.user,
        image: image,
        text: this.state.message,
      })
      .dispatch();
    }
  },
  addNewChat: function() {
    var Chat = require('./chat'); //stupid cyclical deps, need to require here.

    if (this.state.title) {
      var bunch = this.props.route.bunch;
      var expirationDate = moment().add(bunch.ttl, 'ms').format();

      ParseReact.Mutation.Create('Chat', {
        name: this.state.title,
        expirationDate: new Date(expirationDate),
        belongsTo: bunch,
        createdBy: this.props.user,
        isDead: false,
      })
      .dispatch()
      .then((chat) => {

        if (this.state.photo) {
          var photo = new Parse.File('image.jpeg', { base64: this.state.photo.split(',')[1]});
          photo.save().then((image) => {
            this.saveChatDetails(chat, image);
          });
        } else {
          this.saveChatDetails(chat);
        }

        this.props.navigator.replace({
          name: "chat",
          component: Chat,
          hasSideMenu: true,
          chat: chat,
        });
      });
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