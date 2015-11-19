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
  spinner: {
    borderRadius: 28,
    backgroundColor: defaultStyles.green,
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
    return (
      <Animated.View
        style={{
          transform: [
            {translateY: this.state.offset},
          ]
        }}
      >
        <View style={Styles.iconView}>
          <Icon
            name='material|check'
            size={30}
            color='#ffffff'
            style={Styles.spinner}
          />
        </View>
      </Animated.View>
    );
  }
});