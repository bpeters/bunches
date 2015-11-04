'use strict';

var React = require('react-native');
var Parse = require('parse/react-native');
var ParseReact = require('parse-react/react-native');
var _ = require('lodash');

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
    height: defaultStyles.bodyHeight + defaultStyles.navBarHeight,
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
    return {
      bunches: (new Parse.Query('Bunch2User'))
        .equalTo('user', this.props.user)
        .ascending('name')
        .include("bunch")
    };
  },
  onPressRow: function(rowData) {
    console.log(rowData);
  },
  renderRow: function(rowData) {
    return (
      <TouchableOpacity onPress={() => this.onPressRow(rowData)}>
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

    dataBlob['Bunches'] = _.pluck(this.data.bunches, 'bunch');

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