'use strict';

var React = require('react-native');
var Parse = require('parse/react-native');
var ParseReact = require('parse-react/react-native');
var _ = require('lodash');

var NavBar = require('../components/navBar');
var ChatBar = require('../components/chatBar');

var defaultStyles = require('../styles');

// Firebase Test
var Firebase = require('firebase');
// end firebase test



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




 
 // Firebase Test
 getInitialState: function() {
    var url = 'https://bunches.firebaseio.com/items/';

    return {
      messenger: new Firebase(url),
      message: null,
      messages: [],
      dataSource: new ListView.DataSource({
        rowHasChanged: (r1, r2) => r1 !== r2
      }),
      showChat: true,
      showEnrolled: false,
      showTutors: false,
      showBunches: false,
      people: [],
    };
  },

  componentDidMount: function() {
    var messages = _.cloneDeep(this.state.messages);

    this.state.messenger.on('value', (snapshot) => {
      var data = snapshot.val();

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
        <Text>
        {this.state.messages}
        </Text>
        <ChatBar
          user={this.props.user}
        />
      </View>
    );
  }
});