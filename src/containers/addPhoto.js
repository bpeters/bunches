'use strict';

var React = require('react-native');
var {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  CameraRoll,
  Platform,
} = React;

var {
  Icon,
} = require('react-native-icons');

var Camera = require('react-native-camera');

var defaultStyles = require('../styles');

var Styles = StyleSheet.create({
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
  iconView: {
    position:'absolute',
    top: 20,
    right: 20,
    width: 30,
    height: 30,
  },
  icon: {
    width: 30,
    height: 30,
  },
});

module.exports = React.createClass({
  propTypes: {
    navigator: React.PropTypes.object,
    route: React.PropTypes.object,
    user: React.PropTypes.object,
  },
  getInitialState: function() {
    if (Platform.OS === 'android') {
      return {
        cameraType: '',
      };
    } else {
      return {
        cameraType: Camera.constants.Type.back,
      };
    }
  },
  onPressClose: function() {
    this.props.navigator.pop();
  },
  onCameraPressAndroid: function(){
    this.refs.cam.capture((image) => {
      this.props.route.onPhotoChange('data:image/jpeg;base64,' + image);
    });
  },
  onCameraPressIOS: function() {
    this.refs.cam.capture({
      target: Camera.constants.CaptureTarget.memory
    }, (err, image) => {
      this.props.route.onPhotoChange('data:image/jpeg;base64,' + image);
    });
  },
  render: function() {

    var onCapture;

    if (Platform.OS === 'android') {
      onCapture = this.onCameraPressAndroid;
    } else {
      onCapture = this.onCameraPressIOS;
    }

    return (
      <Camera 
        style={Styles.camera}
        ref="cam"
        type={this.state.cameraType}
      >
        <TouchableOpacity style={Styles.capture} onPress={onCapture} >
          <View style={Styles.captureButton} />
        </TouchableOpacity>
        <View style={Styles.iconView}>
          <TouchableOpacity onPress={this.onPressClose}>
            <Icon
              name='material|close'
              size={30}
              color='#ffffff'
              style={Styles.icon}
            />
          </TouchableOpacity>
        </View>
      </Camera>
    );
  }
});