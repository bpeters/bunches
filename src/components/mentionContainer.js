'use strict';

var React = require('react-native');
var _ = require('lodash');

var Chat = require('../containers/chat');
var EnlargePhoto = require('../containers/enlargePhoto');
var Profile = require('../containers/profile');
var ChatCard = require('../elements/chatCard');

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
    position: 'absolute',
    bottom: defaultStyles.chatBarHeight,
    width: defaultStyles.bodyWidth,
    borderTopColor: defaultStyles.dark,
    borderTopWidth: 1,
    backgroundColor: defaultStyles.white,
  },
  row: {
    width: defaultStyles.bodyWidth,
    borderBottomColor: defaultStyles.medium,
    borderBottomWidth: 1,
    padding: 8,
  },
  rowText: {
    flexDirection: 'row',
    alignItems: 'flex-start'
  },
  handle: {
    fontFamily: 'Roboto-Bold',
    color: defaultStyles.dark,
  },
  name: {
    marginLeft: 16,
    fontFamily: 'Roboto-Regular',
    color: defaultStyles.medium,
  },
  loadMore: {
    marginTop: 16,
    marginBottom: 16,
  },
});

module.exports = React.createClass({
  propTypes: {
    store: React.PropTypes.object,
    onPressMention: React.PropTypes.func,
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
          dataSource={this.state.dataSource.cloneWithRows(this.props.store.users)}
          renderRow={this.renderChatRow}
          renderFooter={this.renderChatFooter}
          automaticallyAdjustContentInsets={false}
        />
      </View>
    );
  }
});