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
  ListView,
} = React;

var IconButton = require('../elements/iconButton');
var MentionContainer = require('./mentionContainer');

var Styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  body: {
    flex: 1,
    flexDirection: 'row',
    height: defaultStyles.chatBarHeight,
    backgroundColor: defaultStyles.white,
    borderTopWidth: 1,
    borderTopColor: defaultStyles.grayLight,
  },
  wrap: {
    flexDirection: 'row',
    left: 6,
    top: 6,
    width: defaultStyles.bodyWidth - 12,
    height: defaultStyles.chatBarHeight - 12,
    alignItems: 'center',
  },
  input : {
    alignItems: 'flex-start',
    fontFamily: 'Roboto-Light',
    color: defaultStyles.dark,
    paddingLeft: 12,
    width: defaultStyles.bodyWidth - 12 - 44,
    height: defaultStyles.chatBarHeight - 12 - 2,
    borderWidth: 0,
    backgroundColor: defaultStyles.white,
  },
  iconView : {
    borderRadius: 22,
    backgroundColor: defaultStyles.blue,
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

module.exports = React.createClass({
  propTypes: {
    user: React.PropTypes.object,
    chat: React.PropTypes.object,
    createMessage: React.PropTypes.func,
    createChat: React.PropTypes.func,
    onPress: React.PropTypes.func,
    getUsers: React.PropTypes.func,
    clearUsers: React.PropTypes.func,
    addTyper: React.PropTypes.func,
    deleteTyper: React.PropTypes.func,
    forChat: React.PropTypes.bool,
  },
  getInitialState: function () {
    return {
      message: null,
      mention: null,
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

    if (this.props.forChat) {
      this.props.addTyper(this.props.chat.objectId || this.props.chat.id);
    }
  },
  inputBlured: function (refName) {
    setTimeout(() => {
      this.refs.scrollView.getScrollResponder().scrollTo(0, 0);
    }, 50);

    if (this.props.forChat) {
      this.props.deleteTyper(this.props.chat.objectId || this.props.chat.id);
    }
  },
  onChangeText: function (message) {

    var words = _.words(message, /[^, ]+/g);
    var mention;

    if (_.includes(words[words.length - 1], '@')) {
      mention = words[words.length - 1];

      this.props.getUsers(_.trimLeft(mention, '@'));
    } else {
      this.props.clearUsers();
    }

    this.setState({
      message: message,
      mention: mention,
    });
  },
  addChatMessage: function() {

    if (this.props.createMessage) {
      this.props.createMessage(this.props.chat, {
        message: this.state.message
      });
    } else if (this.props.createChat) {
      this.props.createChat(this.state.message);
    }

    this.setState({
      message: null
    });
  },
  onPressMention: function (mention) {

    var message = _.clone(this.state.message);
    var end = message.indexOf(this.state.mention);

    message = message.substring(0, end) + '@' + mention.handle + ' ';

    this.setState({
      message: message,
      mention: null,
    });

    this.props.clearUsers();
  },
  onPressMentionClose: function () {
    var message = _.clone(this.state.message);
    var end = message.indexOf(this.state.mention);

    message = message.substring(0, end);

    this.setState({
      message: message,
      mention: null,
    });

    this.setState({
      mention: null,
    });

    this.props.clearUsers();
  },
  renderMentions: function () {
    return (
      <MentionContainer
        store={this.props.store}
        onPressMention={this.onPressMention}
        onPressMentionClose={this.onPressMentionClose}
      />
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
        {this.state.mention ? this.renderMentions() : null}
        <View ref='chat' style={Styles.body}>
          <View style={Styles.wrap}>
            <TextInput
              style={Styles.input}
              onChangeText={(message) => {this.onChangeText(message)}}
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
              placeholder='Write a message ...'
              placeholderTextColor={defaultStyles.dark}
            />
            <View style={Styles.iconView}>
              <IconButton
                onPress={this.props.onPress}
                icon='material|camera'
                size={24}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    );
  }
});