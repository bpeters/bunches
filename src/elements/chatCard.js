'use strict';

var React = require('react-native');
var _ = require('lodash');
var moment = require('moment');

var Avatar = require('../elements/avatar');
var Timer = require('../elements/timer');
var Counter = require('../elements/counter');
var PopImage = require('../elements/popImage');
var Message = require('../elements/message');
var StatBar = require('../elements/statBar');
var ChatHashtag = require('../elements/chatHashtag');

var {
  Icon,
} = require('react-native-icons');

var defaultStyles = require('../styles');

var {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  ListView,
} = React;

var Styles = StyleSheet.create({
  row: {
    width: defaultStyles.bodyWidth - 32,
    marginTop: 8,
    marginBottom: 8,
    marginLeft: 16,
    shadowOpacity: 0.3,
    shadowRadius: 2,
    shadowOffset: {
      width: 0,
      height: 2
    },
    elevation: 8,
  },
  rowHeader: {
    backgroundColor: defaultStyles.white,
    borderLeftColor: defaultStyles.light,
    borderRightColor: defaultStyles.light,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    flex: 1,
    flexDirection:'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    paddingTop: 16,
    paddingLeft: 16,
    paddingBottom: 8,
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
  userName: {
    fontSize: 16,
    fontFamily: 'Roboto-Regular',
    color: defaultStyles.dark,
    marginRight: 8,
  },
  userHandle: {
    fontSize: 14,
    fontFamily: 'Roboto-Regular',
    color: defaultStyles.blue,
  },
  chatName: {
    fontSize: 14,
    paddingTop: 3,
    fontFamily: 'Roboto-Regular', 
    color: defaultStyles.medium,
  },
  counts: {
    flex: 1,
    flexDirection:'row',
    justifyContent:'flex-end',
    alignItems:'flex-start',
    alignSelf:'stretch',
    paddingBottom: 10,
  },
  rowImage: {
    width: defaultStyles.bodyWidth - 72,
    backgroundColor: defaultStyles.light,
    borderLeftColor: defaultStyles.light,
    borderRightColor: defaultStyles.light,
    borderLeftWidth: 1,
    borderRightWidth: 1,
  },
  rowMessage: {
    backgroundColor: defaultStyles.white,
    borderLeftColor: defaultStyles.light,
    borderRightColor: defaultStyles.light,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: 8,
    paddingBottom: 16,
  },
  imageView: {
    backgroundColor: defaultStyles.white,
    paddingRight:20,
    paddingLeft:20,
    paddingTop: 12,
    paddingBottom: 12,
  },
  multipleImages: {
    backgroundColor: 'rgba(0,0,0,0)',
    position: 'absolute',
    bottom: 25,
    right: 25,
  },
  icon: {
    height: 24,
    width: 24,
  },
  user: {
    flex: 1,
    justifyContent: 'flex-start',
    flexDirection: 'row',
  },
  message: {
    flex:1,
    justifyContent: 'flex-start',
    flexDirection: 'row',
    marginTop: 4,
    width: defaultStyles.bodyWidth - 32 - 32,
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
  handle: {
    marginLeft: 5,
    color: defaultStyles.blue,
    fontFamily: 'Roboto-Regular',
  },
  timeBreak: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: defaultStyles.white,
  },
});

module.exports = React.createClass({
  propTypes: {
    onPressRow: React.PropTypes.func,
    onAvatarPress: React.PropTypes.func,
    onPressImage: React.PropTypes.func,
    rowData: React.PropTypes.object,
    squashMessages: React.PropTypes.func,
    onHashtagPress: React.PropTypes.func,
    onMentionPress: React.PropTypes.func,
  },
  getInitialState: function() {
    return {
      dataSource: new ListView.DataSource({
        rowHasChanged: (r1, r2) => r1 !== r2
      }),
    };
  },
  renderCarousel: function(images) {
    var x = 0;

    if (images.length > 1) {
      x = 70;
    }

    return (
      <View style={Styles.imageView}>
        <ListView
          horizontal={true}
          dataSource={this.state.dataSource.cloneWithRows(images)}
          renderRow={this.renderImage}
          showsHorizontalScrollIndicator={false}
          automaticallyAdjustContentInsets={false}
          contentOffset={{x: x, y: 0}}
        />
        {images.length > 1 ? this.renderMultipleImage() : null}
      </View>
    );
  },
  renderMultipleImage: function()  {
    return (
      <View style={Styles.multipleImages}>
        <Icon
          name='material|code'
          size={24}
          color={defaultStyles.white}
          style={Styles.icon}
        />
      </View>
    );
  },
  renderImage: function (rowData) {
    return (
      <View style={Styles.rowImage}>
        <PopImage
          onPress={() => {this.props.onPressImage(rowData)}}
          photo={rowData}
        />
      </View>
    );
  },
  renderMessage: function (text) {
    return (
      <Message
        message={text}
        onHashtagPress={this.props.onHashtagPress}
        onMentionPress={this.props.onMentionPress}
      />
    )
  },
  renderMessages: function (message, i) {

    var text = !_.isEmpty(message.squash) ? this.renderMessage(message.squash[0].message) : null;
    var split = text ? this.renderMessage("  \u2022  ") : null;

    return (
      <View key={i} style={Styles.rowMessage}>
        <View style={Styles.user}>
          <Text style={Styles.name}>
            {message.name || 'Anon'}
          </Text>
          <Text style={Styles.handle} onPress={() => this.props.onMentionPress(message.uid, message.handle)}>
            {message.handle ? '@' + message.handle : ''}
          </Text>
          <View style={Styles.date}>
            <Text style={Styles.time}>
              {moment(message.time).format("h:mm a")}
            </Text>
          </View>
        </View>
        <Text style={Styles.message}>
          {text}
          {split}
          {this.renderMessage(message.message)}
        </Text>
      </View>
    );
  },
  renderLastTwoMessages: function(mostRecentMessages) {

    var messages = this.props.squashMessages(mostRecentMessages);

    var lastTwo = messages.slice(messages.length - 2);
    var msgs = _.map(lastTwo, (message, i) => {
      return this.renderMessages(message, i);
    });

    return msgs;
  },
  renderHashtags: function(messages) {
    return (
      <ChatHashtag
        messages={messages}
        onHashtagPress={this.props.onHashtagPress}
      />
    )
  },
  render: function() {
    var rowData = this.props.rowData;
    var user = rowData.chat.get('createdBy');
    
    var userCount = _.uniq(rowData.messages, 'uid').length;

    var mostRecentImages = [];
    var mostRecentMessages = [];
    var hashtags = [];
    var onlineStatus;
    

    _.forEach(rowData.messages, (message) => {

      if (message.imageURL) {
        mostRecentImages.push(message.imageURL);
      }

      if (message.message) {
        mostRecentMessages.push(message);

        var words = message.message.split(' ');
        var msg = _.map(words, (word, i) => {
          if (_.startsWith(word, '#')) {
            hashtags.push(word);
          }
        });
      }

      if (user.id === message.uid && message.online) {
        onlineStatus = message.online;
      }
    });

    return (
      <TouchableOpacity activeOpacity={0.8} onPress={() => this.props.onPressRow(rowData)}>
        <View style={[Styles.row,defaultStyles.chatCard]}>
          <Timer
            expiration={rowData.chat.attributes.expirationDate}
            created={rowData.chat.createdAt}
            view='bunch'
            width={defaultStyles.bodyWidth - 52}
          />
          {hashtags.length ? this.renderHashtags(hashtags) : null}
          <View style={Styles.rowHeader}>
            <Avatar
              onPress={() => this.props.onAvatarPress(user.attributes.image ? user.attributes.image.url() : null)}
              imageURL={user.attributes.image ? user.attributes.image.url() : null}
              online={onlineStatus}
            />
            <View style={Styles.info}>
              <View style={Styles.infoBar}>
                <View style={Styles.user}>
                  <Text style={Styles.userName}>
                    {user.attributes.name}
                  </Text>
                </View>
                <Text style={Styles.userHandle} onPress={() => this.props.onMentionPress(user.id, user.attributes.handle)}>
                  @{user.attributes.handle}
                </Text>
              </View>
            </View>
          </View>
          {mostRecentImages.length ? this.renderCarousel(mostRecentImages.reverse()) : null}
          {mostRecentMessages.length ? this.renderLastTwoMessages(mostRecentMessages) : null}
          <StatBar
            score={rowData.score}
            userCount={userCount}
            expiration={rowData.chat.attributes.expirationDate}
          />
        </View>
      </TouchableOpacity>
    );
  }
});