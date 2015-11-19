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
    top: 20,
    right: 20,
    width: 30,
    height: 30,
  },
  iconViewLeft: {
    position:'absolute',
    top: 20,
    left: 20,
    width: 30,
    height: 30,
  },
  preview: {
    width: defaultStyles.bodyWidth,
    height: defaultStyles.bodyHeight,
    backgroundColor: defaultStyles.dark,
  },
  field: {
    position:'absolute',
    top: 76,
    left: 16,
  },
  title: {
    fontSize: 16,
    fontFamily: 'Roboto-Bold',
    marginBottom: 16,
    color: defaultStyles.white,
  },
  inputWrap: {
    borderBottomColor: defaultStyles.white,
    borderBottomWidth: 2,
    width: defaultStyles.bodyWidth - 32,
  },
  input : {
    fontFamily: 'Roboto-light',
    color: defaultStyles.white,
    height: 44,
    width: defaultStyles.bodyWidth - 32,
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
      cameraType: Camera.constants.Type.front,
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
      message: '',
      preview: false
    });
  },
  onComplete: function () {
    this.props.route.onPhotoChange('data:image/jpeg;base64,' + this.state.photo);
  },
  renderComplete: function () {
    return (
      <View style={Styles.iconViewRight}>
        <IconButton
          onPress={this.onComplete}
          icon='material|check'
          size={30}
        />
      </View>
    );
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
        <View style={Styles.field}>
          <Text style={Styles.title}>
            Add A Title
          </Text>
          <View style={Styles.inputWrap}>
            <TextInput
              style={Styles.input}
              onChangeText={(message) => this.setState({message})}
              value={this.state.message}
            />
          </View>
        </View>
        <View style={Styles.iconViewLeft}>
          <IconButton
            onPress={this.onPreviewClose}
            icon='material|close'
            size={30}
          />
        </View>
        {this.state.message ? this.renderComplete() : null}
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