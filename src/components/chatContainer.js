'use strict';

var React = require('react-native');
var _ = require('lodash');
var moment = require('moment');

var Avatar = require('../elements/avatar');
var PopImage = require('../elements/popImage');
var EnlargePhoto = require('../containers/enlargePhoto');
var InvertibleScrollView = require('react-native-invertible-scroll-view');
var Profile = require('../containers/profile');

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
    paddingTop: defaultStyles.navBarHeight + defaultStyles.navBarHeight,
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
    fontWeight: 'bold',
    color: defaultStyles.dark,
    fontFamily: 'Roboto-Regular',
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
  chatText: {
    color: defaultStyles.dark,
    fontFamily: 'Roboto-Light',
    fontSize: 14,
    lineHeight: 18,
  },
  break: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 10,
    paddingRight: 10,
  },
  line: {
    height: 1,
    backgroundColor: defaultStyles.medium,
    flex:1,
  },
  breakView: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 5,
    paddingRight: 5,
  },
  breakText: {
    color: defaultStyles.medium,
    fontSize: 15,
  },
  imageWrap: {
    paddingTop: 16,
    width: defaultStyles.bodyWidth - 16 - 40 - 16 - 16,
  }
});

module.exports = React.createClass({
  propTypes: {
    user: React.PropTypes.object,
    messages: React.PropTypes.array,
    getProfileChats: React.PropTypes.func,
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
  onAvatarPress: function (rowData) {

    this.props.queryUser(rowData.uid)
      .then((user) => {

        this.props.getProfileChats(user);

        this.props.navigator.push({
          name: 'profile',
          component: Profile,
          name: user.attributes.name,
          handle: user.attributes.handle,
        });
      })
  },
  onPressImage: function (imageURL) {
    this.props.navigator.push({
      name: "enlarge photo",
      component: EnlargePhoto,
      hasSideMenu: false,
      photo: imageURL,
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
        <Text style={Styles.chatText}>
          {message}
        </Text>
      </View>
    );
  },
  renderNew: function (message) {
    return (
      <View style={Styles.chat}>
        <Text style={Styles.chatText}>
          Started Chat
        </Text>
      </View>
    );
  },
  renderChatRow: function(rowData) {
    if(rowData.breaker){
      return (
        <View style={Styles.break}>
          <View style={Styles.line}></View>
          <View style={Styles.breakView}>
            <Text style={Styles.breakText}>
              {rowData.breaker}
            </Text>
          </View>
          <View style={Styles.line}></View>
        </View>
      );
    } else {
      return (
        <View style={Styles.row}>
          <Avatar
            onPress={() => this.onAvatarPress(rowData)}
            imageURL={rowData.userImageURL}
          />
          <View style={Styles.info}>
            <View style={Styles.user}>
              <Text style={Styles.name}>
                {rowData.name || 'Anon'}
              </Text>
              <View style={Styles.date}>
                <Text style={Styles.time}>
                  {moment(rowData.time).format("h:mm a")}
                </Text>
              </View>
            </View>
            {rowData.message ? this.renderMessage(rowData.message) : this.renderNew()}
            {rowData.imageURL ? this.renderImage(rowData.imageURL) : null}
          </View>
        </View>
      );
    }
  },
  renderChatFooter: function () {
    return (
      <View style={Styles.gap} />
    );
  },
  render: function() {
    return (
      <View style={Styles.container}>
        <ListView
          renderScrollComponent={props => <InvertibleScrollView {...props} inverted />}
          dataSource={this.state.dataSource.cloneWithRows(this.props.messages)}
          renderRow={this.renderChatRow}
          renderFooter={this.renderChatFooter}
        />
        {this.props.children}
      </View>
    );
  }
});