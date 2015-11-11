'use strict';

var React = require('react-native');
var {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
} = React;

var {
  Icon,
} = require('react-native-icons');

var PreviewPhoto = require('../components/previewPhoto');
var Camera = require('react-native-camera');

var defaultStyles = require('../styles');

var Styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#F5FCFF',
    },
    camera: {
      position: 'absolute',
      top: 0, 
      right: 0, 
      bottom: 0, 
      left: 0,
    },
    captured: {

      height: defaultStyles.window.height,
      width: defaultStyles.bodyWidth,
      
    },
    captureButton: {
      position: 'absolute',
      height: 90,
      width: 90,
      left: defaultStyles.bodyWidth/2 - 40, 
      bottom: 30,    
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
    onPhotoChange: React.PropTypes.func,
  },
  getInitialState: function() {
    return ({
      image: ''
    });
  },

  render: function() {
    var component = this;
    return (
      <View style={Styles.container}>
        <Camera 
          style={Styles.camera} 
          ref="cam"
          >
        </Camera>

        <TouchableOpacity style={Styles.captureButton} onPress={function() {
          component.refs.cam.capture().then(function(image) {
            component.props.navigator.pop();
            component.props.route.onPhotoChange('data:image/jpeg;base64,'+image);
            
          });
        }} />
          
       


        <View style={Styles.iconView}>
          <TouchableOpacity>
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
  }
});