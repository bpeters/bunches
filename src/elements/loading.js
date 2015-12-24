'use strict';

var React = require('react-native');

var {
  Spinner,
} = require('react-native-icons');

var defaultStyles = require('../styles');

var {
  View,
  TouchableOpacity,
  StyleSheet,
  Animated,
} = React;

var Styles = StyleSheet.create({
  view: {
    borderRadius: 12,
    backgroundColor: defaultStyles.dark,
    width: 24,
    height: 24,
  },
  spinner: {
    backgroundColor: 'transparent',
    width: 24,
    height: 24,
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
      offset: new Animated.Value(0)
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
        <View style={Styles.view}>
          <Spinner
            name='ion|load-a'
            size={12}
            color='#ffffff'
            style={Styles.spinner}
          />
        </View>
      </Animated.View>
    );
  }
});