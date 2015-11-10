'use strict';

var React = require('react-native');
var _ = require('lodash');
var Parse = require('parse/react-native');
var ParseReact = require('parse-react/react-native');

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
  mixins: [ParseReact.Mixin],
  propTypes: {
    navigator: React.PropTypes.object,
    route: React.PropTypes.object,
    user: React.PropTypes.object,
    menuButton: React.PropTypes.object,
  },
  observe: function() {
    var bunch = _.get(this, 'props.route.bunch');

    return {
      chats: (new Parse.Query('Chat'))
        .equalTo('belongsTo', bunch)
        .equalTo('isDead', false)
        .include('createdBy')
        .ascending("expirationDate"),
    };
  },
  onActionButtonPress: function () {
    this.props.navigator.push({
      name: "new chat",
      component: NewChat,
      hasSideMenu: false,
      bunch: this.props.route.bunch,
    });
  },
  render: function() {
    var title = _.get(this, 'props.route.bunch.name');
    var chats = this.data.chats;

    return (
      <View style={Styles.body}>
        <NavBar
          title={title}
          menuButton={this.props.menuButton}
        />
        <BunchContainer
          user={this.props.user}
          navigator={this.props.navigator}
          chats={chats}
        />
        <View style={Styles.actionButton}>
          {this.props.route.bunch ? <ActionButton onPress={this.onActionButtonPress} /> : null}
        </View>
      </View>
    );
  }
});