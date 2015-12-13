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
  CameraRoll,
  NativeModules,
  ScrollView,
} = React;

var Camera = require('react-native-camera');

var IconButton = require('../elements/iconButton');

var defaultStyles = require('../styles');

var Styles = StyleSheet.create({
  overall: {
    flex: 1,
  },
  container: {
    backgroundColor: defaultStyles.dark,
    flex: 1,
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
  iconViewTopRight: {
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
  iconViewTopLeft: {
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
    var cameraOrientation = this.props.route.orientation === 'back' ? Camera.constants.Type.back : Camera.constants.Type.front;
    return {
      cameraType: cameraOrientation,
      preview: false,
      cameraRoll: false,
      photo: '',
      message: '',
      images: [],
    };
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
  onPressClose: function () {
    this.props.navigator.pop();
  },
  onCameraPress: function () {
    this.refs.cam.capture({
      target: Camera.constants.CaptureTarget.memory
    }, (err, image) => {
      this.setState({
        photo: 'data:image/jpeg;base64,' + image,
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
        photo: this.state.photo,
      },
    });
  },
  onNewMessage: function () {
    this.props.actions.createImageMessage(this.props.route.chat, this.state.photo);
    this.props.navigator.pop();
  },
  onImagePress: function (data) {
    var image = data.uri.replace('file://', '');

    NativeModules.ReadImageData.readImage(image, (image64) => {
      this.setState({
        photo: 'data:image/jpeg;base64,' + image64,
        preview: true
      });
    });
  },
  renderPreview: function () {
    return (
      <View style={Styles.container}>
        <Image
          source={{
            uri: this.state.photo,
          }}
          style={Styles.preview}
        />
        <View style={Styles.iconViewTopLeft}>
          <IconButton
            onPress={this.onPreviewClose}
            icon='material|close'
            size={30}
          />
        </View>
        <View style={Styles.iconViewTopRight}>
          <IconButton
            onPress={this.props.route.chat ? this.onNewMessage : this.onNewChat}
            icon='material|check'
            size={30}
          />
        </View>
      </View>
    );
  },
  renderCameraRoll: function () {
    var images = _.map(this.state.images, (image, i) => {
      return (
        <TouchableOpacity key={i} onPress={ () => this.onImagePress(image)} >
          <Image
            style={Styles.image}
            source={{ uri: image.uri }}
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
        <View style={Styles.iconViewTopLeft}>
          <IconButton
            onPress={this.onCameraRoll}
            icon='material|arrow-left'
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
        <View style={Styles.iconViewTopLeft}>
          <IconButton
            onPress={this.onPressClose}
            icon='material|close'
            size={30}
          />
        </View>
        <View style={Styles.iconViewTopRight}>
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
      </Camera>
    );
  },
  render: function() {
    return (
      <View style={Styles.overall}>
        {this.state.preview ? this.renderPreview() : (this.state.cameraRoll ? this.renderCameraRoll() : this.renderCamera())}
      </View>
    );
  }
});