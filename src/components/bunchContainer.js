'use strict';

var React = require('react-native');
var _ = require('lodash');

var Chat = require('../containers/chat');
var Avatar = require('../elements/avatar');
var PopImage = require('../elements/popImage');
var EnlargePhoto = require('../containers/enlargePhoto');
var Timer = require('../elements/timer');
var Counter = require('../elements/counter');

var defaultStyles = require('../styles');

var {
  View,
  TouchableOpacity,
  Text,
  ListView,
  StyleSheet,
  Image,
} = React;

var Styles = StyleSheet.create({
  container: {
    height: defaultStyles.bodyHeight,
    paddingBottom: 16,
  },
  row: {
    width: defaultStyles.bodyWidth - 32,
    marginTop: 16,
    marginLeft: 16,
  },
  rowHeader: {
    backgroundColor: defaultStyles.white,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    borderTopColor: defaultStyles.light,
    borderLeftColor: defaultStyles.light,
    borderRightColor: defaultStyles.light,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    flex:1,
    flexDirection:'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    paddingTop: 16,
    paddingLeft: 16,
  },
  rowImage: {
    height: 176,
    backgroundColor: defaultStyles.white,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
    borderBottomColor: defaultStyles.light,
    borderLeftColor: defaultStyles.light,
    borderRightColor: defaultStyles.light,
    borderBottomWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
  },
  rowMessage: {
    height: 56,
    backgroundColor: defaultStyles.white,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
    borderBottomColor: defaultStyles.light,
    borderLeftColor: defaultStyles.light,
    borderRightColor: defaultStyles.light,
    borderBottomWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
  },
  userName: {
    flex:2.5,
    fontSize: 16,
    fontFamily: 'Roboto-Regular',
    color: defaultStyles.dark,
  },
  chatTitle: {
    fontSize: 14,
    fontFamily: 'Roboto-Regular', 
    color: defaultStyles.medium,
  },
  message: {
    marginLeft: 16,
    marginTop: 16,
    marginRight: 16,
    fontSize: 14,
    fontFamily: 'Roboto-Light',
    color: defaultStyles.dark,
  },
  counts: {
    flex:1,
    flexDirection:'row',
    justifyContent:'flex-end',
    alignItems:'flex-start',
    alignSelf:'stretch',
    paddingBottom:10,
  },
  info: {
    flex:1,
    alignItems: 'stretch',
    flexDirection: 'row',
    paddingLeft: 16,
  },
  infoBar: {
    flex:1,
    alignItems: 'stretch',
    flexDirection: 'column',
  },
  content: {
    flex:1,
    flexDirection:'row',
  }
});

module.exports = React.createClass({
  propTypes: {
    user: React.PropTypes.object,
    navigator: React.PropTypes.object,
    store: React.PropTypes.object,
  },
  getInitialState: function() {
    return {
      dataSource: new ListView.DataSource({
        rowHasChanged: (r1, r2) => r1 !== r2
      }),
    };
  },
  onPressRow: function (rowData) {
    this.props.navigator.push({
      name: 'chat',
      component: Chat,
      hasSideMenu: true,
      chat: rowData
    });
  },
  onAvatarPress: function (rowData) {

  },
  onPressImage: function (imageURL) {
    this.props.navigator.push({
      name: 'enlarge photo',
      component: EnlargePhoto,
      hasSideMenu: false,
      photo: imageURL,
    });
  },
  renderImage: function (imageURL) {
    return (
      <View style={Styles.rowImage}>
        <PopImage
          onPress={() => {this.onPressImage(imageURL)}}
          photo={imageURL}
        />
      </View>
    );
  },
  renderMessage: function (message) {
    return (
      <View style={Styles.rowMessage}>
        <Text style={Styles.message}>
          {message}
        </Text>
      </View>
    );
  },
  renderChatRow: function(rowData) {

    var chat = _.find(this.props.store.chats, {'id' : rowData.id});

    var userCount = _.chain(rowData.messages)
      .pluck('uid')
      .uniq()
      .value()
      .length;

    var mostRecentImage;
    var mostRecentMessage;

    _.forEach(rowData.messages, (message) => {

      if (message.imageURL) {
        mostRecentImage = message.imageURL;
      }

      if (message.message) {
        mostRecentMessage = message.message;
      }

    });

    rowData.chat = chat;

    var user = rowData.chat.get('createdBy');

    return (
      <TouchableOpacity onPress={() => this.onPressRow(rowData)}>
        <View style={Styles.row}>
          <View style={Styles.rowHeader}>
            <Avatar
              onPress={() => this.onAvatarPress(rowData)}
              imageURL={user.attributes.image ? user.attributes.image.url() : null}
            />
            <View style={Styles.info}>
              <View style={Styles.infoBar}>
                <Text style={Styles.userName}>
                  {user.attributes.name}
                </Text>
                <Text style={Styles.chatTitle}>
                  {rowData.chat.attributes.name}
                </Text>
              </View>
              <View style={Styles.counts}>
                <Counter
                  users={userCount}
                  messages={rowData.messages.length}
                  color='full'
                />
              </View>
            </View>
          </View>
          {mostRecentImage ? this.renderImage(mostRecentImage) : null}
          {mostRecentMessage ? this.renderMessage(mostRecentMessage) : null}
          <Timer
            expiration={rowData.chat.attributes.expirationDate}
            created={rowData.chat.createdAt}
            color={defaultStyles.white}
            width={defaultStyles.bodyWidth - 32}
          />
        </View>
      </TouchableOpacity>
    );
  },
  render: function() {
    return (
      <View style={Styles.container}>
        <ListView
          dataSource={this.state.dataSource.cloneWithRows(this.props.store.messages)}
          renderRow={this.renderChatRow}
          automaticallyAdjustContentInsets={false}
        />
      </View>
    );
  }
});