'use strict';

var React = require('react-native');
var Parse = require('parse/react-native');
var ParseReact = require('parse-react/react-native');
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
  mixins: [ParseReact.Mixin],
  propTypes: {
    navigator: React.PropTypes.object,
    user: React.PropTypes.object,
  },
  getInitialState: function() {
    return {
      dataSource: new ListView.DataSource({
        rowHasChanged: (r1, r2) => r1 !== r2,
        sectionHeaderHasChanged: (s1, s2) => s1 !== s2
      }),
    };
  },
  observe: function() {
    var now = moment().toDate();

    return {
      bunches: (new Parse.Query('Bunch2User'))
        .equalTo('user', this.props.user)
        .ascending('name')
        .include("bunch"),
      chatsCreated: (new Parse.Query('Chat'))
        .equalTo('createdBy', this.props.user)
        .equalTo('isDead', false)
        .greaterThan("expirationDate", now),
      chatsIn: (new Parse.Query('Chat2User'))
        .equalTo('user', this.props.user)
        .include('chat')
    };
  },
  onPressRow: function(rowData) {
    console.log(rowData);
  },
  renderRow: function(rowData) {
    return (
      <TouchableOpacity onPress={() => {this.onPressRow(rowData)}}>
        <View>
          <View style={Styles.row}>
            <Text style={Styles.rowText}>
              {rowData.name}
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

    var chatsCreatedIds = _.pluck(this.data.chatsCreated, 'objectId');

    dataBlob['Bunches'] = _.pluck(this.data.bunches, 'bunch');
    dataBlob['Chats Started'] = this.data.chatsCreated;
    
    /*dataBlob['Chats In'] = _.chain(this.data.chatsIn)
      .filter((chats) => {
        return !_.indexOf(chatsCreatedIds, chats.chat.objectId);
      })
      .pluck('chat')*/

    console.log(this.data.chatsIn);

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