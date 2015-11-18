'use strict';

var React = require('react-native');

var {
  Icon,
} = require('react-native-icons');

var defaultStyles = require('../styles');

var {
  View,
  TouchableOpacity,
  StyleSheet,
  Animated,
} = React;

var Styles = StyleSheet.create({
  actionButton: {
    position: 'absolute',
    backgroundColor: 'transparent',
    bottom: 76,
    right: 16,
  },
  cameraActionButton: {
    position: 'absolute',
    backgroundColor: 'transparent',
    bottom: 76 + 56 + 16,
    right: 16,
  },
  iconView: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'transparent',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: defaultStyles.dark,
    shadowOpacity: 0.5,
    shadowRadius: 4,
    shadowOffset: {
      width: 0,
      height: 0
    },
  }, 
  icon: {
    borderRadius: 28,
    backgroundColor: defaultStyles.red,
    width: 56,
    height: 56,
  },
});

module.exports = React.createClass({
  propTypes: {
    onPress: React.PropTypes.func,
    show: React.PropTypes.bool,
    camera: React.PropTypes.bool,
  },
  getInitialState: function () {
    return {
      offset: new Animated.Value(76)
    };
  },
  componentDidMount: function () {
    this.state.offset.setValue(10);

    Animated.spring(
      this.state.offset,
      {
        toValue: 0,
        friction: 1,
      }
    ).start(); 
  },
  render: function() {
    var icon = (this.props.camera ? 'material|camera' : (this.props.show ? 'material|more-vert' : 'material|more'));

    return (
      <Animated.View
        style={{
          transform: [
            {translateY: this.state.offset},
          ]
        }}
      >
        <View style={this.props.camera ? Styles.cameraActionButton : Styles.actionButton}>
          <TouchableOpacity activeOpacity={0.9} onPress={this.props.onPress}>
            <View style={Styles.iconView}>
              <Icon
                name={icon}
                size={30}
                color='#ffffff'
                style={Styles.icon}
              />
            </View>
          </TouchableOpacity>
        </View>
      </Animated.View>
    );
  }
});