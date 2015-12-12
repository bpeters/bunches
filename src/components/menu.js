'use strict';

var React = require('react-native');
var _ = require('lodash');

var Settings = require('../containers/settings');
var Avatar = require('../elements/avatar');
var IconButton = require('../elements/iconButton');
var EnlargePhoto = require('../containers/enlargePhoto');

var defaultStyles = require('../styles');

var {
  View,
  ListView,
  TouchableOpacity,
  Text,
  StyleSheet,
} = React;

var Styles = StyleSheet.create({
  body: {
    backgroundColor: defaultStyles.dark,
    height: defaultStyles.window.height,
    width: defaultStyles.bodyWidth,
    paddingBottom: 16,
  },
  profile: {
    marginTop: 16,
    marginLeft: 16,
    width: defaultStyles.bodyWidth - 32 - 16 - 16 - 24,
    borderBottomColor: defaultStyles.darkHighlight,
    borderBottomWidth: 2,
    paddingBottom: 16,
  },
  profileInfo: {
    flexDirection: 'row',
  },
  info: {
    marginLeft: 16,
  },
  iconView: {
    flex: 1,
    alignItems: 'flex-end',
  },
  name: {
    fontSize: 14,
    fontFamily: 'Roboto-Medium',
    color: defaultStyles.gray,
    marginBottom: 8,
  },
  handle: {
    fontSize: 14,
    fontFamily: 'Roboto-Regular',
    color: defaultStyles.darkMedium,
  },
  list: {
    height: defaultStyles.window.height - 78,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
    width: defaultStyles.bodyWidth - 32 - 16 - 24,
    paddingLeft: 30,
  },
  rowText: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Roboto-Regular',
    color: defaultStyles.gray,
    justifyContent: 'center',
  },
  rowTextBold: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Roboto-Bold',
    color: defaultStyles.white,
  },
  rowCount: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: defaultStyles.blue,
    height: 20,
    borderRadius: 10,
    paddingLeft: 8,
    paddingRight: 8,
  },
  rowCountText: {
    fontSize: 14,
    fontFamily: 'Roboto-Bold',
    color: defaultStyles.white,
  },
  section: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
    paddingLeft: 20,
    marginTop: 20,
  },
  sectionText: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Roboto-Regular',
    color: defaultStyles.darkMedium,
  },
});

module.exports = React.createClass({
  propTypes: {
    navigator: React.PropTypes.object,
    actions: React.PropTypes.object,
    store: React.PropTypes.object,
  },
  getInitialState: function() {
    return {
      dataSource: new ListView.DataSource({
        rowHasChanged: (r1, r2) => r1 !== r2,
        sectionHeaderHasChanged: (s1, s2) => s1 !== s2
      }),
    };
  },
  onPress: function () {
    this.props.navigator.push({
      name: 'settings',
      component: Settings,
      hasSideMenu: true,
    });
  },
  onPressRow: function (rowData) {
    var Bunch = require('../containers/bunch');
    var Chat = require('../containers/chat');

    if (rowData.className === 'Bunch') {
      this.props.navigator.replace({
        name: 'bunch',
        component: Bunch,
        hasSideMenu: true,
      });
    } else {
      this.props.navigator.push({
        name: 'chat',
        component: Chat,
        hasSideMenu: true,
        chatId: rowData.id,
      });

      this.props.actions.clearNotifications(rowData.id);
    }
  },
  onAvatarPress: function () {
    if (this.props.store.user.image) {

      var imageURL = this.props.store.user.image.url();

      this.props.navigator.push({
        name: "enlarge photo",
        component: EnlargePhoto,
        hasSideMenu: false,
        photo: imageURL,
      });
    }
  },
  renderBunch: function (rowData) {
    var name = _.get(rowData, 'attributes.name') || _.get(rowData, 'name');

    return (
      <TouchableOpacity onPress={() => {
        if (rowData.onPress) {
          rowData.onPress();
        } else {
          this.onPressRow(rowData);
        }
      }}>
        <View>
          <View style={Styles.row}>
            <Text style={Styles.rowText}>
              {name}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  },
  renderCount: function (newCount) {
    return (
      <View style={Styles.rowCount}>
        <Text style={Styles.rowCountText}>
          {newCount}
        </Text>
      </View>
    );
  },
  renderChat: function (rowData) {
    var name = _.get(rowData, 'chat.attributes.name');
    var newCount = _.get(rowData, 'newCount');

    return (
      <TouchableOpacity onPress={() => {
        if (rowData.onPress) {
          rowData.onPress();
        } else {
          this.onPressRow(rowData.chat);
        }
      }}>
        <View>
          <View style={Styles.row}>
            <Text style={rowData.mention ? Styles.rowTextBold : Styles.rowText }>
              {name}
            </Text>
            {newCount ? this.renderCount(newCount) : null}
          </View>
        </View>
      </TouchableOpacity>
    );
  },
  renderRow: function (rowData) {
    if (_.get(rowData, 'chat')) {
      return this.renderChat(rowData);
    } else {
      return this.renderBunch(rowData);
    }
  },
  renderSectionHeader: function(sectionData, sectionID) {
    return (
      <View style={Styles.section}>
        <Text style={Styles.sectionText}>
          {sectionID}
        </Text>
      </View>
    );
  },
  render: function() {
    var dataBlob = {}

    var user = this.props.store.user;

    dataBlob['Bunches'] = this.props.store.bunches;

    dataBlob['Chats'] = _.filter(this.props.store.messages, (message) => {
      var userIds = _.pluck(message.messages, 'uid');
      return _.indexOf(userIds, (user.objectId || user.id)) >= 0;
    });

    return (
      <View style={Styles.body}>
        <View style={Styles.profile}>
          <View style={Styles.profileInfo}>
            <Avatar
              onPress={() => this.onAvatarPress()}
              imageURL={_.get(user, 'image') ? user.image.url() : ''}
              online={true}
            />
            <View style={Styles.info}>
              <Text style={Styles.name}>
                {_.get(user, 'name')}
              </Text>
              <Text style={Styles.handle}>
                {'@' + _.get(user, 'handle')}
              </Text>
            </View>
            <View style={Styles.iconView}>
              <IconButton
                onPress={this.onPress}
                icon='material|settings'
                size={24}
                color={defaultStyles.darkMedium}
              />
            </View>
          </View>
        </View>
        <ListView
          style={Styles.list}
          dataSource={this.state.dataSource.cloneWithRowsAndSections(dataBlob)}
          renderRow={this.renderRow}
          renderSectionHeader={this.renderSectionHeader}
          automaticallyAdjustContentInsets={false}
        />
      </View>
    );
  }
});