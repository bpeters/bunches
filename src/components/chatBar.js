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
} = React;

var Styles = StyleSheet.create({
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
    navigator: React.PropTypes.object,
    scrollView: React.PropTypes.object,
    bunch: React.PropTypes.object,
    createMessage: React.PropTypes.func,
  },
  getInitialState: function () {
    return {
      message: null,
    };
  },
  inputFocused: function (refName) {
    setTimeout(() => {
      var scrollResponder = this.props.scrollView.getScrollResponder();

      scrollResponder.scrollResponderScrollNativeHandleToKeyboard(
        React.findNodeHandle(this.refs[refName]),
        110,
        true
      );
    }, 50);
  },
  inputBlured: function (refName) {
    setTimeout(() => {
      var scrollResponder = this.props.scrollView.getScrollResponder();

      scrollResponder.scrollTo(0, 0);
    }, 50);
  },
  addChatMessage: function() {
    if (_.trim(this.state.message)) {
      this.props.createMessage(this.props.chat, this.state.message);
    }

    this.setState({
      message: null
    });
  },
  render: function() {
    return (
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
    );
  }
});