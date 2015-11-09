'use strict';

var React = require('react-native');
var {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableHighlight,
} = React;

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
});

module.exports = React.createClass({
  propTypes: {
    onPhotoChange: React.PropTypes.func,
  },
  getInitialState: function() {
    return ({
      capturedBase64: ''
    });
  },

  render: function() {
    var component = this;
    return (
      <View style={Styles.container}>
        <Camera 
          style={Styles.camera} 
          ref="cam"
          orientation="ladns"
          >
        </Camera>
        <Image
          source={{
            isStatic: true,
            uri: 'data:image/jpeg;base64,' + component.state.capturedBase64,
          }}

          style={Styles.captured}
          />
        <TouchableHighlight style={Styles.captureButton} onPress={function() {
          component.refs.cam.capture().then(function(capturedBase64) {
            // console.log(component.props.route.onPhotoChange);

            component.props.route.onPhotoChange(capturedBase64);
            component.props.navigator.pop();

            // component.setState({ capturedBase64 });
            // setTimeout(() => component.setState({ capturedBase64: '' }), 5000);
          });
        }}>
          
        <Text></Text>

        </TouchableHighlight>
      </View>
    );
  }
});