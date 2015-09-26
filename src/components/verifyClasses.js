'use strict';

var React = require('react-native');
var _ = require('lodash');
var Styles = require('../styles');

var Parse = require('parse/react-native');
var ParseReact = require('parse-react/react-native');

var NavBar = require('./navBar');

var {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ListView,
  SwitchIOS,
} = React;

var CLASSES = [
  {
    id: 1,
    name: 'Math 101',
    verified: false,
  },
  {
    id: 2,
    name: 'English 101',
    verified: false,
  },
];

var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

module.exports = React.createClass({
  propTypes: {
    navigator: React.PropTypes.object,
    route: React.PropTypes.object
  },
  getInitialState: function() {
    return {
      dataSource: ds.cloneWithRows(CLASSES),
      classes: CLASSES,
    };
  },
  onPressRow: function(rowData) {
    var classes = _.cloneDeep(this.state.classes);

    _.forEach(classes, (classItem) => {
      if (rowData.id === classItem.id ) {
        classItem.verified = !classItem.verified;
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
            <SwitchIOS style={Styles.switch} value={rowData.verified} />
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
          title='Verify Classes'
          rightButton={{
            text: 'Next',
            onPress: () => {
              this.props.navigator.push({
                name: 'login',
                component: LogIn
              });
            }
          }}
        />
        <View style={Styles.container}>
          <ListView
            style={Styles.list}
            dataSource={this.state.dataSource}
            renderRow={this.renderRow}
            automaticallyAdjustContentInsets={false}
          />
        </View>
      </View>
    );
  }
});