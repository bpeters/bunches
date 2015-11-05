'use strict';

var React = require('react-native');

//var ChatInput = require('../elements/chatInput');

var {
  Icon,
} = require('react-native-icons');

var defaultStyles = require('../styles');

var {
  View,
  ScrollView,
  TextInput,
  StyleSheet, 
  Text,
} = React;

module.exports = React.createClass({
  propTypes: {
    user: React.PropTypes.object,
    bunch: React.PropTypes.object
  },
  getInitialState: function () {
    return {
      message: null,
      scrollEnabled: false,
    };
  },
 

  // componentDidMount: function() {
    // console.log(this.data);
    // console.log(JSON.stringify(this.data));
    // var messages = _.cloneDeep(this.state.messages);

  
    // console.log(this.props.objectId);

    // // var url = 'https://bunches.firebaseio.com/chat/X5bFQmK2L3';
    // var url = 'https://bunches.firebaseio.com/chat/' + objectId;
    // this.state.messenger = new Firebase(url);
    // this.state.messenger.on('value', (snapshot) => {
    //   var data = snapshot.val();
    //   // console.log(data);

    //   messages.push(data);
    //   // console.log('messages:');
    //   // console.log(messages);

    //   this.setState({
    //     messages: messages
    //   });
    // });
  // },




  render: function() {
    console.log('start');

    // {this.data.bunch.map(function(c) {
    //     return <li>{c.text}</li>
    //   })}



    console.log(this.props.bunch);
    console.log('end');
    return (
      
      <Text>
        hello
      </Text>


    );
  }
});