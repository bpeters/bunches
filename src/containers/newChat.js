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
      error: null,
    }
  },
  goBackNav: function() {
    this.props.navigator.pop();
  },
  addNewChat: function() {
    var bunch = this.props.route.bunch;
    var expirationDate = moment().add(bunch.ttl, 'ms').format();

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

  },
  onTitleChange: function(title) {
    this.setState({title});
  },
  onMessageChange: function(message) {
    this.setState({message});
  },
  onAddPhoto: function() {
    console.log('add photo')
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
          onTitleChange={this.onTitleChange}
          onMessageChange={this.onMessageChange}
          onAddPhoto={this.onAddPhoto}
        />
      </View>
    );
  }
});