'use strict';

var React = require('react-native');

var IconButton = require('../elements/iconButton');

var defaultStyles = require('../styles');
var Counter = require('../elements/counter');
var Loading = require('../elements/loading');

var {
  Text,
  View,
  StyleSheet,
  Platform,
} = React;


var Styles = StyleSheet.create({
  body: {
    position: 'absolute',
    top: 0,
    flex: 1,
    flexDirection: 'row',
    height: defaultStyles.navBarHeight,
    width: defaultStyles.bodyWidth,
    backgroundColor: defaultStyles.red,
    shadowOpacity: 0.5,
    shadowRadius: 2,
    shadowOffset: {
      width: 0,
      height: 2
    },
    elevation: 5,
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
    color: defaultStyles.white,
    fontFamily: 'Roboto-Medium',
  },
  indicator: {
    position: 'absolute',
    backgroundColor: 'transparent',
    top: defaultStyles.navBarHeight - 24 - 16,
    right: 16,
  },
});

module.exports = React.createClass({
  propTypes: {
    title: React.PropTypes.string,
    onBackPress: React.PropTypes.func,
    clearSuccess: React.PropTypes.func,
    loading: React.PropTypes.bool,
    success: React.PropTypes.bool,
  },
  renderLoading: function () {
    return (
      <View style={Styles.indicator}>
        <Loading />
      </View>
    );
  },
  renderSuccess: function () {
    setTimeout(() => {
      this.props.clearSuccess();
    }, 3000);

    return (
      <View style={Styles.indicator}>
        <Success />
      </View>
    );
  },
  render: function() {
    return (
      <View style={Styles.body}>
        <View style={Styles.left}>
          <IconButton
            onPress={this.props.onBackPress}
            icon='material|arrow-left'
          />
        </View>
        <View style={Styles.center}>
          <Text style={Styles.title}>
            {this.props.title}
          </Text>
        </View>
        <View style={Styles.right}>
          {this.props.loading ? this.renderLoading() : null}
          {this.props.success ? this.renderSuccess() : null}
        </View>
      </View>
    );
  }
});