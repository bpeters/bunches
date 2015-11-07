'use strict';

var React = require('react-native');
var Firebase = require('firebase');

var routes = require('../routes');
var ChatButton = require('../elements/chatButton');

console.log(routes);


var {
  Icon,
} = require('react-native-icons');

var defaultStyles = require('../styles');
var config = require('../config');

var {
  View,
  ScrollView,
  TextInput,
  StyleSheet, 
  TouchableHighlight,
} = React;

var Styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  contentContainerStyle : {
    flex: 1,
  },
  body: {
    flex: 1,
    flexDirection: 'row',
    height: defaultStyles.chatBarHeight,
    backgroundColor: defaultStyles.blue,
    shadowColor: defaultStyles.dark,
    shadowOpacity: 0.5,
    shadowRadius: 2,
    shadowOffset: {
      width: 0,
      height: -1
    },
  },
  list: {
    height: defaultStyles.bodyHeight
  },
  wrap: {
    flexDirection: 'row',
    left: 16,
    top: 16,
    backgroundColor: defaultStyles.light,
    width: defaultStyles.bodyWidth - 32,
    height: 44,
    borderColor: defaultStyles.white,
    borderWidth: 1,
    borderRadius: 2,
  },
  input : {
    left: 10,
    fontFamily: 'Roboto-light',
    color: defaultStyles.dark,
    height: 42,
    width: defaultStyles.bodyWidth - 58,
    borderBottomWidth: 0,
    borderWidth: 0,
  },
  icon: {
    top: 5,
    left: 3,
    width: 30,
    height: 30,
  },
});

module.exports = React.createClass({
  propTypes: {
    user: React.PropTypes.object,
    url: React.PropTypes.string,
    navigator: React.PropTypes.object,
  },
  getInitialState: function () {
    return {
      message: null,
      scrollEnabled: false,
    };
  },
  inputFocused: function (refName) {
    setTimeout(() => {
      var scrollResponder = this.refs.scrollView.getScrollResponder();

      scrollResponder.scrollResponderScrollNativeHandleToKeyboard(
        React.findNodeHandle(this.refs[refName]),
        56,
        true
      );
    }, 50);
  },
  addChatMessage: function() {
    var chat = {
      uid: this.props.user.id,
      text: this.state.message,
      time: new Date().getTime()
    }
    var ref = new Firebase(this.props.url);
    ref.push().set(chat);
  },
  onChatButtonPress: function () {
    console.log('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')
    console.log(routes);
    console.log(routes.newChat);
    // this.props.navigator.push(routes.newChat);
  },
  render: function() {
    return (
      <View>
        <ScrollView
          ref='scrollView'
          keyboardDismissMode='on-drag'
          style={Styles.scroll}
          contentContainerStyle={Styles.contentContainerStyle}
          scrollEnabled={this.state.scrollEnabled}
        >
       <View ref='chat' style={Styles.body}>
          <View style={Styles.wrap}>         
            <TextInput
              style={Styles.input}
              onChangeText={(message) => this.setState({message})}
              value={this.state.message}
              onFocus={this.inputFocused.bind(this, 'chat')}
              onSubmitEditing={this.addChatMessage}
            />
          </View>
        </View>
      </ScrollView>
      <ChatButton
        user={this.props.user}
        onPress={this.onChatButtonPress}
      />
      </View>
    );
  }
});