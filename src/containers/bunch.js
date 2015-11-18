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
var ChatBar = require('../components/chatBar');

var defaultStyles = require('../styles');

var {
  View,
  StyleSheet,
  Platform,
  Text,
  ListView,
  ScrollView,
} = React;

var Styles = StyleSheet.create({
  body: {
    backgroundColor: defaultStyles.background,
  },
  container: {
    height: defaultStyles.bodyHeight,
  },
});

module.exports = React.createClass({
  propTypes: {
    navigator: React.PropTypes.object,
    route: React.PropTypes.object,
    user: React.PropTypes.object,
    store: React.PropTypes.object,
    menuButton: React.PropTypes.object,
  },
  getInitialState: function () {
    return {
      showActions: false,
    };
  },
  onActionButtonPress: function () {
    this.setState({
      showActions: !this.state.showActions
    });
  },
  onCameraActionButtonPress: function () {
    
  },
  renderCameraAction: function () {
    return (
      <ActionButton
        onPress={this.onCameraActionButtonPress}
        camera={true}
      />
    );
  },
  render: function() {
    var title = this.props.store.bunch.attributes.name;

    return (
      <View style={Styles.body}>
        <ChatBar
          scrollView={this.refs.scrollView}
          user={this.props.user}
          bunch={this.props.store.bunch}
          createChat={this.props.actions.createChat}
          height={0}
        >
          <BunchContainer
            user={this.props.user}
            navigator={this.props.navigator}
            store={this.props.store}
            showBar={this.state.showActions}
          >
            <NavBar
              title={title}
              menuButton={this.props.menuButton}
            />
          </BunchContainer>
        </ChatBar>
        <ActionButton
          onPress={this.onActionButtonPress}
          show={this.state.showActions}
        />
        {this.state.showActions ? this.renderCameraAction() : null}
      </View>
    );
  }
});