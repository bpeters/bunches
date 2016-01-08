'use strict';

var React = require('react-native');
var _ = require('lodash');

var NavBar = require('../components/navBar');
var HashtagContainer = require('../components/hashtagContainer');

var defaultStyles = require('../styles');

var {
  View,
  StyleSheet,
  Text,
  ListView,
} = React;

var Styles = StyleSheet.create({
  body: {
    backgroundColor: defaultStyles.background,
    height: defaultStyles.bodyHeight,
  }
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
            clearSuccess={this.props.actions.clearSuccess}
            loading={this.props.store.loading}
            success={this.props.store.success}
            store={this.props.store}
          />
        </HashtagContainer>
      </View>
    );
  }
});