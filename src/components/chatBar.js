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

var Styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  body: {
    flex: 1,
    flexDirection: 'row',
    height: defaultStyles.chatBarHeight,
    backgroundColor: defaultStyles.blue,
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
    borderColor: defaultStyles.blue,
    borderWidth: 1,
    borderRadius: 2,
    backgroundColor: defaultStyles.blue,
  },
  input : {
    alignItems: 'flex-start',
    fontFamily: 'Roboto-Light',
    color: defaultStyles.dark,
    paddingLeft: 12,
    width: defaultStyles.bodyWidth - 12 - 56,
    height: defaultStyles.chatBarHeight - 12 - 2,
    borderBottomWidth: 0,
    borderWidth: 0,
    backgroundColor: defaultStyles.white,
  },
  iconView : {
    paddingTop: 4,
    paddingLeft: 8,
    flex: 1,
    alignItems: 'center',
    alignSelf:'flex-start',
  },
});

module.exports = React.createClass({
  propTypes: {
    user: React.PropTypes.object,
    chat: React.PropTypes.object,
    createMessage: React.PropTypes.func,
    createChat: React.PropTypes.func,
    height: React.PropTypes.number,
    onPress: React.PropTypes.func,
  },
  getInitialState: function () {
    return {
      message: null,
      isMention: false,
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
  onChangeText: function (message) {

    var words = _.words(message, /[^, ]+/g);
    var mention;

    if (_.includes(message, '@')) {
      mention = _.chain(words)
        .find((word) => {
          return _.includes(word, '@');
        })
        .value();
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
  renderMentions: function () {
    return (
      <MentionContainer
        store={this.props.store}
      />
    );
  },
  render: function() {
    console.log(this.state.mention);

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
            />
            <View style={Styles.iconView}>
              <IconButton
                onPress={this.props.onPress}
                icon='material|camera'
                size={36}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    );
  }
});