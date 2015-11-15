'use strict';

var React = require('react-native');
var _ = require('lodash');
var moment = require('moment');
var Parse = require('parse/react-native');
var ParseReact = require('parse-react/react-native');
var Firebase = require('firebase');
var config = require('../config/default');

var NavBar = require('../components/navBar');
var BunchContainer = require('../components/bunchContainer');
var NewChat = require('./newChat');
var ActionButton = require('../elements/actionButton');

var defaultStyles = require('../styles');

var {
  View,
  StyleSheet,
  Platform,
  Text,
  ListView,
} = React;

var Styles = StyleSheet.create({
  body: {
    backgroundColor: defaultStyles.background,
  },
  container: {
    height:defaultStyles.bodyHeight,
  },
  actionButton: {
    position: 'absolute',
    bottom: 50,
    right: 16,
  }
});

module.exports = React.createClass({
  propTypes: {
    navigator: React.PropTypes.object,
    route: React.PropTypes.object,
    user: React.PropTypes.object,
    store: React.PropTypes.object,
    menuButton: React.PropTypes.object,
  },
  onActionButtonPress: function () {
    this.props.navigator.push({
      name: 'new chat',
      component: NewChat,
      hasSideMenu: false,
      bunch: this.props.store.bunch,
    });
  },
  render: function() {
    var title = this.props.store.bunch.attributes.name;

    return (
      <View style={Styles.body}>
        <NavBar
          title={title}
          menuButton={this.props.menuButton}
        />
        <BunchContainer
          user={this.props.user}
          navigator={this.props.navigator}
          store={this.props.store}
        />
        <View style={Styles.actionButton}>
          <ActionButton onPress={this.onActionButtonPress} />
        </View>
      </View>
    );
  }
});