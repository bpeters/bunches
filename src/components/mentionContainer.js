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
    console.log(rowData);
  },
  renderChatRow: function(rowData) {
    return (
      <View>

      </View>
    );
  },
  render: function() {
    return (
      <View style={Styles.container}>
        <ListView
          dataSource={this.state.dataSource.cloneWithRows(this.props.store.users)}
          renderRow={this.renderChatRow}
          automaticallyAdjustContentInsets={false}
        />
      </View>
    );
  }
});