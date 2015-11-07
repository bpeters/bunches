'use strict';

var React = require('react-native');
var _ = require('lodash');
var Firebase = require('firebase');
//var ChatInput = require('../elements/chatInput');
var Dimensions = require('Dimensions');
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
  channelImage: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    marginTop: 10,
    paddingLeft: 20,
  },
  thumbnail: {
    flex: 1,
    height: 60,
    width: 60,
    borderRadius: 60,
    justifyContent: 'center',
    borderColor: defaultStyles.light,
    borderLeftWidth: 2,
  },
  content: {
    marginTop:10,
    flex:1,
    flexDirection:"column",
  },  
  chatUser: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    paddingLeft: 20,
  },
  chatUserText: {
    flex: 1,
    fontSize: 14,
    color: defaultStyles.dark,
    fontWeight: 'bold',
    flexDirection:"column",
  },
  chatRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
    paddingLeft: 20,
  },
  chatRowText: {
    flex: 1,
    fontSize: 14,
    color: defaultStyles.dark,
    paddingLeft: 20,
    paddingRight: 20,
    flexDirection:"column",
  },
  row: {
    flex:1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },

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
      showChat: true,
      showEnrolled: false,
      showTutors: false,
      showBunches: false,
      people: [],
    };
  },



  renderChatRow: function(rowData) {
    return (
      <TouchableOpacity>
        <View style={Styles.row}>

        
          <View style={Styles.channelImage}>
            <Image
              style={Styles.thumbnail}
              source={{uri: rowData.thumbnail || 'http://img2.wikia.nocookie.net/__cb20130607025329/creepypasta/images/3/38/Avatar-blank.jpg'}}
            />
          </View>

          <View style={Styles.content}>
            <Text style={Styles.chatUserText}>
              {rowData.uid || '12345'}
            </Text>

            <View style={Styles.chatUser}>
              <Text style={Styles.chatUserText}>
                {rowData.username || 'Anon'}
              </Text>
            </View>


            <View style={Styles.chatRow}>
              <Text style={Styles.chatRowText}>
                {rowData.text}
              </Text>
            </View>




          </View>


          






        
        </View>
      </TouchableOpacity>
    );
  },
  renderChat: function() {
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
          
        </View>

    );
  }











});