'use strict';

var React = require('react-native');
var moment = require('moment');

var {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  TouchableHighlight,
  CameraRoll,
  TextInput
} = React;

var Camera = require('react-native-camera');

var IconButton = require('../elements/iconButton');

var defaultStyles = require('../styles');

var Styles = StyleSheet.create({
  overall: {
    flex: 1,
  },
  camera: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
  capture: {
    position: 'absolute',
    left: defaultStyles.bodyWidth / 2 - 40,
    bottom: 30, 
  },
  captureButton: {
    height: 90,
    width: 90,
    borderRadius: 90,
    borderWidth: 5,
    borderColor: defaultStyles.white,
    backgroundColor: defaultStyles.red,
    opacity: 0.7,
  },
  iconViewRight: {
    position:'absolute',
    top: 16,
    right: 16,
    width: 56,
    height: 56,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: defaultStyles.dark,
    opacity: 0.8,
    borderRadius: 28,
  },
  iconViewLeft: {
    position:'absolute',
    top: 16,
    left: 16,
    width: 56,
    height: 56,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: defaultStyles.dark,
    opacity: 0.8,
    borderRadius: 28,
  },
  preview: {
    width: defaultStyles.bodyWidth,
    height: defaultStyles.bodyHeight,
    backgroundColor: defaultStyles.dark,
  },
});

module.exports = React.createClass({
  propTypes: {
    navigator: React.PropTypes.object,
    route: React.PropTypes.object,
    store: React.PropTypes.object,
    actions: React.PropTypes.object,
  },
  getInitialState: function() {
    return {
      cameraType: Camera.constants.Type.back,
      preview: false,
      photo: '',
      message: '',
    };
  },
  onPressClose: function () {
    this.props.navigator.pop();
  },
  onCameraPress: function () {
    this.refs.cam.capture({
      target: Camera.constants.CaptureTarget.memory
    }, (err, image) => {
      this.setState({
        photo: image,
        preview: true
      });
    });
  },
  onCameraSwitch: function() {
    var state = this.state;
    state.cameraType = state.cameraType === Camera.constants.Type.back
      ? Camera.constants.Type.front : Camera.constants.Type.back;
    this.setState(state);
  },
  onPreviewClose: function(){
    this.setState({
      photo: '',
      preview: false
    });
  },
  onNewChat: function () {
    var Chat = require('./chat');

    this.props.actions.createChat(this.state.message, this.state.photo);

    var bunch = this.props.store.bunch;
    var expirationDate = moment().add(bunch.attributes.ttl, 'ms').format();

    this.props.navigator.replace({
      name: 'chat',
      component: Chat,
      hasSideMenu: true,
      newChat: {
        name: null,
        expirationDate: expirationDate,
        createdAt: Date.now(),
        photo: 'data:image/jpeg;base64,' + this.state.photo,
      },
    });
  },
  onNewMessage: function () {
    this.props.actions.createImageMessage(this.props.route.chat, this.state.photo);
    this.props.navigator.pop();
  },
  renderPreview: function () {
    return (
      <View style={Styles.container}>
        <Image
          source={{
            uri: 'data:image/jpeg;base64,' + this.state.photo,
          }}
          style={Styles.preview}
        />
        <View style={Styles.iconViewLeft}>
          <IconButton
            onPress={this.onPreviewClose}
            icon='material|close'
            size={30}
          />
        </View>
        <View style={Styles.iconViewRight}>
          <IconButton
            onPress={this.props.route.chat ? this.onNewMessage : this.onNewChat}
            icon='material|check'
            size={30}
          />
        </View>
      </View>
    );
  },
  renderCamera: function() {
    return (
      <Camera 
        style={Styles.camera}
        ref='cam'
        type={this.state.cameraType}
      >
        <TouchableOpacity style={Styles.capture} onPress={this.onCameraPress} >
          <View style={Styles.captureButton} />
        </TouchableOpacity>
        <View style={Styles.iconViewLeft}>
          <IconButton
            onPress={this.onPressClose}
            icon='material|close'
            size={30}
          />
        </View>
        <View style={Styles.iconViewRight}>
          <IconButton
            onPress={this.onCameraSwitch}
            icon='material|camera-switch'
            size={30}
          />
        </View>
      </Camera>
    );
  },
  render: function() {
    return (
      <View style={Styles.overall}>
        {this.state.preview ? this.renderPreview() : this.renderCamera()}
      </View>
    );
  }
});