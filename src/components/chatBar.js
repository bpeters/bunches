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
    width: defaultStyles.bodyWidth - 12 - 44 - 44,
    height: defaultStyles.chatBarHeight - 12 - 2,
    borderWidth: 0,
    backgroundColor: defaultStyles.white,
  },
  iconView : {
    // borderRadius: 22,
    width: 24,
    height: 24,
    margin:10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconView2 : {
    borderRadius: 22,
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: defaultStyles.blue,
    marginBottom: 5,
  },
  iconContainer : {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textSend: {
    color: defaultStyles.blue,
    fontWeight: 'bold',
    fontFamily: 'Roboto-Regular',
  },



  toolbar: {
    position: 'absolute',
    width: 56,
    backgroundColor: 'transparent',
    // backgroundColor: defaultStyles.white,
    bottom: defaultStyles.chatBarHeight - 1,
    left: 0,
    // borderTopRightRadius: 4,
    // borderTopWidth : 1,
    // borderRightWidth: 1,
    // borderColor: defaultStyles.grayLight,
    paddingLeft: 6,
    paddingRight: 6,
    // shadowOpacity: 0.5,
    // shadowRadius: 2,
    // shadowOffset: {
    //   width: 0,
    //   height: 2
    // },
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
      buttonText: 'send',
      chatText: 'Write a message...',
      activeIcon: 0,
      editable: true,
      toolbar: false,
      icons: [
        {icon: 'material|format-subject', onLongPress: this.toggleToolbar},
        {icon: 'material|camera', onPress: this.props.onPress, onLongPress: this.toggleToolbar},
        {icon: 'material|mood', onPress: this.props.onPress, onLongPress: this.toggleToolbar},
        {icon: 'material|collection-image', onPress: this.props.onPress, onLongPress: this.toggleToolbar}
      ],



      dataSource: new ListView.DataSource({
        rowHasChanged: (r1, r2) => r1 !== r2
      }),
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
  renderIcon: function(rowData){
    return (
      <View style={Styles.iconView}>
        <IconButton
          onPress={rowData.onPress}
          onLongPress={rowData.onLongPress}
          icon={rowData.icon}
          size={24}
          color={defaultStyles.blue}
        />
      </View>
    )
  },
  renderIcon2: function(rowData){
    return (
      <View style={Styles.iconView2}>
        <IconButton
          onPress={rowData.onPress}
          onLongPress={rowData.onLongPress}
          icon={rowData.icon}
          size={24}
        />
      </View>
    )
  },
  updateChatBar: function(visibleRows, changedRows) {
    if(visibleRows.s1){
      _.forEach(visibleRows.s1, (val, key) => {
        if(key !== this.state.activeIcon){
          var a, b, c;
          switch (key) {
            case '0':
              a = 'Chat';
              b = 'Write a message ...';
              c = true;
              break;
            case '1':
              a = 'Send';
              b = 'Take a picture...';
              c = true;
              break;
            case '2':
              a = 'Post';
              b = 'Lemme take a selfie...';
              c = true;
              break;
            case '3':
              a = 'Post';
              b = 'Post a picture you have...';
              c = true;
              break;
            case '4':
              a = 'Join';
              b = 'Join a bunch based upon location...';
              c = false;
              break;
            case '5':
              a = 'Join';
              b = 'Drop into a random bunch...';
              c = false;
              break;
            default:
              a = 'Send';
              b = 'Write a message...';
              c = true;
              break;
          }
          this.setState({
            buttonText: a,
            chatText: b,
            editable: c,
            activeIcon: key
          })
        }
      })
    }
  },

  toggleToolbar: function() {
    this.setState({ toolbar: this.state.toolbar === false ? true : false});
  },



  // toggleToolbar: function() {
  //   (this.state.)
  //   this.setState({
  //     toolbar: true,
  //   })
  // },
  renderToolbar: function() {
    var icons = _.map(this.state.icons, (icon) => {
      return this.renderIcon2(icon);
    });
    return (
      <View style={Styles.toolbar}>
        {icons}
      </View>
    )
  },
  renderIcons: function() {
    return (
      <View style={Styles.iconContainer}>
        <ListView
          dataSource={this.state.dataSource.cloneWithRows(this.state.icons)}
          renderRow={this.renderIcon}
          showsVerticalScrollIndicator={false}
          automaticallyAdjustContentInsets={false}
          removeClippedSubviews={false}
          onChangeVisibleRows={this.updateChatBar}
        />
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
          {this.renderIcons()}
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
              placeholder={this.state.chatText}
              placeholderTextColor={defaultStyles.dark}
              editable={this.state.editable}
              multiline={false}
            />
            <View style={Styles.button}>
              <Text style={Styles.textSend}>
                {this.state.buttonText.toUpperCase()}
              </Text>
            </View>
          </View>
        </View>

        {this.state.toolbar ? this.renderToolbar() : null}


      </ScrollView>
    );
  }
});