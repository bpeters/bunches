'use strict';

var React = require('react-native');
var _ = require('lodash');

var defaultStyles = require('../styles');
var sayings = require('../assets/sayings');

var {
  View,
  TextInput,
  StyleSheet, 
  TouchableOpacity,
  ScrollView,
  Text,
  ListView,
  Platform,
} = React;

var IconButton = require('../elements/iconButton');
var MentionContainer = require('./mentionContainer');

var CameraRollContainer;
if(Platform.OS === 'ios'){
  CameraRollContainer = require('./cameraRollContainerIOS');
} else {
  CameraRollContainer = require('./cameraRollContainerAndroid');
}

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
    width: defaultStyles.bodyWidth - 12 - 44 - 44,
    height: defaultStyles.chatBarHeight - 12 - 2,
    borderWidth: 0,
    backgroundColor: defaultStyles.white,
  },
  iconView : {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer : {
    width: defaultStyles.bodyWidth - 12,
    height: 44,
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
  },
  button: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textSend: {
    color: defaultStyles.red,
    fontWeight: 'bold',
    fontFamily: 'Roboto-Regular',
  },
});

module.exports = React.createClass({
  propTypes: {
    user: React.PropTypes.object,
    chat: React.PropTypes.object,
    createMessage: React.PropTypes.func,
    createChat: React.PropTypes.func,
    onCameraPress: React.PropTypes.func,
    onSelfiePress: React.PropTypes.func,
    onPressCameraRollPhoto: React.PropTypes.func,
    getUsers: React.PropTypes.func,
    clearMentions: React.PropTypes.func,
    addTyper: React.PropTypes.func,
    deleteTyper: React.PropTypes.func,
    forChat: React.PropTypes.bool,
    verified: React.PropTypes.bool,
  },
  getInitialState: function () {
    return {
      message: null,
      mention: null,
      inputShow: false,
      dataSource: new ListView.DataSource({
        rowHasChanged: (r1, r2) => r1 !== r2
      }),
    };
  },
  componentWillUnmount: function (){
    if (this.props.forChat) {
      this.props.deleteTyper(this.props.chat.objectId || this.props.chat.id);
    }
  },
  inputFocused: function (refName) {

    setTimeout(() => {
      this.refs.scrollView.getScrollResponder().scrollResponderScrollNativeHandleToKeyboard(
        React.findNodeHandle(this.refs[refName]), 0, true
      )
    }, 220);

    if (this.props.forChat) {
      this.props.addTyper(this.props.chat.objectId || this.props.chat.id);
    }
  },
  inputBlured: function (refName) {
    this.refs.scrollView.getScrollResponder().scrollTo(0, 0);

    if (this.props.forChat) {
      this.props.deleteTyper(this.props.chat.objectId || this.props.chat.id);
    }
  },
  onMentionIconPress: function (){
    var text = '@';
    this.props.getUsers();
    this.setState({
      message: text,
      mention: text,
      inputShow: true,
    });
    this.refs.inputField.focus();
  },
  onChangeText: function (message) {

    var words = _.words(message, /[^, ]+/g);
    var mention;

    if (_.includes(words[words.length - 1], '@')) {
      mention = words[words.length - 1];

      this.props.getUsers(_.trimLeft(mention, '@'));
    } else {
      this.props.clearMentions();
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
      message: null,
      mention: null,
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

    this.refs.inputField.focus();
    this.props.clearMentions();
  },
  onPressMentionClose: function () {
    var message = _.clone(this.state.message);

    if (message) {
      var end = message.indexOf(this.state.mention);

      message = message.substring(0, end);

      this.setState({
        message: message,
        mention: null,
      });
    } else {
      this.setState({
        mention: null,
      });
    }

    this.props.clearMentions();
  },
  renderIcon: function(rowData){
    return (
      <View style={Styles.iconView}>
        <IconButton
          onPress={rowData.onPress}
          icon={rowData.icon}
          size={24}
          color={defaultStyles.red}
        />
      </View>
    )
  },
  toggleTextInput: function() {
    if (this.state.inputShow) {
      this.inputBlured('chat');
    }

    this.setState({
      inputShow:!this.state.inputShow,
      cameraRoll: false,
      mention: null,
      message: null,
    });

    if (this.state.inputShow) {
      this.refs.inputField.focus();
    }
  },
  onCameraRollPress: function() {
    this.setState({
      cameraRoll:!this.state.cameraRoll
    });
  },
  onPowerPress: function() {
    this.props.createMessage(this.props.chat, {
      message: '/!/!/!/' + this.props.chat.attributes.name + _.sample(sayings)
    });
  },
  onPressCameraRollPhoto: function (photo) {
    this.setState({
      cameraRoll:!this.state.cameraRoll
    });

    this.props.onPressCameraRollPhoto(photo);
  },
  renderChat: function() {
    var textInputBackIcon = {icon: 'material|chevron-left', onPress: this.toggleTextInput};
    var textInputButtonText = this.props.forChat ? 'SEND' : 'CHAT';
    var textInputPlaceholder = this.props.forChat ? 'Write a message...' : 'Create a chat...';

    return (
      <View style={Styles.wrap}>
        {this.renderIcon(textInputBackIcon)}
        <TextInput
          ref='inputField'
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
          placeholder={textInputPlaceholder}
          placeholderTextColor={defaultStyles.dark}
          multiline={false}
        />
        <TouchableOpacity onPress={() => {
            if (_.trim(this.state.message)) {
              this.addChatMessage();
            }
          }}>
          <View style={Styles.button}>
            <Text style={Styles.textSend}>
              {textInputButtonText}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    )
  },
  renderIcons: function() {
    var icons = [
      {icon: 'ion|compose', onPress: this.toggleTextInput},
      {icon: 'material|camera', onPress: this.props.onCameraPress},
      {icon: 'fontawesome|smile-o', onPress: this.props.onSelfiePress},
      {icon: 'ion|images', onPress: this.onCameraRollPress}
    ];

    if (this.props.forChat) {
      icons.push(
        {icon: 'ion|at', onPress: this.onMentionIconPress},
        {icon: 'fontawesome|bolt', onPress: this.onPowerPress}
      );
    }

    return (
      <View style={Styles.wrap}>
        <View style={Styles.iconContainer}>
          <ListView
            horizontal={true}
            dataSource={this.state.dataSource.cloneWithRows(icons)}
            renderRow={this.renderIcon}
            showsHorizontalScrollIndicator={false}
            automaticallyAdjustContentInsets={false}
            removeClippedSubviews={false}
          />
        </View>
      </View>
    );
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
  renderCameraRoll: function () {
    return (
      <CameraRollContainer
        store={this.props.store}
        onPressCameraRollClose={this.onCameraRollPress}
        onPressCameraRollPhoto={this.onPressCameraRollPhoto}
      />
    );
  },
  render: function() {

    var chatBar;

    if(this.props.verified){
      chatBar = 
      <View ref='chat' style={Styles.body}>
        {this.state.inputShow ? this.renderChat() : this.renderIcons()}
      </View>;
    }
    
    return (
      <ScrollView
        ref='scrollView'
        keyboardShouldPersistTaps={true}
        style={Styles.scroll}
        scrollEnabled={false}
      >
        {this.props.children}
        {this.props.verified ? (this.state.mention ? this.renderMentions() : null) : null}
        {this.props.verified ? (this.state.cameraRoll ? this.renderCameraRoll() : null) : null}
        {chatBar}
      </ScrollView>
    );
  }
});