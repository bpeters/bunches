'use strict';

var React = require('react-native');
var _ = require('lodash');
var moment = require('moment');

var NavBar = require('../components/navBar');
var BunchContainer = require('../components/bunchContainer');
var ChatBar = require('../components/chatBar');
var PhotoPreview = require('./photoPreview');

var defaultStyles = require('../styles');

var VideoPreview = require('../containers/videoPreview');

var {
  View,
  StyleSheet,
  Platform,
  Text,
  ListView,
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
    height: defaultStyles.bodyHeight,
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
  onCameraActionButtonPress: function (orientation) {
    this.props.navigator.push({
      name: "add photo",
      component: AddPhoto,
      hasSideMenu: false,
      bunch: this.props.store.bunch,
      orientation: orientation,
    });
  },
  onPressCameraRollPhoto: function (image) {
    this.props.navigator.push({
      name: "photo preview",
      component: PhotoPreview,
      hasSideMenu: false,
      photo: image,
    });
  },




  onTest: function () {
    this.props.navigator.push({
      name: "video preview",
      component: VideoPreview,
      hasSideMenu: false,
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
  render: function () {
    var title = _.get(this.props.store.bunch, 'attributes.name');

    var emailVerified = _.get(this.props.store.user, 'emailVerified');

    var verified = true;

    if(emailVerified === false && !this.props.store.loading){
      if(title !== 'Global' && title !== 'Feedback'){
        verified = false;
      }
    }

    return (
      <View style={Styles.body}>
        <ChatBar
          user={this.props.store.user}
          createChat={this.createChat}
          onCameraPress={() => {
            this.onCameraActionButtonPress('back')}
          }
          onSelfiePress={() => {
            this.onCameraActionButtonPress('front')}
          }
          onPressCameraRollPhoto={(image) => {
            this.onPressCameraRollPhoto(image)}
          }
          store={this.props.store}
          getUsers={this.props.actions.getUsers}
          clearMentions={this.props.actions.clearMentions}
          verified={verified}
          onTest={this.onTest}
        >
          <BunchContainer
            navigator={this.props.navigator}
            store={this.props.store}
            squashMessages={this.props.actions.squashMessages}
            removeExpiredChats={this.props.actions.removeExpiredChats}
            verified={verified}
          >
            <NavBar
              title={title}
              menuButton={this.props.menuButton}
              clearSuccess={this.props.actions.clearSuccess}
              loading={this.props.store.loading}
              success={this.props.store.success}
              store={this.props.store}
            />
          </BunchContainer>
        </ChatBar>
      </View>
    );
  }
});