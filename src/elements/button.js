'use strict';

var React = require('react-native');

var defaultStyles = require('../styles');

var {
  View,
  TouchableOpacity,
  StyleSheet,
  Text,
  Animated,
} = React;

module.exports = React.createClass({
  propTypes: {
    onPress: React.PropTypes.func,
    title: React.PropTypes.string,
    color: React.PropTypes.string,
  },
  getInitialState: function () {
    return {
      offset: new Animated.Value(16)
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
    var Styles = StyleSheet.create({
      view: {
        width: defaultStyles.bodyWidth - 16 - 16,
        height: 56,
        borderRadius: 4,
        backgroundColor: this.props.color,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 16,
      },
      text: {
        color: defaultStyles.white,
        fontFamily: 'Roboto-Bold',
      },
    });

    return (
      <Animated.View
        style={{
          transform: [
            {translateY: this.state.offset},
          ]
        }}
      >
        <TouchableOpacity activeOpacity={0.9} onPress={this.props.onPress}>
          <View style={Styles.view}>
            <Text style={Styles.text}>
             {this.props.title}
            </Text>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  }
});