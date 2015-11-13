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
  mixins: [ParseReact.Mixin],
  propTypes: {
    navigator: React.PropTypes.object,
    route: React.PropTypes.object,
    user: React.PropTypes.object,
    menuButton: React.PropTypes.object,
  },
  observe: function() {
    var bunch = _.get(this, 'props.route.bunch');
    var now = moment().toDate();

    return {
      chats: (new Parse.Query('Chat'))
        .equalTo('belongsTo', bunch)
        .equalTo('isDead', false)
        .greaterThan("expirationDate", now)
        .include('createdBy')
        .descending("expirationDate"),
    };
  },
  getInitialState: function() {
    var bunch = this.props.route.bunch;
    var url = config.firebase.url + '/bunch/' + bunch.objectId;

    return {
      messenger: new Firebase(url),
      bulk: [],
    };
  },
  componentDidMount: function() {
    this.state.messenger.on('child_added', (snapshot) => {
      var data = snapshot.val();
      var bulk = [];

      _.forEach(data, (value, key) => {
        bulk.push({
          id: key,
          messages: value,
        });
      });

      this.setState({
        bulk: bulk
      });

    });
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
    console.log(this.props.route.bunch);

    var title = _.get(this, 'props.route.bunch.name');
    var chats = _.cloneDeep(this.data.chats);

    _.forEach(chats, (chat) => {
      chat.firebase = _.find(this.state.bulk, {'id' : chat.objectId});
    });

    return (
      <View style={Styles.body}>

      </View>
    );
  }
});