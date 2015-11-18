'use strict';

var React = require('react-native');
var _ = require('lodash');

var NewChat = require('../containers/newChat');

var defaultStyles = require('../styles');

var {
  View,
  TextInput,
  StyleSheet, 
  TouchableHighlight,
  ScrollView
} = React;

var Styles = StyleSheet.create({
  scroll: {
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
  wrap: {
    flexDirection: 'column',
    left: 6,
    top: 6,
    backgroundColor: defaultStyles.light,
    width: defaultStyles.bodyWidth - 12,
    height: 40,
    borderColor: defaultStyles.white,
    borderWidth: 1,
    borderRadius: 2,
  },
  input : {
    left: 10,
    fontFamily: 'Roboto-Light',
    color: defaultStyles.dark,
    height: 36,
    width: defaultStyles.bodyWidth - 38,
    borderBottomWidth: 0,
    borderWidth: 0,
  },
});

module.exports = React.createClass({
  propTypes: {
    user: React.PropTypes.object,
    chat: React.PropTypes.object,
    bunch: React.PropTypes.object,
    createMessage: React.PropTypes.func,
    createChat: React.PropTypes.func,
    height: React.PropTypes.number,
  },
  getInitialState: function () {
    return {
      message: null,
    };
  },
  inputFocused: function (refName) {
    setTimeout(() => {
      this.refs.scrollView.getScrollResponder().scrollResponderScrollNativeHandleToKeyboard(
        React.findNodeHandle(this.refs[refName]),
        this.props.height,
        true
      );
    }, 50);
  },
  inputBlured: function (refName) {
    setTimeout(() => {
      this.refs.scrollView.getScrollResponder().scrollTo(0, 0);
    }, 50);
  },
  addChatMessage: function() {
    if (_.trim(this.state.message)) {

      if (this.props.createMessage) {
        this.props.createMessage(this.props.chat, {
          message: this.state.message
        });
      } else if (this.props.createChat) {
        this.props.createChat(this.props.bunch, {
          message: this.state.message
        });
      }
    }

    this.setState({
      message: null
    });
  },
  render: function() {
    return (
      <ScrollView
        ref='scrollView'
        keyboardDismissMode='on-drag'
        style={Styles.scroll}
        scrollEnabled={false}
      >
        {this.props.children}
        <View ref='chat' style={Styles.body}>
          <View style={Styles.wrap}>
            <TextInput
              style={Styles.input}
              onChangeText={(message) => this.setState({message})}
              value={this.state.message}
              onFocus={this.inputFocused.bind(this, 'chat')}
              onBlur={this.inputBlured.bind(this, 'chat')}
              onSubmitEditing={this.addChatMessage}
              blurOnSubmit={false}
              enablesReturnKeyAutomatically={true}
              underlineColorAndroid={defaultStyles.light}
            />
          </View>
        </View>
      </ScrollView>
    );
  }
});