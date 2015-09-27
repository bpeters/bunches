'use strict';

var React = require('react-native');
var Reflux = require('reflux');
var _ = require('lodash');
var Styles = require('../styles');

var Parse = require('parse/react-native');
var ParseReact = require('parse-react/react-native');

var NavBar = require('./navBar');
var Activity = require('./activity');

var UserPastClassesStore = require('../stores/userPastClasses');

var {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ListView,
  SwitchIOS,
} = React;

var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

module.exports = React.createClass({
  mixins: [
    Reflux.connect(UserPastClassesStore, 'classes')
  ],
  propTypes: {
    navigator: React.PropTypes.object,
    route: React.PropTypes.object,
    user: React.PropTypes.object,
  },
  onDone: function() {
    ParseReact.Mutation.Set(this.props.user, {setTutorClasses: true}).dispatch();

    this.props.navigator.push({
      name: 'activity',
      component: Activity,
    });
  },
  onPressRow: function(rowData) {
    var classes = _.cloneDeep(this.state.classes);

    _.forEach(classes, (classItem) => {
      if (rowData.id === classItem.id ) {
        classItem.tutoring = !classItem.tutoring;
      }
    });

    this.setState({
      dataSource: ds.cloneWithRows(classes),
      classes: classes,
    });
  },
  renderRow: function(rowData, i) {
    return (
      <TouchableOpacity onPress={() => this.onPressRow(rowData)}>
        <View>
          <View style={Styles.row}>
            <Text style={Styles.rowText}>
              {rowData.name}
            </Text>
            <SwitchIOS style={Styles.switch} value={rowData.tutoring} />
          </View>
          <View style={Styles.rowSeparator} />
        </View>
      </TouchableOpacity>
    );
  },
  render: function() {
    return (
      <View>
        <NavBar
          title='Set Tutor Classes'
          rightButton={{
            text: 'Done',
            onPress: this.onDone
          }}
        />
        <View style={Styles.container}>
          <ListView
            style={Styles.list}
            dataSource={ds.cloneWithRows(this.state.classes)}
            renderRow={this.renderRow}
            automaticallyAdjustContentInsets={false}
          />
        </View>
      </View>
    );
  }
});