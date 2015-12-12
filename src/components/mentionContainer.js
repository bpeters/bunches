'use strict';

var React = require('react-native');
var _ = require('lodash');

var Chat = require('../containers/chat');
var EnlargePhoto = require('../containers/enlargePhoto');
var Profile = require('../containers/profile');
var ChatCard = require('../elements/chatCard');

var defaultStyles = require('../styles');

var {
  Icon,
} = require('react-native-icons');

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
    position: 'absolute',
    bottom: defaultStyles.chatBarHeight,
    width: defaultStyles.bodyWidth,
    borderTopColor: defaultStyles.dark,
    borderTopWidth: 1,
    borderBottomColor: defaultStyles.medium,
    borderBottomWidth: 1,
    backgroundColor: defaultStyles.dark,
  },
  row: {
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowText: {
    flexDirection: 'row',
    alignItems: 'flex-start'
  },
  handle: {
    fontFamily: 'Roboto-Bold',
    color: defaultStyles.light,
  },
  name: {
    marginLeft: 5,
    fontFamily: 'Roboto-Regular',
    color: defaultStyles.medium,
  },
  icon: {
    borderRadius: 9,
    backgroundColor: defaultStyles.blue,
    width: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

module.exports = React.createClass({
  propTypes: {
    store: React.PropTypes.object,
    onPressMention: React.PropTypes.func,
    onPressMentionClose: React.PropTypes.func,
  },
  getInitialState: function() {
    return {
      dataSource: new ListView.DataSource({
        rowHasChanged: (r1, r2) => r1 !== r2
      }),
    };
  },
  renderChatRow: function(rowData) {
    return (
      <TouchableOpacity onPress={() => this.props.onPressMention(rowData)}>
        <View style={Styles.row}>
          <View style={Styles.rowText}>
            <Text style={Styles.handle}>
              {'@' + rowData.handle}
            </Text>
            <Text style={Styles.name}>
              {rowData.name}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  },
  renderChatHeader: function() {
    return (
      <View style={Styles.row}>
        <TouchableOpacity onPress={() => this.props.onPressMentionClose()}>
          <Icon
            name='material|close'
            size={14}
            color={defaultStyles.white}
            style={Styles.icon}
          />
        </TouchableOpacity>
      </View>
    );
  },
  render: function() {
    return (
      <View style={Styles.container}>
        <ListView
          horizontal={true}
          dataSource={this.state.dataSource.cloneWithRows(this.props.store.mentions)}
          renderRow={this.renderChatRow}
          renderHeader={this.renderChatHeader}
          automaticallyAdjustContentInsets={false}
        />
      </View>
    );
  }
});