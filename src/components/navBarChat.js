'use strict';

var React = require('react-native');

var IconButton = require('../elements/iconButton');
var Counter = require('../elements/counter');

var defaultStyles = require('../styles');

var {
  Text,
  View,
  StyleSheet,
} = React;

var Styles = StyleSheet.create({
  timer: {
    flex: 1,
    position: 'absolute',
    top: defaultStyles.navBarHeight,
    height: defaultStyles.navBarHeight,
    width: defaultStyles.bodyWidth,
    backgroundColor: defaultStyles.blue,
    shadowOpacity: 0.5,
    shadowRadius: 2,
    shadowOffset: {
      width: 0,
      height: 2
    },
  },
  body: {
    flex: 1,
    flexDirection: 'row',
  },
  left: {
    flex: 1,
    alignItems: 'flex-start',
    height: defaultStyles.navBarHeight,
  },
  center: {
    flex: 4,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  right: {
    flex: 1,
    alignItems: 'flex-end',
  },
  title: {
    fontSize: 20,
    overflow:'hidden',
    color: defaultStyles.white,
    fontFamily: 'Roboto-Medium',
  },
});

module.exports = React.createClass({
  propTypes: {
    title: React.PropTypes.string,
    onBackPress: React.PropTypes.func,
    score: React.PropTypes.number,
  },
  renderCounter: function() {
    return (
      <Counter
        score={this.props.score}
        color='white'
      /> 
    )
  },
  render: function() {
    return (
      <View style={Styles.timer}>
        <View style={Styles.body}>
          <View style={Styles.left}>
            <IconButton
              onPress={this.props.onBackPress}
              icon='material|arrow-left'
            />
          </View>
          <View style={Styles.center}>
            <Text style={Styles.title} numberOfLines={1}>
              {this.props.title}
            </Text>
          </View>
          <View style={Styles.right}>
          {this.props.score ? this.renderCounter() : null}
          </View>
        </View>
      </View>
    );
  }
});

