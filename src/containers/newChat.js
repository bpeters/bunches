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
var AddPhoto = require('../components/addPhoto');
var EnlargePhoto = require('../components/enlargePhoto');


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
      imageText: "(Optional) Upload Image",
    }
  },
  goBackNav: function() {
    this.props.navigator.pop();
  },
  addNewChat: function() {
    var bunch = this.props.route.bunch;
    var expirationDate = moment().add(bunch.ttl, 'ms').format();

    this.props.navigator.pop();

    if (this.state.photo){
      var image = new Parse.File('image.jpeg', { base64: this.state.photo.split(',')[1]});
      image.save().then((object) => {
        // console.log(object);
        // debugger;    
        if (this.state.title) {
          ParseReact.Mutation.Create('Chat', {
            name: this.state.title,
            expirationDate: new Date(expirationDate),
            belongsTo: bunch,
            createdBy: this.props.user,
            isDead: false,
          })
          .dispatch()
          .then((chat) => {            
            var url = config.firebase.url + '/bunch/' + bunch.objectId + '/chat/' + chat.objectId;
            new Firebase(url).push({
              uid: this.props.user.id,
              message: this.state.message,
              time: new Date().getTime(),
            });
            ParseReact.Mutation.Create('Chat2User', {
              chat: chat,
              user: this.props.user,
              imageURL: object._url.toString(),
              text: this.state.message,              
            })
            .dispatch()
            .then(() => {
              // this.props.navigator.pop();
            })
          });
        } else {
          this.setState({
            error: 'Missing Title'
          });
        }
      })
    } else {
      if (this.state.title) {
        ParseReact.Mutation.Create('Chat', {
          name: this.state.title,
          expirationDate: new Date(expirationDate),
          belongsTo: bunch,
          createdBy: this.props.user,
          isDead: false,
        })
        .dispatch()
        .then((chat) => {            
          var url = config.firebase.url + '/bunch/' + bunch.objectId + '/chat/' + chat.objectId;
          new Firebase(url).push({
            uid: this.props.user.id,
            message: this.state.message,
            time: new Date().getTime(),
          });
          ParseReact.Mutation.Create('Chat2User', {
            chat: chat,
            user: this.props.user,
            text: this.state.message,              
          })
          .dispatch()
          .then(() => {
            this.props.navigator.pop();
          })
        });
      } else {
        this.setState({
          error: 'Missing Title'
        });
      }
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
      bunch: this.props.route.bunch,
      photo: this.state.photo,
      onPress: this.goBackNav,
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