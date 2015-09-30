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
  mixins: [ParseReact.Mixin],
  propTypes: {
    navigator: React.PropTypes.object,
    route: React.PropTypes.object,
    user: React.PropTypes.object,
    menuButton: React.PropTypes.object,
  },
  getInitialState: function() {
    var url = 'https://bunches.firebaseio.com/institution/' + this.props.user.institution + '/class/' + this.props.route.class.classId;

    return {
      messenger: new Firebase(url),
      message: null,
      messages: [],
      dataSource: new ListView.DataSource({
        rowHasChanged: (r1, r2) => r1 !== r2
      }),
      showChat: true,
      showEnrolled: false,
      showTutors: false,
      showBunches: false,
      people: [],
    };
  },
  observe: function() {
    return {
      people: (new Parse.Query('UserClass'))
        .equalTo('classId', this.props.route.class.classId)
        .equalTo('institution', this.props.user.institution)
        .equalTo('verified', true)
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
    if (this.state.message) {
      this.state.messenger.push({
        message: this.state.message,
        userName: this.props.user.name,
      });

      this.setState({
        message: null
      });
    }
  },
  onPressEnrolled: function() {
    this.setState({
      showChat: false,
      showEnrolled: true,
      showTutors: false,
      showBunches: false,
      people: _.pluck(_.filter(this.data.people, 'enrolled', true), 'user'),
    });
  },
  onPressTutors: function() {
    this.setState({
      showChat: false,
      showEnrolled: false,
      showTutors: true,
      showBunches: false,
      people: _.pluck(_.filter(this.data.people, 'enrolled', false), 'user'),
    });
  },
  onPressBunches: function() {
    this.setState({
      showChat: false,
      showEnrolled: false,
      showTutors: false,
      showBunches: true,
      people: [],
    });
  },
  handleFocus: function() {
    this.setState({
      showChat: true,
      showEnrolled: false,
      showTutors: false,
      showBunches: false,
      people: [],
    });
  },
  renderChatRow: function(rowData) {
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
  renderChat: function() {
    return (
      <View style={Styles.channel}>
        <ListView
          style={Styles.channelList}
          dataSource={this.state.dataSource.cloneWithRows(this.state.messages)}
          renderRow={this.renderChatRow}
          automaticallyAdjustContentInsets={false}
        />
      </View>
    );
  },
  renderPeopleRow: function(rowData) {
    return (
      <TouchableOpacity>
        <View>
          <View style={Styles.channelUser}>
            <Text style={Styles.channelUserText}>
              {rowData.name || 'Anon'}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  },
  renderPeople: function() {
    return (
      <View style={Styles.channel}>
        <ListView
          style={Styles.channelList}
          dataSource={this.state.dataSource.cloneWithRows(this.state.people)}
          renderRow={this.renderPeopleRow}
          automaticallyAdjustContentInsets={false}
        />
      </View>
    );
  },
  render: function() {
    var enrolledCount = _.filter(this.data.people, 'enrolled', true).length;
    var tutorCount = _.filter(this.data.people, 'enrolled', false).length;
    var bunchesCount = 0;

    return (
      <View>
        <NavBar
          title={this.props.route.class.name}
          menuButton={this.props.menuButton}
        />
        <View style={Styles.channelInfo}>
          <TouchableOpacity onPress={this.onPressEnrolled}>
            <View style={Styles.channelInfoButton}>
              <Text style={this.state.showEnrolled ? Styles.channelInfoHighlight : Styles.channelInfoText}>
                {enrolledCount + ' Enrolled'}
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={this.onPressTutors}>
            <View style={Styles.channelInfoButton}>
              <Text style={this.state.showTutors ? Styles.channelInfoHighlight : Styles.channelInfoText}>
                {tutorCount + ' Tutors'}
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={this.onPressBunches}>
            <View style={Styles.channelInfoButton}>
              <Text style={this.state.showBunches ? Styles.channelInfoHighlight : Styles.channelInfoText}>
                {bunchesCount + ' Bunches'}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
        {this.state.showChat ? this.renderChat() : this.renderPeople()}
        <View style={Styles.channelInputBox}>
          <TextInput
            style={Styles.channelInput}
            placeholder='Message'
            onFocus={this.handleFocus}
            onChangeText={(message) => this.setState({message})}
            value={this.state.message}
            onSubmitEditing={this.handleSubmit}
          />
          <TouchableOpacity onPress={this.handleSubmit}>
            <View style={Styles.channelSendButton}>
              <Text style={Styles.channelSendText}>
                {'Send'}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
});