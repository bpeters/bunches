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

    console.log(chat);

    return {
      chats: (new Parse.Query('Chat2User'))
        .equalTo('chat', chat)
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
  /*
  cleanChat: function(url) {
    var a = new Date();
    var b = a.getFullYear() + '-' + a.getMonth() + '-' + a.getDate();
    var f = null;
    var messages = _.cloneDeep(this.state.messages);
    this.state.messenger = new Firebase(url);
      this.state.messenger.orderByChild('time').limitToLast(10).on('child_added', (snapshot) => {
        var data = snapshot.val();
        var c = new Date(data.time);
        data.time = c.toLocaleTimeString('en-US', {hour: '2-digit', minute: '2-digit', hour12: true});
        var d = c.getFullYear() + '-' + c.getMonth() + '-' + c.getDate(); 
        if(Date.parse(d)<=Date.parse(b)){
          if(f!=c.toLocaleDateString()){
            var e = {
              "breaker": c.toLocaleDateString()
            };
            if(Date.parse(d)==Date.parse(b)){
              e = {
                "breaker": "Today"
              }
            }
            f = c.toLocaleDateString();
            messages.push(e);
          }
        }
        messages.push(data);
        this.setState({
          messages: messages,
          url : url
        });
      });
  },
  componentWillReceiveProps:  function(nextProps){

    this.setState({
     route: nextProps.route > this.props.route
    });
    var isEmpty = this.props.route.length === 0;
    if(isEmpty) {
     console.log('empty')
    } else {
     console.log('full');
    }
    console.log(this.state);
    console.log(this.props.route.bunch);


    if(this.props.route.bunch){
     var url = config.get('firebase.url') + this.props.route.bunch.id.objectId;
     this.cleanChat(url);
    }   
  }, */
  onBackPress: function () {
    this.props.navigator.pop();
  },
  render: function() {

    var messages = _.cloneDeep(this.state.messages);

    var users = _.pluck(this.data.chats, 'user');

    _.forEach(messages, (message) => {
      message.user = _.find(users, {'objectId' : message.uid});
    });

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
          messenger={this.state.messenger}
          navigator={this.props.navigator}
        />
      </View>
    );
  }
});