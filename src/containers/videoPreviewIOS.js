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
  controls: {
    backgroundColor: "transparent",
    borderRadius: 5,
    position: 'absolute',
    bottom: 44,
    left: 4,
    right: 4,
  },
  progress: {
    flex: 1,
    flexDirection: 'row',
    borderRadius: 3,
    overflow: 'hidden',
  },
  innerProgressCompleted: {
    height: 20,
    backgroundColor: '#cccccc',
  },
  innerProgressRemaining: {
    height: 20,
    backgroundColor: '#2C2C2C',
  },
  generalControls: {
    flex: 1,
    flexDirection: 'row',
    overflow: 'hidden',
    paddingBottom: 10,
  },
  skinControl: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  rateControl: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  volumeControl: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  resizeModeControl: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  controlOption: {
    alignSelf: 'center',
    fontSize: 11,
    color: "white",
    paddingLeft: 2,
    paddingRight: 2,
    lineHeight: 12,
  },
  nativeVideoControls: {
    top: 184,
    height: 300
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
  getInitialState: function () {
    return {
      rate: 1,
      volume: 1,
      muted: false,
      resizeMode: 'contain',
      duration: 0.0,
      currentTime: 0.0,
      controls: false,
      paused: true,
      skin: 'custom'
    }
  },

  onLoad: function (data) {
    this.setState({duration: data.duration});
  },

  onProgress: function (data) {
    this.setState({currentTime: data.currentTime});
  },

  onPressSave: function () {
    NativeModules.SaveVideoData.saveVideo(this.props.route.videoPath);
  },

  getCurrentTimePercentage: function () {
    if (this.state.currentTime > 0) {
      return parseFloat(this.state.currentTime) / parseFloat(this.state.duration);
    } else {
      return 0;
    }
  },
  renderCustomSkin: function () {
    var flexCompleted = this.getCurrentTimePercentage() * 100;
    var flexRemaining = (1 - this.getCurrentTimePercentage()) * 100;

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
            onPress={this.onPressSave}
            icon='material|check'
            size={30}
          />
        </View>
      </View>
    );
  },
  
  render: function () {
    return this.renderCustomSkin();
  }
  
});