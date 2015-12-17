'use strict';

var React = require('react-native');
var _ = require('lodash');

var NavBar = require('../components/navBar');
var HashtagContainer = require('../components/hashtagContainer');

var defaultStyles = require('../styles');

var {
  View,
  StyleSheet,
  Platform,
  Text,
  ListView,
} = React;

var Loading;

if (Platform.OS === 'android') {
  Loading = require('../elements/loadingAndroid');
} else {
  Loading = require('../elements/loadingIOS');
}

var Styles = StyleSheet.create({
  body: {
    backgroundColor: defaultStyles.background,
    height: defaultStyles.bodyHeight,
  },
  loadingView: {
    position: 'absolute',
    backgroundColor: 'transparent',
    top: defaultStyles.navBarHeight - 28,
    right: (defaultStyles.bodyWidth / 2) - 28,
  },
});

module.exports = React.createClass({
  propTypes: {
    navigator: React.PropTypes.object,
    route: React.PropTypes.object,
    store: React.PropTypes.object,
    actions: React.PropTypes.object,
  },
  onBack: function () {
    this.props.navigator.pop();
  },
  renderLoading: function () {
    return (
      <View style={Styles.loadingView}>
        <Loading />
      </View>
    );
  },
  render: function () {
    var chats = this.props.store.hashtagMessages;

    return (
      <View style={Styles.body}>
        <HashtagContainer
          navigator={this.props.navigator}
          chats={chats}
          squashMessages={this.props.actions.squashMessages}
        >
          <NavBar
            title={this.props.route.hashtag}
            onBackButton={this.onBack}
          />
        </HashtagContainer>
        {this.props.store.loading ? this.renderLoading() : null}
      </View>
    );
  }
});