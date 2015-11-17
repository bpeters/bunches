'use strict';

var React = require('react-native');
var {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  TouchableHighlight,
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
  iconViewSwitch: {
    position:'absolute',
    top: 20,
    left: 20,
    width: 30,
    height: 30,
  },

  icon: {
    width: 30,
    height: 30,
  },



  captured: {
        width: 200,
        height: 400
    },
    videoButton: {
        position: 'absolute',
        height: 50,
        left: 50, top: 120, right: 50,
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
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
        cameraType: Camera.constants.Type.back,
        capturedBase64:'',
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
  onCameraSwitch: function(){   
    var state = this.state;
    state.cameraType = state.cameraType === Camera.constants.Type.back
      ? Camera.constants.Type.front : Camera.constants.Type.back;
    this.setState(state);
  },


  onVideoRecord: function(){
    this.refs.cam.captureVideo((image) => {
      console.log(image);
      // this.props.route.onPhotoChange(image);
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
    if(Platform.OS='android'){
      var component = this;
      return (
        <View style={Styles.container}>
          <Camera 
            style={Styles.camera} 
            ref="cam"
            type={this.state.cameraType}
            captureTarget={Camera.constants.CaptureTarget.memory}
          >
          </Camera>


          <TouchableOpacity 
            style={Styles.capture} 
            delayOnPressIn={1000}
            onPressIn={this.onVideoRecord}
            onPressOut={this.onVideoRecord}
            >
            <View style={Styles.captureButton} />
          </TouchableOpacity>


          <View style={Styles.iconViewSwitch}>
            <TouchableOpacity onPress={this.onCameraSwitch}>
              <Icon
                name='material|camera-switch'
                size={30}
                color='#ffffff'
                style={Styles.icon}
              />
            </TouchableOpacity>  
          </View>
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


          <TouchableOpacity style={Styles.videoButton} onPress={function() {
                component.refs.cam.captureVideo().then(function(capturedBase64) {
                    console.log(capturedBase64);
                    // component.setState({ capturedBase64 });
                    // setTimeout(() => component.setState({ capturedBase64: '' }), 5000);
                });
            }}>
                <Text style={{textAlign: 'center'}}>Capture Video</Text>
            </TouchableOpacity>
        </View>
      );
  } else {
    return (
      <Camera 
        style={Styles.camera}
        ref="cam"
        type={this.state.cameraType}
      >
        <TouchableOpacity style={Styles.capture} onPress={this.onCameraPressIOS} >
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