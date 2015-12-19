'use strict';

var React = require('react-native');

var IconButton = require('../elements/iconButton');
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
  body: {
    position: 'absolute',
    top: 0,
    flex: 1,
    flexDirection: 'row',
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
  indicator: {
    position: 'absolute',
    backgroundColor: 'transparent',
    top: defaultStyles.navBarHeight - 24 - 16,
    right: 16,
  },
  title: {
    fontSize: 20,
    color: defaultStyles.white,
    fontFamily: 'Roboto-Medium',
  },
});

var NavBar = React.createClass({
  propTypes: {
    title: React.PropTypes.string,
    menuButton: React.PropTypes.object,
    onBackButton: React.PropTypes.func,
    clearSuccess: React.PropTypes.func,
    loading: React.PropTypes.bool,
    success: React.PropTypes.bool,
  },
  onHandlePress: function(e) {
    if (this.props.onBackButton) {
      this.props.onBackButton();
    } else {
      this.context.menuActions.toggle();
      this.props.menuButton.onPress(e);
    }
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
            onPress={this.onHandlePress}
            icon={this.props.onBackButton ? 'material|arrow-left' : 'material|menu'}
          />
        </View>
        <View style={Styles.center}>
          <Text style={Styles.title}>
            {this.props.title}
          </Text>
        </View>
        {this.props.loading ? this.renderLoading() : null}
        {this.props.success ? this.renderSuccess() : null}
      </View>
    );
  }
});

NavBar.contextTypes = {
  menuActions: React.PropTypes.object
};

module.exports = NavBar;