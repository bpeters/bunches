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
  container: {
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
});


module.exports = React.createClass({
  propTypes: {
    navigator: React.PropTypes.object,
    route: React.PropTypes.object,
    store: React.PropTypes.object,
    actions: React.PropTypes.object,
    user: React.PropTypes.object,
  },
  getInitialState: function () {
    return {
      rate: 1,
      volume: 1,
      muted: false,
      resizeMode: 'cover',
      duration: 0.0,
      currentTime: 0.0,
      controls: false,
      paused: true,
    }
  },

  onPressClose: function () {
    this.props.navigator.pop();
  },

  onPressSave: function () {
    this.props.route.saveVideo(this.props.route.path);
  },

  render: function () {

    return (
      <View style={Styles.container}>
        <TouchableOpacity
          style={Styles.fullScreen}
          onPress={() => {this.setState({paused: !this.state.paused})}}
        >
          <Video
            source={{uri: this.props.route.videoPath}}
            style={Styles.fullScreen}
            rate={this.state.rate}
            paused={this.state.paused}
            volume={this.state.volume}
            muted={this.state.muted}
            resizeMode={this.state.resizeMode}
            onLoad={this.onLoad}
            onProgress={this.onProgress}
            repeat={false}
          />
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
            onPress={this.onPressSave}
            icon='material|check'
            size={30}
          />
        </View>
      </View>
    );
  }
});