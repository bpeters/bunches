'use strict';

var React = require('react-native');

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
    width: defaultStyles.bodyWidth - 34,
    backgroundColor: defaultStyles.white,
    paddingTop: 12,
    paddingLeft: 16,
    paddingRight: 16,
    paddingBottom: 4,
  },
  hashtag: {
    borderRadius: 10,
    paddingLeft: 6,
    paddingRight: 6,
    marginLeft: 5,
  },
  hashtagText: {
    fontSize: 14,
    fontFamily: 'Roboto-Bold',
    color: defaultStyles.red,
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
    );
  }
});