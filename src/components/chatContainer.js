'use strict';

var React = require('react-native');
var _ = require('lodash');
var moment = require('moment');

var defaultStyles = require('../styles');

var {
  View,
  ScrollView,
  TextInput,
  StyleSheet, 
  Text,
  ListView,
  TouchableOpacity,
  Image,
} = React;

var Styles = StyleSheet.create({
  container: {
    height:defaultStyles.bodyHeight - defaultStyles.chatBarHeight - defaultStyles.navBarHeight,
  },
  row: {
    flex:1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    marginTop:10,
    paddingLeft: 10,
    paddingRight: 10,
  },
  thumbnail: {
    height: 60,
    width: 60,
    borderRadius: 60,
    justifyContent: 'center',
  },
  info: {
    flex:1,
    alignItems: 'stretch',
    flexDirection: 'column',
    paddingLeft: 10,
  },
  user: {
    flex:1,    
    justifyContent: 'flex-start',
    flexDirection: 'row',
  },
  name: {
    fontWeight: 'bold',
    color: defaultStyles.dark,
  },
  date: {
    flex:1,
    alignItems:'flex-start',
    paddingLeft: 10,
  },
  time: {
    color: defaultStyles.medium,
  },
  chat: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'stretch',
  },
  break: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 10,
    paddingRight: 10,
  },
  line: {
    height: 1,
    backgroundColor: defaultStyles.medium,
    flex:1,

  },
  breakView: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 5,
    paddingRight: 5,
  },
  breakText: {
    color: defaultStyles.medium,
    fontSize: 15,
  }
});

module.exports = React.createClass({
  propTypes: {
    user: React.PropTypes.object,
    messages: React.PropTypes.array,
  },
  getInitialState: function() {
    return {
      message: null,      
      dataSource: new ListView.DataSource({
        rowHasChanged: (r1, r2) => r1 !== r2
      }),
    };
  },
  renderChatRow: function(rowData) {
    if(rowData.breaker){
      return (
        <View style={Styles.break}>
          <View style={Styles.line}></View>
          <View style={Styles.breakView}>
            <Text style={Styles.breakText}>
              {rowData.breaker}
            </Text>
          </View>
          <View style={Styles.line}></View>
        </View>
      )

    } else {
      return (
        <View style={Styles.row}>
          <View style={Styles.image}>
            <Image
              style={Styles.thumbnail}
              source={{uri: _.get(rowData, 'user.imageURL') || 'http://img2.wikia.nocookie.net/__cb20130607025329/creepypasta/images/3/38/Avatar-blank.jpg'}}
            />
          </View>
          <View style={Styles.info}>
            <View style={Styles.user}>
              <Text style={Styles.name}>
                {_.get(rowData, 'user.name') || 'Anon'}
              </Text>
              <View style={Styles.date}>
                <Text style={Styles.time}>
                  {moment(rowData.time).fromNow()}
                </Text>
              </View>
            </View>
            <View style={Styles.chat}>
              <Text style={Styles.chatRowText}>
                {rowData.message}
              </Text>
            </View>
          </View>
        </View>
      );
    }
  },
  render: function() {
    return (
      <View style={Styles.container}>
        <ListView
          dataSource={this.state.dataSource.cloneWithRows(this.props.messages)}
          renderRow={this.renderChatRow}
          automaticallyAdjustContentInsets={false}
        />
      </View>
    );
  }
});