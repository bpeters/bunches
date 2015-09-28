'use strict';

var React = require('react-native');
var _ = require('lodash');
var Styles = require('../styles');

var Parse = require('parse/react-native');
var ParseReact = require('parse-react/react-native');

var Firebase = require('firebase');

var NavBar = require('./navBar');

var {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ListView,
} = React;

module.exports = React.createClass({
  propTypes: {
    navigator: React.PropTypes.object,
    route: React.PropTypes.object,
    user: React.PropTypes.object,
    menuButton: React.PropTypes.object,
  },
  getInitialState: function() {
    var url = "https://bunches.firebaseio.com/" + _.kebabCase(this.props.route.name);

    return {
      messenger: new Firebase(url),
      message: null,
      messages: [],
      dataSource: new ListView.DataSource({
        rowHasChanged: (r1, r2) => r1 !== r2
      }),
    };
  },
  componentDidMount: function() {
    var messages = _.cloneDeep(this.state.messages);

    this.state.messenger.on('child_added', (snapshot) => {
      var data = snapshot.val();

      messages.push(data);

      this.setState({
        messages: messages
      });
    });
  },
  handleSubmit: function() {
    this.state.messenger.push({
      message: this.state.message,
      userName: this.props.user.name,
    });

    this.setState({
      message: null
    });
  },
  renderRow: function(rowData) {
    return (
      <TouchableOpacity>
        <View>
          <View style={Styles.channelUser}>
            <Text style={Styles.channelUserText}>
              {rowData.userName || 'Anon'}
            </Text>
          </View>
          <View style={Styles.channelRow}>
            <Text style={Styles.channelRowText}>
              {rowData.message}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  },
  render: function() {
    return (
      <View>
        <NavBar
          title={this.props.route.name}
          menuButton={this.props.menuButton}
        />
        <View style={Styles.channel}>
          <ListView
            style={Styles.channelList}
            dataSource={this.state.dataSource.cloneWithRows(this.state.messages)}
            renderRow={this.renderRow}
            automaticallyAdjustContentInsets={false}
          />
        </View>
        <TextInput
          style={Styles.channelInput}
          placeholder='Message'
          onChangeText={(message) => this.setState({message})}
          value={this.state.message}
          onSubmitEditing={this.handleSubmit}
        />
      </View>
    );
  }
});