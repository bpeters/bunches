'use strict';

var React = require('react-native');
var _ = require('lodash');

var Chat = require('../containers/chat');

var Timer = require('../elements/timer');

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
    marginBottom: 16,
  },
  row: {
    width: defaultStyles.bodyWidth - 32,
    marginTop: 16,
    marginLeft: 16,
  },
  rowHeader: {
    height: 72,
    backgroundColor: defaultStyles.white,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    borderTopColor: defaultStyles.light,
    borderLeftColor: defaultStyles.light,
    borderRightColor: defaultStyles.light,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
  },
  rowBody: {
    height: 72,
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
    marginLeft: 16,
    marginTop: 16,
    fontSize: 16,
    fontFamily: 'Roboto-Regular',
    color: defaultStyles.dark,
  },
  chatTitle: {
    marginLeft: 16,
    fontSize: 14,
    fontFamily: 'Roboto-Regular', 
    color: defaultStyles.medium,
  },
  captured: {
    height: 176,         
  },
});

module.exports = React.createClass({
  propTypes: {
    user: React.PropTypes.object,
    navigator: React.PropTypes.object,
    chats: React.PropTypes.array,
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
      name: "chat",
      component: Chat,
      hasSideMenu: true,
      chat: rowData,
    });
  },
  renderChatRow: function(rowData) {
    return (
      <TouchableOpacity onPress={() => this.onPressRow(rowData)}>
        <View style={Styles.row}>
          <View style={Styles.rowHeader}>
            <Text style={Styles.userName}>
              {rowData.createdBy.name}
            </Text>
            <Text style={Styles.chatTitle}>
              {rowData.name}
            </Text>
          </View>
          <Timer
            expiration={rowData.expirationDate}
            created={rowData.createdAt}
            color={defaultStyles.white}
          />
        </View>
      </TouchableOpacity>
    );    
  },
  render: function() {
    return (
      <View style={Styles.container}>
        <ListView
          dataSource={this.state.dataSource.cloneWithRows(this.props.chats)}
          renderRow={this.renderChatRow}
          automaticallyAdjustContentInsets={false}
        />
      </View>
    );
  }
});