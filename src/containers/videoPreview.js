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
    backgroundColor: 'cyan',
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
  render: function () {

    return (
      <View style={Styles.videoContainer}>
        <TouchableOpacity
          style={Styles.fullScreen}
          onPress={() => {this.setState({paused: !this.state.paused})}}
        >
          <Video
            source={{uri: "http://files.parsetfss.com/0fddd9cf-f4d4-4699-81df-b9e09d9a5f66/tfss-fc43d765-ee42-48e8-a2a5-340d9b6f176b-bunches.mp4"}}
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
        <View style={Styles.iconViewTopLeft}>
          <IconButton
            onPress={this.onPreviewClose}
            icon='material|close'
            size={30}
          />
        </View>
      </View>
    );
  }
});