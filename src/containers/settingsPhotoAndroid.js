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
} = React;

var Camera = require('react-native-camera');

var IconButton = require('../elements/iconButton');

var defaultStyles = require('../styles');

var CameraRoll = require('rn-camera-roll').default;

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
    return {
      cameraType: Camera.constants.Type.front,
      preview: false,
      cameraRoll: false,
      photo: '',
      message: '',
      images: [],
    };
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
      preview: false
    });
  },
  onComplete: function () {
    this.props.route.onPhotoChange('data:image/jpeg;base64,' + this.state.photo);
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
            onPress={this.onComplete}
            icon='material|check'
            size={30}
          />
        </View>
      </View>
    );
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
        {this.state.preview ? this.renderPreview() : (this.state.cameraRoll ? this.renderCameraRoll() : this.renderCamera())}
      </View>
    );
  }
});