'use strict';

var React = require('react-native');
var _ = require('lodash');

var Chat = require('../containers/chat');
var EnlargePhoto = require('../containers/enlargePhoto');
var Profile = require('../containers/profile');
var ChatCard = require('../elements/chatCard');
var Hashtag = require('../containers/hashtag');
var VideoPreview = require('../containers/videoPreview');

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
    height: defaultStyles.container,
    paddingTop: defaultStyles.navBarHeight,
  },
  loadMore: {
    width: defaultStyles.bodyWidth - 32,
    marginTop: 32,
    marginBottom: 32,
    marginLeft: 16,
    alignItems: 'center',
  },
  loadMoreText: {
    fontFamily: 'Roboto-Regular', 
    color: defaultStyles.medium,
  },
  image: {
    marginTop: 60,
    alignSelf: 'center',
    width: 1290 * 0.15,
    height: 1380 * 0.15,
  },
  title: {
    marginTop: 16,
    fontSize: 16,
    fontFamily: 'Roboto-Bold',
    color: defaultStyles.dark,
    alignSelf: 'center',
  },
  text: {
    marginTop: 8,
    fontSize: 14,
    fontFamily: 'Roboto-Regular',
    color: defaultStyles.gray,
    alignSelf: 'center',
  },
});

module.exports = React.createClass({
  propTypes: {
    navigator: React.PropTypes.object,
    store: React.PropTypes.object,
    squashMessages: React.PropTypes.func,
    removeExpiredChats: React.PropTypes.func,
    verified: React.PropTypes.bool,
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
      chatId: rowData.chat.id
    });
  },
  onAvatarPress: function (imageUrl) {
    if (imageUrl) {
      this.props.navigator.push({
        name: 'enlarge photo',
        component: EnlargePhoto,
        hasSideMenu: false,
        photo: imageUrl,
      });
    }
  },
  onPressVideo: function (videoURL) {
    this.props.navigator.push({
      name: "video preview",
      component: VideoPreview,
      hasSideMenu: false,
      path: videoURL,
    });
  },
  onPressImage: function (imageUrl) {
    this.props.navigator.push({
      name: 'enlarge photo',
      component: EnlargePhoto,
      hasSideMenu: false,
      photo: imageUrl,
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
  renderChatRow: function(rowData) {
    return (
      <ChatCard
        rowData={rowData}
        onPressRow={this.onPressRow}
        onAvatarPress={this.onAvatarPress}
        onPressImage={this.onPressImage}
        onPressVideo={this.onPressVideo}
        squashMessages={this.props.squashMessages}
        onHashtagPress={this.onHashtagPress}
        onMentionPress={this.onMentionPress}
        removeExpiredChats={this.props.removeExpiredChats}
      />
    );
  },
  renderChatFooter: function () {
    return (
      <View style={Styles.loadMore}>

      </View>
    );
  },
  renderList: function () {
    return (
      <ListView
        dataSource={this.state.dataSource.cloneWithRows(this.props.store.messages)}
        renderRow={this.renderChatRow}
        renderFooter={this.renderChatFooter}
        automaticallyAdjustContentInsets={false}
      />
    );
  },
  renderEmpty: function () {
    return (
      <View>
        <Image
          style={Styles.image}
          source={require('../assets/empty.png')}
        />
        <Text style={Styles.title}>
          ABSOLUTELY NOTHING...
        </Text>
        <Text style={Styles.text}>
          Keep calm social jelly, start a conversation.
        </Text>
      </View>
    );
  },
  renderNotVerified: function () {
    return (
      <View>
        <Image
          style={Styles.image}
          source={require('../assets/jellycop.png')}
        />
        <Text style={Styles.title}>
          YOU HAVEN'T BEEN VERIFIED...
        </Text>
        <Text style={Styles.text}>
          Jelly Cop says "Verify your email to chat!"
        </Text>
      </View>
    );
  },
  render: function() {
    var showEmpty, notVerified;

    if (_.isEmpty(this.props.store.messages) && !this.props.store.loading) {
      showEmpty = true;
    }

    return (
      <View style={Styles.container}>
        {this.props.verified ? (showEmpty ? this.renderEmpty() : this.renderList()) : this.renderNotVerified()}
        {this.props.children}
      </View>
    );
  }
});