'use strict';

var React = require('react-native');
var _ = require('lodash');
var Firebase = require('firebase');

var NavBarNoMenu = require('../components/navBarNoMenu');
var ChatBar = require('../components/chatBar');
var AddChatContainer = require('../components/addChatContainer');


var ChatButton = require('../elements/chatButton');

var defaultStyles = require('../styles');
var config = require('../config');

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
      messages: [],
      url: null,
      firstChat: null,
      title: null,      
    }
  },

  addNewPhoto: function() {
    console.log('hello');
  },



  intializeBunch: function(user) {
    var query = new Parse.Query('Bunch');
    query.equalTo('name', 'Global');
    query.first({
      success: (bunch) => {
        ParseReact.Mutation.Create('Bunch2User', {
          bunch: bunch,
          user: user,
          isMain: true,
        })
        .dispatch()
        .then(() => {
          this.setState({
            user: user
          });
        });
      },
      error: (error) => {
        this.handleParseError(error);
      }
    });
  },








  addNewChat: function() {
    var chat = {
      "uid" : this.props.user.id,
      "text" : this.state.firstChat,
      "title" : this.state.title,
      "time" : new Date().getTime()
    }
    console.log(chat);
  },

  goBackNav: function() {
    this.props.navigator.jumpBack();
  },

  onChildChanged: function(newState) {
    this.setState(newState);
  },

  render: function() {
    return (
      
      <View style={Styles.body}>
        <NavBarNoMenu
          title="Add New String"
          onBackPress={this.goBackNav}
          onSubmitPress={this.addNewChat}
        />  

        <AddChatContainer
          title={this.state.title}
          firstChat={this.state.firstChat}
          callbackParent={this.onChildChanged}
        />     
       
      </View>



    );
  }
});