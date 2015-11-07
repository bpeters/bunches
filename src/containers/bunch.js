'use strict';

var React = require('react-native');
var _ = require('lodash');
var Firebase = require('firebase');

var NavBar = require('../components/navBar');
var ChatBar = require('../components/chatBar');
var ChatContainer = require('../components/chatContainer');

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
    }
  },
  componentWillReceiveProps:  function(nextProps){
    if(this.props.route.bunch){
      var url = config.firebase.url + this.props.route.bunch.id.objectId;
      var messages = _.cloneDeep(this.state.messages);
      this.state.messenger = new Firebase(url);
      this.state.messenger.on('child_added', (snapshot) => {
        var data = snapshot.val();
        messages.push(data);
        this.setState({
          messages: messages,
          url : url
        });
      });
    }   
  },

  render: function() {
    return (
      <View style={Styles.body}>
        <NavBar
          title={this.props.route.bunch ? this.props.route.bunch.name : ''}
          menuButton={this.props.menuButton}
        />
        <ChatContainer
          user={this.props.user}
          messages={this.state.messages}
        />        
        <ChatBar
          user={this.props.user}
          url={this.state.url}
          navigator={this.props.navigator}
        />
      </View>
    );
  }
});



// <View style={Styles.body}>
//         <NavBar
//           title={this.props.route.bunch ? this.props.route.bunch.name : ''}
//           menuButton={this.props.menuButton}
//         />
//         <ChatContainer
//           user={this.props.user}
//           messages={this.state.messages}
//         />        
//         <ChatBar
//           user={this.props.user}
//           url={this.state.url}
//           navigator={this.props.navigator}
//         />
//       </View>