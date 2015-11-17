'use strict';

var React = require('react-native');
var _ = require('lodash');
var moment = require('moment');

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
    backgroundColor: defaultStyles.medium,
    height: defaultStyles.window.height,
    width: defaultStyles.bodyWidth,
  },
  list: {
    marginTop: 0,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
    paddingLeft: 30,
  },
  rowText: {
    flex: 1,
    fontSize: 14,
    color: defaultStyles.light,
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
    fontWeight: 'bold',
    color: defaultStyles.light,
  },
});

module.exports= React.createClass({
  propTypes: {
    navigator: React.PropTypes.object,
    user: React.PropTypes.object,
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
  onPressRow: function(rowData) {
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
    }
  },
  renderRow: function(rowData) {
    var name = rowData.attributes.name;

    return (
      <TouchableOpacity onPress={() => {this.onPressRow(rowData)}}>
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

    dataBlob['Bunches'] = [this.props.store.bunch];

    dataBlob['Chats'] = _.chain(this.props.store.userChats)
      .map((chat) => {
        return chat.get('chat');
      })
      .uniq((chat) => {
        return chat.id
      })
      .value();

    return (
      <View style={Styles.body}>
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