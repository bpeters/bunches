'use strict';

var React = require('react-native');
var _ = require('lodash');
var moment = require('moment');

var NavBar = require('../components/navBar');
var BunchContainer = require('../components/bunchContainer');
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

var AddPhoto;
var Loading;

if (Platform.OS === 'android') {
  AddPhoto = require('./addPhotoAndroid');
  Loading = require('../elements/loadingAndroid');
} else {
  AddPhoto = require('./addPhotoIOS')
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
    menuButton: React.PropTypes.object,
  },
  onCameraActionButtonPress: function () {
    this.props.navigator.push({
      name: "add photo",
      component: AddPhoto,
      hasSideMenu: false,
      bunch: this.props.store.bunch,
    });
  },
  createChat: function (message) {
    var Chat = require('./chat');

    this.props.actions.createChat(message);

    var bunch = this.props.store.bunch;
    var expirationDate = moment().add(bunch.attributes.ttl, 'ms').format();

    this.props.navigator.push({
      name: 'chat',
      component: Chat,
      hasSideMenu: true,
      newChat: {
        name: this.props.store.user.handle,
        expirationDate: expirationDate,
        createdAt: Date.now(),
        message: message,
      },
    });
  },
  renderLoading: function () {
    return (
      <View style={Styles.loadingView}>
        <Loading />
      </View>
    );
  },
  render: function () {
    var title = _.get(this.props.store.bunch, 'attributes.name');

    return (
      <View style={Styles.body}>
        <ChatBar
          user={this.props.store.user}
          createChat={this.createChat}
          onPress={this.onCameraActionButtonPress}
        >
          <BunchContainer
            navigator={this.props.navigator}
            store={this.props.store}
          >
            <NavBar
              title={title}
              menuButton={this.props.menuButton}
            />
          </BunchContainer>
        </ChatBar>
        {this.props.store.loading ? this.renderLoading() : null}
      </View>
    );
  }
});