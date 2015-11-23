'use strict';

var React = require('react-native');
var _ = require('lodash');

var Avatar = require('../elements/avatar');
var Timer = require('../elements/timer');
var Counter = require('../elements/counter');
var PopImage = require('../elements/popImage');
var Message = require('../elements/message');

var defaultStyles = require('../styles');

var {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
} = React;

var Styles = StyleSheet.create({
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
    paddingBottom: 16,
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
    flex: 2.5,
    fontSize: 16,
    fontFamily: 'Roboto-Regular',
    color: defaultStyles.dark,
  },
  userHandle: {
    fontSize: 14,
    paddingTop: 2,
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
    paddingLeft: 16,
    paddingTop: 16,
  },
});

module.exports = React.createClass({
  propTypes: {
    onPressRow: React.PropTypes.func,
    onAvatarPress: React.PropTypes.func,
    onPressImage: React.PropTypes.func,
    rowData: React.PropTypes.object,
  },
  renderImage: function (imageURL) {
    return (
      <View style={Styles.rowImage}>
        <PopImage
          onPress={() => {this.props.onPressImage(imageURL)}}
          photo={imageURL}
        />
      </View>
    );
  },
  renderMessage: function (message) {
    return (
      <View style={Styles.rowMessage}>
        <Message message={message} />
      </View>
    );
  },
  render: function() {

    var rowData = this.props.rowData;

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

    var user = rowData.chat.get('createdBy');

    return (
      <TouchableOpacity activeOpacity={0.8} onPress={() => this.props.onPressRow(rowData)}>
        <View style={Styles.row}>
          <View style={Styles.rowHeader}>
            <Avatar
              onPress={() => this.props.onAvatarPress(rowData)}
              imageURL={user.attributes.image ? user.attributes.image.url() : null}
            />
            <View style={Styles.info}>
              <View style={Styles.infoBar}>
                <Text style={Styles.userName}>
                  {user.attributes.name}
                </Text>
                <Text style={Styles.userHandle}>
                  @{user.attributes.handle}
                </Text>
              </View>
              <View style={Styles.counts}>
                <Counter
                  score={rowData.score}
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
  }
});