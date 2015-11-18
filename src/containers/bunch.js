'use strict';

var React = require('react-native');
var _ = require('lodash');
var moment = require('moment');

var NavBar = require('../components/navBar');
var BunchContainer = require('../components/bunchContainer');
var NewChat = require('./newChat');
var ActionButton = require('../elements/actionButton');
var ChatBar = require('../components/chatBar');
var Chat = require('./chat');

var defaultStyles = require('../styles');

var {
  View,
  StyleSheet,
  Platform,
  Text,
  ListView,
  ScrollView,
} = React;

var AddPhoto;

if (Platform.OS === 'android') {
  AddPhoto = require('./addPhotoAndroid');
} else {
  AddPhoto = require('./addPhotoIOS')
}

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
    actions: React.PropTypes.object,
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
    this.setState({
      showActions: false
    });

    this.props.navigator.push({
      name: "add photo",
      component: AddPhoto,
      hasSideMenu: false,
      bunch: this.props.store.bunch,
    });
  },
  createChat: function (title, message) {
    this.setState({
      showActions: false,
    });

    this.props.actions.createChat(title, message);

    var bunch = this.props.store.bunch;
    var expirationDate = moment().add(bunch.attributes.ttl, 'ms').format();

    this.props.navigator.push({
      name: 'chat',
      component: Chat,
      hasSideMenu: true,
      newChat: {
        name: title,
        expirationDate: expirationDate,
        createdAt: Date.now(),
        message: message,
      },
    });
  },
  renderCameraAction: function () {
    return (
      <ActionButton
        onPress={this.onCameraActionButtonPress}
        camera={true}
      />
    );
  },
  render: function () {
    var title = this.props.store.bunch.attributes.name;

    return (
      <View style={Styles.body}>
        <ChatBar
          user={this.props.user}
          createChat={this.createChat}
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