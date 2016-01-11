'use strict';

var React = require('react-native');

var {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  NativeModules,
} = React;

var Video = require('react-native-video');
var IconButton = require('../elements/iconButton');

var defaultStyles = require('../styles');

var Styles = StyleSheet.create({
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
  iconViewCenter: {
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.8,
  },
});


module.exports = React.createClass({
  propTypes: {
    navigator: React.PropTypes.object,
  },
  getInitialState: function () {
    return {
      paused: true,
    }
  },

  onLoad: function () {
    console.log('done loading');
  },

  onLoadStart: function () {
    console.log('loading...')
  },


  onPressClose: function () {
    this.props.navigator.pop();
  },
  render: function () {

    return (
      <View style={Styles.videoContainer}>
        <TouchableOpacity
          style={Styles.fullScreen}
          onPress={() => {this.setState({paused: !this.state.paused})}}
        >
          <Video
            source={{uri: "https://s3-us-west-2.amazonaws.com/bunchesapp/videos/killer.mp4"}}
            style={Styles.fullScreen}
            rate={1.0}
            paused={this.state.paused}
            volume={1.0}
            muted={false}
            onLoadStart={this.onLoadStart} // Callback when video starts to load
            onLoad={this.onLoad} 
            resizeMode={'contain'}
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
        <View style={Styles.iconViewTopLeft}>
          <IconButton
            onPress={this.onPressClose}
            icon='material|close'
            size={30}
          />
        </View>
      </View>
    );
  }
});