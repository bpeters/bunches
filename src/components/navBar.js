'use strict';

var React = require('react-native');
var _ = require('lodash');

var IconButton = require('../elements/iconButton');
var Success = require('../elements/success');
var Loading = require('../elements/loading');

var defaultStyles = require('../styles');

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
    shadowOpacity: 0.3,
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
  indicator: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    right: 16,
    height: defaultStyles.navBarHeight,
  },
  title: {
    fontSize: 20,
    color: defaultStyles.white,
    fontFamily: 'Roboto-Medium',
  },
  count: {
    position: 'absolute',
    top: defaultStyles.navBarHeight - 24 - 16,
    left: 16 + 12 + 4,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: defaultStyles.blue,
    height: 12,
    width: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: defaultStyles.red,
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
    store: React.PropTypes.object,
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
  renderCount: function () {
    return (
      <View style={Styles.count}>
      </View>
    );
  },
  render: function() {
    var showNotification = !_.isEmpty(this.props.store.notifications);

    return (
      <View style={Styles.body}>
        <View style={Styles.left}>
          <IconButton
            onPress={this.onHandlePress}
            icon={this.props.onBackButton ? 'material|arrow-left' : 'material|menu'}
          />
          {showNotification ? this.renderCount() : null}
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

NavBar.contextTypes = {
  menuActions: React.PropTypes.object
};

module.exports = NavBar;