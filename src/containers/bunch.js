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

    // this.setState({
    //   route: nextProps.route > this.props.route
    // });
    // var isEmpty = this.props.route.length === 0;
    // if(isEmpty) {
    //   console.log('empty')
    // } else {
    //   console.log('full');
    // }
    // console.log(this.state);
    // console.log(this.props.route.bunch);
    if(this.props.route.bunch){
      var url = config.firebase.url + this.props.route.bunch.id.objectId;      
      this.cleanChat(url);
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