'use strict';

var React = require('react-native');
var _ = require('lodash');
var Styles = require('../styles');

var Parse = require('parse/react-native');
var ParseReact = require('parse-react/react-native');

var NavBar = require('./navBar');
var SetTutorClasses = require('./setTutorClasses');

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
    verified: true,
  },
  {
    id: 2,
    name: 'English 101',
    verified: true,
  },
  {
    id: 3,
    name: 'Math 102',
    verified: true,
  },
  {
    id: 4,
    name: 'English 102',
    verified: true,
  },
  {
    id: 5,
    name: 'Math 103',
    verified: true,
  },
  {
    id: 6,
    name: 'English 103',
    verified: true,
  },
  {
    id: 7,
    name: 'Math 104',
    verified: true,
  },
  {
    id: 8,
    name: 'English 104',
    verified: true,
  },
];

var TUTOR_CLASSES = [
  {
    id: 1,
    name: 'GEO 101',
    tutoring: true,
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
      user: ParseReact.currentUser,
      dataSource: ds.cloneWithRows(CLASSES),
      classes: CLASSES,
    };
  },
  observe: function() {
    return {
      user: ParseReact.currentUser
    };
  },
  onNext: function() {
    console.log(this.data.user);

    //this.state.user.set('setClasses', true);
    //this.state.user.save();

    /*
    this.props.navigator.push({
      name: 'setTutorClasses',
      component: SetTutorClasses,
      passProps: {
        classes: TUTOR_CLASSES
      }
    });
*/
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
          title='Set Classes'
          rightButton={{
            text: 'Next',
            onPress: this.onNext
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