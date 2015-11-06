'use strict';

var React = require('react-native');
var _ = require('lodash');
var Firebase = require('firebase');
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
    messages: React.PropTypes.object,
  },
 

  render: function() {
    return (
      <View>
        <View>
          <Text>
            {this.props.messages}
          </Text>
        </View>
      </View>
    );
  }

});