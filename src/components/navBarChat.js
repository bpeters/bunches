'use strict';

var React = require('react-native');

var IconButton = require('../elements/iconButton');
var StatBar = require('../elements/statBar');
var Success = require('../elements/success');

var defaultStyles = require('../styles');

var {
  Text,
  View,
  StyleSheet,
  Platform,
} = React;

var Loading;

if (Platform.OS === 'android') {
  Loading = require('../elements/loadingAndroid');
} else {
  Loading = require('../elements/loadingIOS');
}

var Styles = StyleSheet.create({
  timer: {
    flex: 1,
    position: 'absolute',
    top: 0,
    height: defaultStyles.navBarHeight + defaultStyles.statBarHeightHeight,
    width: defaultStyles.bodyWidth,
    backgroundColor: defaultStyles.red,
    shadowOpacity: 0.3,
    shadowRadius: 2,
    shadowOffset: {
      width: 0,
      height: 2
    },
  },
  body: {
    flex: 1,
    flexDirection: 'row',
    height: defaultStyles.navBarHeight,
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
    score: React.PropTypes.number,
    userCount: React.PropTypes.number,
    expiration: React.PropTypes.instanceOf(Date),
    loading: React.PropTypes.bool,
    success: React.PropTypes.bool,
    clearSuccess: React.PropTypes.func,
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
            {this.props.loading ? this.renderLoading() : null}
            {this.props.success ? this.renderSuccess() : null}
          </View>
        </View>
        <StatBar
          score={this.props.score}
          userCount={this.props.userCount}
          expiration={this.props.expiration}
        />
      </View>
    );
  }
});

