'use strict';

var React = require('react-native');
var moment = require('moment');
var _ = require('lodash');

var {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  TouchableHighlight,
  TextInput,
  ScrollView,
  Animated,
} = React;

var Camera = require('react-native-camera');
var IconButton = require('../elements/iconButton');
var CameraRoll = require('rn-camera-roll').default;
//var VideoPreview = require('./videoPreviewAndroid');

var Video = require('react-native-video');



var defaultStyles = require('../styles');
var timer = 10000;

var Styles = StyleSheet.create({
  overall: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: defaultStyles.dark,
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
    backgroundColor: defaultStyles.blue,
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
  iconViewBottomLeft: {
    position:'absolute',
    bottom: 16,
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
  cameraRoll: {
    marginTop: 56 + 16,
    flex: 1,
  },
  imageGrid: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center'
  },
  image: {
    width: 100,
    height: 100,
    margin: 10,
    borderWidth: 2,
    borderColor: defaultStyles.medium,
    borderRadius: 4,
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
  },

  videoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  fullScreen: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  cameraHide: {
    height: 0,
    width: 0,
  },
  iconViewCenter: {
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.8,
  },
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
      cameraRoll: false,
      photo: '',
      message: '',
      images: [],
      isPhoto: true,
      buttonColor: defaultStyles.blue,
      pressAction: new Animated.Value(0),
      progressSize: 90,
      showButton: true,
      percent: 0,
      path: '',
      paused: true,
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
  onVideoRecordStart: function () {
    this.setState({
      showButton: false,
      isPhoto: false,
    });
    this.refs.cam.captureVideo();
    // setTimeout(() => {
    //   this.onVideoRecordStop();
    // }, timer);
    Animated.timing(this.state.pressAction, {
      duration: timer,
      toValue: 1
    }).start();
  },
  onVideoRecordStop: function () {
    clearTimeout();
    if(!this.state.isPhoto){
      this.refs.cam.captureVideo((path) => {
        this.setState({
          preview: true,
          path: path,
          showButton: true,
        })
      });
      Animated.timing(this.state.pressAction, {
        duration: timer,
        toValue: 0
      }).start();
    }
  },
  onVideoSave: function () {
    this.refs.cameraHide.saveVideo(this.state.path, (message) => {
      console.log(message);
      // this.setState({photo:image,preview:true});
    });
  },
  onPressClose: function () {
    this.props.navigator.pop();
  },
  onCameraPress: function () {
    this.refs.cam.capture((image) => {
      this.setState({photo:image,preview:true});
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
      path: '',
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
  onImagePress: function (image) {
    this.setState({photo:image,preview:true});
  },
  storeImages: function (data) {
    var assets = data.edges;
    var images = assets.map( asset => asset.node.image );

    this.setState({
      images: images,
    });
  },
  logImageError: function (err) {
    console.log(err);
  },
  onCameraRoll: function() {
    if (!this.state.cameraRoll) {
      var fetchParams = {
        first: 25,
      };
      CameraRoll.getPhotos(fetchParams, this.storeImages, this.logImageError);
    }
    this.setState({
      cameraRoll: !this.state.cameraRoll
    });
  },
  renderCameraRoll: function () {
    var images = _.map(this.state.images, (image, i) => {
      return (
        <TouchableOpacity key={i} onPress={ () => this.onImagePress(image.uri)} >
          <Image
            style={Styles.image}
            source={{ uri: 'data:image/jpeg;base64,' + image.uri}}
          />
        </TouchableOpacity>
      );
    });

    return (
      <View style={Styles.container}>
        <ScrollView style={Styles.cameraRoll}>
          <View style={Styles.imageGrid}>
            {images}
          </View>
        </ScrollView>
        <View style={Styles.iconViewLeft}>
          <IconButton
            onPress={this.onCameraRoll}
            icon='material|arrow-left'
            size={30}
          />
        </View>
      </View>
    );
  },
  renderVideoPreview: function () {
    return (
      <View style={Styles.videoContainer}>
        <Camera 
          style={Styles.cameraHide}
          ref='cameraHide'
        ></Camera>
        <TouchableOpacity
          style={Styles.fullScreen}
          onPress={() => {this.setState({paused: !this.state.paused})}}
        >
          <Video
            source={{uri: this.state.path}}
            style={Styles.fullScreen}
            rate={1.0}
            paused={this.state.paused}
            volume={1.0}
            muted={false}
            resizeMode={'cover'}
            repeat={true}
          />
        </TouchableOpacity>
        <View style={Styles.iconViewCenter}>
          <IconButton
            onPress={() => {this.setState({paused: !this.state.paused})}}
            icon={this.state.paused ? 'material|play' : 'material|pause'}
            size={100}
          />
        </View>
        <View style={Styles.iconViewLeft}>
          <IconButton
            onPress={this.onPreviewClose}
            icon='material|close'
            size={30}
          />
        </View>
        <View style={Styles.iconViewRight}>
          <IconButton
            onPress={this.props.route.chat ? this.onNewVideoMessage : this.onNewVideoChat}
            icon='material|check'
            size={30}
          />
        </View>
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
        <View style={Styles.iconViewBottomLeft}>
          <IconButton
            onPress={this.onCameraRoll}
            icon='ion|images'
            size={30}
          />
        </View>

      </View>
    );
  },
  render: function() {
    return (
      <View style={Styles.overall}>
        {this.state.preview ? 
          (this.state.path ? this.renderVideoPreview() : this.renderPreview() ) : 
          (this.state.cameraRoll ? this.renderCameraRoll() : this.renderCamera())
        }
      </View>
    );
  }
});