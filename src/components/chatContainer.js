'use strict';

var React = require('react-native');
var _ = require('lodash');
var moment = require('moment');

var Avatar = require('../elements/avatar');
var PopImage = require('../elements/popImage');
var EnlargePhoto = require('../containers/enlargePhoto');
var InvertibleScrollView = require('react-native-invertible-scroll-view');
var Profile = require('../containers/profile');
var Message = require('../elements/message');
var Hashtag = require('../containers/hashtag');

var defaultStyles = require('../styles');

var {
  View,
  ScrollView,
  TextInput,
  StyleSheet, 
  Text,
  ListView,
  TouchableOpacity,
  Image,
} = React;

var Styles = StyleSheet.create({
  container: {
    height: defaultStyles.bodyHeight - defaultStyles.chatBarHeight,
    backgroundColor: defaultStyles.white,
    paddingTop: defaultStyles.navBarHeight + defaultStyles.statBarHeight,
  },
  gap: {
    width: defaultStyles.bodyWidth - 32,
    marginTop: 16,
    marginBottom: 16,
    marginLeft: 16,
    alignItems: 'center',
  },
  row: {
    flex:1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    marginBottom: 16,
    paddingLeft: 16,
  },
  info: {
    flex:1,
    alignItems: 'stretch',
    flexDirection: 'column',
    paddingLeft: 16,
  },
  user: {
    flex:1,
    justifyContent: 'flex-start',
    flexDirection: 'row',
  },
  name: {
    color: defaultStyles.dark,
    fontFamily: 'Roboto-Bold',
    fontSize: 14,
  },
  date: {
    flex:1,
    alignItems:'flex-start',
    paddingLeft: 8,
  },
  time: {
    color: defaultStyles.medium,
    fontFamily: 'Roboto-Regular',
    fontSize: 14,
  },
  chat: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'stretch',
    paddingTop: 8,
    paddingRight: 16,
  },
  typing: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    backgroundColor: defaultStyles.light,
  },
  typingText: {
    color: defaultStyles.medium,
  },
  imageWrap: {
    paddingTop: 16,
    width: defaultStyles.bodyWidth - 16 - 40 - 16 - 16,
  },
  handle: {
    marginLeft: 5,
    color: defaultStyles.red,
    fontFamily: 'Roboto-Regular',
  },
});

module.exports = React.createClass({
  propTypes: {
    user: React.PropTypes.object,
    navigator: React.PropTypes.object,
    messages: React.PropTypes.array,
    typers: React.PropTypes.object,
    squashMessages: React.PropTypes.func,
    queryUser: React.PropTypes.func,
  },
  getInitialState: function() {
    return {
      message: null,
      dataSource: new ListView.DataSource({
        rowHasChanged: (r1, r2) => r1 !== r2
      }),
    };
  },
  onAvatarPress: function (imageURL) {
    this.props.navigator.push({
      name: "enlarge photo",
      component: EnlargePhoto,
      hasSideMenu: false,
      photo: imageURL,
    });
  },
  onPressImage: function (imageURL) {
    this.props.navigator.push({
      name: "enlarge photo",
      component: EnlargePhoto,
      hasSideMenu: false,
      photo: imageURL,
    });
  },
  onHashtagPress: function (word) {
    this.props.navigator.push({
      name: 'hashtag',
      component: Hashtag,
      hashtag: word,
    });
  },
  onMentionPress: function (uid, handle) {
    this.props.navigator.push({
      name: 'profile',
      component: Profile,
      uid: uid,
      handle: handle,
    });
  },
  renderImage: function (imageURL) {
    return (
      <View style={Styles.imageWrap}>
        <PopImage
          onPress={() => {this.onPressImage(imageURL)}}
          photo={imageURL}
        />
      </View>
    );
  },
  renderMessage: function (message) {
    return (
      <View style={Styles.chat}>
        <Message
          message={message}
          onHashtagPress={this.onHashtagPress}
          onMentionPress={this.onMentionPress}
        />
      </View>
    );
  },
  renderSquash: function (squash) {

    var messages = _.map(squash, (message, i) => {
      return (
        <View key={i}>
          {message.message ? this.renderMessage(message.message) : null}
          {message.imageURL ? this.renderImage(message.imageURL) : null}
        </View>
      );
    });

    return messages;
  },
  renderChatRow: function(rowData) {
    return (
      <View style={Styles.row}>
        <Avatar
          onPress={() => this.onAvatarPress(rowData.userImageURL)}
          imageURL={rowData.userImageURL}
          online={rowData.online}
        />
        <View style={Styles.info}>
          <View style={Styles.user}>
            <Text style={Styles.name}>
              {rowData.name || 'Anon'}
            </Text>
            <Text style={Styles.handle} onPress={() => this.onMentionPress(rowData.uid, rowData.handle)}>
              {rowData.handle ? '@' + rowData.handle : ''}
            </Text>
            <View style={Styles.date}>
              <Text style={Styles.time}>
                {moment(rowData.time).format("h:mm a")}
              </Text>
            </View>
          </View>
          {rowData.message ? this.renderMessage(rowData.message) : null}
          {rowData.imageURL ? this.renderImage(rowData.imageURL) : null}
          {!_.isEmpty(rowData.squash) ? this.renderSquash(rowData.squash) : null}
        </View>
      </View>
    );
  },
  renderChatFooter: function () {
    return (
      <View style={Styles.gap} />
    );
  },
  renderChatHeader: function () {

    var typers = _.cloneDeep(this.props.typers);
    var handles = _.chain(typers.users)
      .pluck('handle')
      .filter((i) => {
        return i !== this.props.user.handle
      })
      .value();

    var str = '';

    if (handles.length) {
      if (handles.length === 1) {
        str = '@' + handles[0] + ' is typing...';
      } else if (handles.length === 2){
        str = '@' + handles[0] + ' and 1 other are typing...';
      } else {
        str = '@' + handles[0] + ' and ' + (handles.length - 1).toString() + ' others are typing...';
      }
    }

    if (str) {
      return (
        <View style={Styles.typing}>
          <Text style={Styles.typingText}>
            {str}
          </Text>
        </View>
      );
    } else {
      return null;
    }

  },
  render: function() {

    var messages = this.props.squashMessages(this.props.messages);

    return (
      <View style={Styles.container}>
        <ListView
          renderScrollComponent={props => <InvertibleScrollView {...props} inverted />}
          dataSource={this.state.dataSource.cloneWithRows(messages)}
          renderRow={this.renderChatRow}
          renderFooter={this.renderChatFooter}
          renderHeader={this.renderChatHeader}
        />
        {this.props.children}
      </View>
    );
  }
});