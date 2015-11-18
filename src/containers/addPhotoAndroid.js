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
  TextInput,
} = React;

var {
  Icon,
} = require('react-native-icons');

var Camera = require('react-native-camera');

var defaultStyles = require('../styles');

var Styles = StyleSheet.create({
  overall: {
    flex:1,
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
    left: defaultStyles.bodyWidth/2 - 40,
    bottom: 0, 
  },
  captureButton: {
    height: 90,
    width: 90,
    borderRadius: 90,
    borderWidth: 5,
    marginBottom: 30,
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



  preview: {
    width: defaultStyles.window.width,
    height: defaultStyles.window.height,
  },

  title: {
    position:'absolute',
    top: 100,
    left: 19,
    height:60,
    flex:1,
    flexDirection:'column',
    backgroundColor: defaultStyles.dark,
    opacity: 0.5,
  },
  label: {
    fontSize: 16,
    color: defaultStyles.light,
  },

  input : {
    fontFamily: 'Roboto-Light',
    color: defaultStyles.light,
    height: 36,
    width: defaultStyles.bodyWidth - 38,
    borderBottomWidth: 0,
    borderWidth: 0,
  },



});

module.exports = React.createClass({
  propTypes: {
    navigator: React.PropTypes.object,
    route: React.PropTypes.object,
    user: React.PropTypes.object,
  },
  getInitialState: function() {
    return {
      cameraType: Camera.constants.Type.front,
      photo: '',
      preview: false,
      message: '',
    };   
  },
  onPressClose: function() {
    this.props.navigator.pop();
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




  onCameraPress: function(){
    this.refs.cam.capture((image) => {
      this.setState({photo:image,preview:true});
    });
  },


  onPreviewClose: function(){
    this.setState({photo:'',preview:false});
  },
  

  test: function(){
    console.log('yippee');
  },


  renderPreview: function(){
    return (
      <View style={Styles.container}>
        <Image
          source={{
            uri: 'data:image/jpeg;base64,' + this.state.photo,
          }}
          style={Styles.preview}
        />

        <View style={Styles.title}>
          <Text style={Styles.label}>
            Title
          </Text>
          <TextInput
            style={Styles.input}
            onChangeText={(message) => this.setState({message})}
            value={this.state.message}
            onSubmitEditing={this.test}
            blurOnSubmit={false}
            enablesReturnKeyAutomatically={true}
            underlineColorAndroid={defaultStyles.light}
          />

        </View>




        <View style={Styles.iconViewSwitch}>
          <TouchableOpacity onPress={this.onPreviewClose}>
            <Icon
              name='material|close'
              size={30}
              color='#ffffff'
              style={Styles.icon}
            />
          </TouchableOpacity>  
        </View>
        <View style={Styles.iconView}>
          <TouchableOpacity onPress={this.onPressClose}>
            <Icon
              name='material|check'
              size={30}
              color='#ffffff'
              style={Styles.icon}
            />
          </TouchableOpacity>  
        </View>
      </View>
    )
  },



  renderCamera: function() {
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
          onPress={this.onCameraPress} 
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
      </View>
    );
  },

  render: function(){
    return (
      <View style={Styles.overall}>             
        {this.state.preview ? this.renderPreview() : this.renderCamera()}        
      </View>
    )
  }
});
