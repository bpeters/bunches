'use strict';

var React = require('react-native');
var _ = require('lodash');

var defaultStyles = require('../styles');

var {
  View,
  Text,
  StyleSheet,
  ListView,
  TouchableOpacity,
} = React;

var Styles = StyleSheet.create({
  container: {
    width: defaultStyles.bodyWidth - 32,
    backgroundColor: defaultStyles.white,
    padding: 10,
  },
  hashtag: {
    backgroundColor: defaultStyles.red,
    borderRadius: 10,
    paddingTop: 3,
    paddingBottom: 3,
    paddingLeft: 6,
    paddingRight: 6,
    marginLeft: 5,
  },
  hashtagText: {
    fontSize: 12,
    fontFamily: 'Roboto-Bold',
    color: defaultStyles.white,
  },
});

module.exports = React.createClass({
  propTypes: {
    messages: React.PropTypes.array,
    onHashtagPress: React.PropTypes.func,
  },
  getInitialState: function() {
    return {
      dataSource: new ListView.DataSource({
        rowHasChanged: (r1, r2) => r1 !== r2
      }),
    };
  },
  renderTag: function (rowData) {
    return (
      <TouchableOpacity onPress={() => {this.props.onHashtagPress(rowData)}}>
        <View style={Styles.hashtag}>
          <Text style={Styles.hashtagText}>
            {rowData}
          </Text>
        </View>
      </TouchableOpacity>
    );
  },
  render: function() {
    return (
      <View style={Styles.container}>
        <ListView
          horizontal={true}
          dataSource={this.state.dataSource.cloneWithRows(this.props.messages)}
          renderRow={this.renderTag}
          showsHorizontalScrollIndicator={false}
          automaticallyAdjustContentInsets={false}
        />
      </View>
    )
  }
});