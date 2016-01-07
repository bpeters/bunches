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
  TextInput,
  Animated,
} = React;

var Camera = require('react-native-camera');

var IconButton = require('../elements/iconButton');

var defaultStyles = require('../styles');

var timer = 5000;

var Styles = StyleSheet.create({
  overall: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000',
    borderWidth:1,
    borderColor:'#000000'
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
    borderRadius: 45,
    borderWidth: 5,
    borderColor: defaultStyles.white,
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
  animated: {
    height: 90,
    width: 90,
    borderRadius: 45,
    borderWidth: 5,
    borderColor: defaultStyles.white,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 1,
  },
  fill: {
    backgroundColor: defaultStyles.red,
    borderRadius: 45,
  }
});

module.exports = React.createClass({
  propTypes: {
    navigator: React.PropTypes.object,
    route: React.PropTypes.object,
    store: React.PropTypes.object,
    actions: React.PropTypes.object,
    user: React.PropTypes.object,
  },
  getInitialState: function() {
    var cameraOrientation = this.props.route.orientation === 'back' ? Camera.constants.Type.back : Camera.constants.Type.front;
    return {
      cameraType: cameraOrientation,
      preview: false,
      photo: '',
      message: '',
      isPhoto: true,
      buttonColor: defaultStyles.blue,
      pressAction: new Animated.Value(0),
      progressSize: 90,
      showButton: true,
    };
  },
  componentWillMount: function() {
    this._value = 0;
    this.state.pressAction.addListener((v) => this._value = v.value);
  },
  getButtonSize: function(e) {
    this.setState({
      progressSize: e.nativeEvent.layout.width - 10,
    });
  },
  getProgressSize: function() {
    var size = this.state.pressAction.interpolate({
      inputRange: [0, 1],
      outputRange: [this.state.progressSize, 0]
    });
    return {
      width: size,
      height: size,
    }
  },
  onPressClose: function () {
    this.props.navigator.pop();
  },
  onCameraPress: function () {
    this.refs.cam.capture((image) => {
      this.setState({photo:image,preview:true});
    });
  },
  onVideoRecordStart: function () {
    this.setState({
      showButton: false,
      isPhoto: false,
    });
    this.refs.cam.captureVideo();
    setTimeout(() => {
      this.onVideoRecordStop();
    }, timer);
    Animated.timing(this.state.pressAction, {
      duration: timer,
      toValue: 1
    }).start();
  },
  onVideoRecordStop: function () {
    clearTimeout();
    if(!this.state.isPhoto){
      this.refs.cam.captureVideo();
      this.setState({
        showButton: true,
        isPhoto: true,
      });
      Animated.timing(this.state.pressAction, {
        duration: timer,
        toValue: 0
      }).start();
    }
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
  onNewChat: function () {
    var Chat = require('./chat');

    this.props.actions.createChat(this.state.message, this.state.photo);

    var bunch = this.props.store.bunch;
    var expirationDate = moment().add(bunch.attributes.ttl, 'ms').format();

    this.props.navigator.replace({
      name: 'chat',
      component: Chat,
      hasSideMenu: false,
      newChat: {
        name: null,
        expirationDate: expirationDate,
        createdAt: Date.now(),
        photo: this.state.photo,
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
  renderCaptureButton: function() {
    return (
      <View style={[Styles.captureButton, {
        backgroundColor: this.state.buttonColor,
      }]}
      onLayout={this.getButtonSize}>
      </View>
    )
  },
  renderProgress: function() {
    return (
      <View style={Styles.animated}>
        <Animated.View style={[Styles.fill, this.getProgressSize()]} />
      </View>
    )
  },
  renderCamera: function() {
    return (
      <View style={Styles.container}>
      <Camera 
        style={Styles.camera}
        ref='cam'
        type={this.state.cameraType}
        captureTarget={Camera.constants.CaptureTarget.memory}
      ></Camera>
      <TouchableOpacity 
        style={Styles.capture} 
        onPress={this.onCameraPress} 
        onLongPress={this.onVideoRecordStart}
        onPressOut={this.onVideoRecordStop}
      >
        {this.state.showButton ? this.renderCaptureButton() : this.renderProgress()}
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
    </View>
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