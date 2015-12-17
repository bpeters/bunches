'use strict';

var React = require('react-native');
var _ = require('lodash');

var Chat = require('../containers/chat');
var EnlargePhoto = require('../containers/enlargePhoto');
var Profile = require('../containers/profile');
var ChatCard = require('../elements/chatCard');
var Hashtag = require('../containers/hashtag');

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
    height: defaultStyles.bodyHeight - defaultStyles.chatBarHeight,
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
});

module.exports = React.createClass({
  propTypes: {
    navigator: React.PropTypes.object,
    store: React.PropTypes.object,
    squashMessages: React.PropTypes.func,
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
  onAvatarPress: function (rowData) {
    var user = rowData.chat.get('createdBy');

    this.props.navigator.push({
      name: 'profile',
      component: Profile,
      handle: user.attributes.handle,
    });
  },
  onPressImage: function (imageURL) {
    this.props.navigator.push({
      name: 'enlarge photo',
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
  onMentionPress: function (mention) {
    var handle = _.trim(mention, '@');

    this.props.navigator.push({
      name: 'profile',
      component: Profile,
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
        squashMessages={this.props.squashMessages}
        onHashtagPress={this.onHashtagPress}
        onMentionPress={this.onMentionPress}
      />
    );
  },
  renderChatFooter: function () {
    return (
      <View style={Styles.loadMore}>

      </View>
    );
  },
  render: function() {
    return (
      <View style={Styles.container}>
        <ListView
          dataSource={this.state.dataSource.cloneWithRows(this.props.store.messages)}
          renderRow={this.renderChatRow}
          renderFooter={this.renderChatFooter}
          automaticallyAdjustContentInsets={false}
        />
        {this.props.children}
      </View>
    );
  }
});