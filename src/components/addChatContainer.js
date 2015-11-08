'use strict';

var React = require('react-native');
var _ = require('lodash');
var Firebase = require('firebase');

var AddPhotoButton = require('../elements/addPhotoButton');
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
    height:defaultStyles.bodyHeight + defaultStyles.chatBarHeight,
  },
  imagePreview: {
    height: 200,
    backgroundColor: "#009688",
    flex:1,
    
  },
  textPreview: {
    height: defaultStyles.bodyHeight + defaultStyles.chatBarHeight-200,
  },
  imageTagLine: {
    top: 160,
    left: 20,
    color: defaultStyles.light,
    fontSize: 15,
    fontFamily: 'Roboto-light',
  },
  title: {
    paddingTop: 20,
  },
  header: {
    left: 20,
    fontFamily: 'Roboto-light',
  },
  input : {
    left: 20,
    fontFamily: 'Roboto-light',
    color: defaultStyles.dark,

    width: defaultStyles.bodyWidth - 58,
    borderBottomWidth: 0,
    borderWidth: 0,
  },

});

module.exports = React.createClass({
  propTypes: {
    user: React.PropTypes.object,
    messages: React.PropTypes.array,
    title: React.PropTypes.string,
    firstChat: React.PropTypes.string,
  },
  getInitialState: function() {
    return {
      title: "poop",
      firstChat: "shit",
    };
  },
  render: function() {
    return (    

        <View style={Styles.container}>
          
          <View style={Styles.imagePreview}>
            <Text style={Styles.imageTagLine}>
              (Optional) Upload Photo
            </Text>
          </View>
          

          <View style={Styles.textPreview}>

            <View style={Styles.title}>
              <Text style={Styles.header}>
                Title
              </Text>
              <TextInput
                style={Styles.input}
                onChangeText={(title) => this.setState({title})}
                value={this.state.title}
              />
            </View>

            <View style={Styles.title}>
              <Text style={Styles.header}>
                (Optional) First Chat
              </Text>
              <TextInput
                style={Styles.input}
                onChangeText={(firstChat) => this.setState({firstChat})}
                value={this.state.firstChat}
                multiline={false}
                numberOfLines={1}
              />
            </View>

          </View>

          <AddPhotoButton
            user={this.props.user}
            onPress={this.onChatButtonPress}
          />

        </View>

    );
  }











});