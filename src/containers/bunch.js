'use strict';

var React = require('react-native');
var Parse = require('parse/react-native');
var ParseReact = require('parse-react/react-native');
var _ = require('lodash');
var Firebase = require('firebase');

var NavBar = require('../components/navBar');
var ChatBar = require('../components/chatBar');
var ChatContainer = require('../components/chatContainer');

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
  mixins: [ParseReact.Mixin],
  propTypes: {
    navigator: React.PropTypes.object,
    route: React.PropTypes.object,
    user: React.PropTypes.object,
    menuButton: React.PropTypes.object,
  },
  observe: function() {
    return {
      bunches: (new Parse.Query('Bunch2User'))
        .equalTo('user', this.props.user)
        .equalTo('isMain', true)
        .include("bunch"),
    };
  },
  getInitialState: function(){
    return {
      messages: []
    }
  },


 


  componentWillReceiveProps:  function(nextProps){
    console.log('here')
    var url = 'https://bunches.firebaseio.com/chat/' + nextProps.bunch.id.objectId;
    var messages = _.cloneDeep(this.state.messages);
    console.log(url)
    this.state.messenger = new Firebase(url);
    this.state.messenger.on('child_added', (snapshot) => {
      var data = snapshot.val();
      console.log('poop');

      messages.push(data);

      

      this.setState({
        messages: messages
      });
    });
  },




  render: function() {
    
    var bunch = _.chain(this.data.bunches)
      .first()
      .get('bunch')
      .value();      

     

    







    return (
      <View style={Styles.body}>
        <NavBar
          title={bunch ? bunch.name : ''}
          menuButton={this.props.menuButton}
        />       

        

        <ChatBar
          user={this.props.user}
        />
      </View>
    );
  }
});