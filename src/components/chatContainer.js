'use strict';

var React = require('react-native');
var _ = require('lodash');
var Firebase = require('firebase');

var {
  Icon,
} = require('react-native-icons');

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
    height:defaultStyles.bodyHeight,
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
              source={{uri: rowData.thumbnail || 'http://img2.wikia.nocookie.net/__cb20130607025329/creepypasta/images/3/38/Avatar-blank.jpg'}}
            />
          </View>
          <View style={Styles.info}>                
            <View style={Styles.user}>
              <Text style={Styles.name}>
                {rowData.username || 'Anon'}
              </Text>
              <View style={Styles.date}>
                <Text style={Styles.time}>
                  {rowData.time}
                </Text>
              </View>              
            </View>      
            <View style={Styles.chat}>
              <Text style={Styles.chatRowText}>
                {rowData.text}
              </Text>
            </View>
          </View>
        </View>
      );
    }

    
  },
  renderChat: function() {
    // var item = [{
    //   "text" : "hello billy, this is my dhjl kljd gldjshg kgdashdg skgsd dgjdgsa jgslkj gsdalkjgdlk dsljgdslk dgslkjgdsk jgjsdalg jgsdlkjdgaslkj gl jdgslkjg dsljgsdlkjdgslajl",
    //   "thumbnail" : "https://s-media-cache-ak0.pinimg.com/736x/4a/35/bb/4a35bb4d02f4fca2a3bd2826a2432ed3.jpg",
    //   "time" : 1446930189475,
    //   "uid" : "111",
    //   "username" : "The Devil"
    // }];
    // var a = new Date(item[0].time);
    // console.log(a);
    // var b = a.toLocaleTimeString('en-US', {hour: '2-digit', minute: '2-digit', hour12: true});
    // console.log(b);
    // var item = [{'breaker':'Today'}];

    return (
      <View style={Styles.container}>
        <ListView
          dataSource={this.state.dataSource.cloneWithRows(this.props.messages)}
          renderRow={this.renderChatRow}
          automaticallyAdjustContentInsets={false}
        />
      </View>
    );
  },
  render: function() {
    return (  
      <View style={Styles.container}>
        {this.renderChat()}
      </View>
    );
  }
});