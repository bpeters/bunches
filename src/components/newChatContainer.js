'use strict';

var React = require('react-native');
var _ = require('lodash');
var Firebase = require('firebase');

var ActionButton = require('../elements/actionButton');
var PopImage = require('../elements/popImage');

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
    height: defaultStyles.bodyHeight,
  },
  fields: {
    left: 16,
  },
  title: {
    fontSize: 12,
    fontFamily: 'Roboto-Regular',
    marginBottom: 12,
    marginTop: 44,
    color: defaultStyles.dark,
  },
  inputWrap: {
    borderBottomColor: defaultStyles.dark,
    borderBottomWidth: 1,
    width: defaultStyles.bodyWidth - 32,
  },
  input : {
    fontFamily: 'Roboto-light',
    height: 44,
    width: defaultStyles.bodyWidth - 32,
  },
  error: {
    color: defaultStyles.red,
  },
  actionButton: {
    position: 'absolute',
    top: 148,
    right: 16,
  },
});

module.exports = React.createClass({
  propTypes: {
    error: React.PropTypes.string,
    title: React.PropTypes.string,
    chat: React.PropTypes.string,
    photo: React.PropTypes.string,
    onTitleChange: React.PropTypes.func,
    onMessageChange: React.PropTypes.func,
    onAddPhoto: React.PropTypes.func,
    onPressImage: React.PropTypes.func,
  },
  render: function() {
    return (
      <View style={Styles.container}>
        <PopImage
          onPress={this.onPressImage}
          photo={this.props.photo}
        />
        <View style={Styles.fields}>
          <View style={Styles.field}>
            <Text style={Styles.title}>
              Title
            </Text>
            <View style={Styles.inputWrap}>
              <TextInput
                style={Styles.input}
                onChangeText={(title) => this.props.onTitleChange(title)}
                value={this.props.title}
                underlineColorAndroid="none"
              />
            </View>
          </View>
          <View style={Styles.field}>
            <Text style={Styles.title}>
              (Optional) First Message
            </Text>
            <View style={Styles.inputWrap}>
              <TextInput
                style={Styles.input}
                onChangeText={(message) => this.props.onMessageChange(message)}
                value={this.props.message}
                underlineColorAndroid="none"
              />
            </View>
          </View>
          <View style={Styles.field}>
            <Text style={Styles.error}>
              {this.props.error}
            </Text>
          </View>
        </View>
        <View style={Styles.actionButton}>
          <ActionButton onPress={this.props.onAddPhoto} />
        </View>
      </View>
    );
  }
});


