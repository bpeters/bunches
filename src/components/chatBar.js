'use strict';

var React = require('react-native');
var _ = require('lodash');

var defaultStyles = require('../styles');

var {
  View,
  TextInput,
  StyleSheet, 
  TouchableOpacity,
  ScrollView,
  Text,
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
    flexDirection: 'row',
    left: 6,
    top: 6,
    width: defaultStyles.bodyWidth - 12,
    height: defaultStyles.chatBarHeight - 12,
    borderColor: defaultStyles.white,
    borderWidth: 1,
    borderRadius: 2,
    backgroundColor: defaultStyles.background,
  },
  input : {
    alignItems: 'flex-start',
    fontFamily: 'Roboto-Light',
    color: defaultStyles.dark,
    paddingLeft: 12,
    width: defaultStyles.bodyWidth - 12 - 76,
    height: defaultStyles.chatBarHeight - 12 - 2,
    borderBottomWidth: 0,
    borderWidth: 0,
    backgroundColor: defaultStyles.white,
  },
  send: {
    width: 74,
    fontSize: 16,
    paddingLeft: 18,
    paddingTop: 12,
    alignItems: 'flex-end',
    fontFamily: 'Roboto-Bold',
    color: defaultStyles.dark,
  },
  notSend: {
    width: 74,
    fontSize: 16,
    paddingLeft: 18,
    paddingTop: 12,
    alignItems: 'flex-end',
    fontFamily: 'Roboto-Bold',
    color: defaultStyles.medium,
  },
});

module.exports = React.createClass({
  propTypes: {
    user: React.PropTypes.object,
    chat: React.PropTypes.object,
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

    if (this.props.createMessage) {
      this.props.createMessage(this.props.chat, {
        message: this.state.message
      });
    } else if (this.props.createChat) {
      this.props.createChat(this.state.message, this.state.message);
    }

    this.setState({
      message: null
    });
  },
  renderSend: function () {
    return (
      <TouchableOpacity onPress={this.addChatMessage}>
        <Text style={Styles.send}>
          Send
        </Text>
      </TouchableOpacity>
    );
  },
  renderNotSend: function () {
    return (
      <Text style={Styles.notSend}>
        Send
      </Text>
    );
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
              onSubmitEditing={() => {
                if (_.trim(this.state.message)) {
                  this.addChatMessage();
                }
              }}
              value={this.state.message}
              onFocus={this.inputFocused.bind(this, 'chat')}
              onBlur={this.inputBlured.bind(this, 'chat')}
              underlineColorAndroid={defaultStyles.light}
              clearButtonMode='while-editing'
              returnKeyType='send'
            />
            {_.trim(this.state.message) ? this.renderSend() : this.renderNotSend()}
          </View>
        </View>
      </ScrollView>
    );
  }
});