'use strict';

var React = require('react-native');
var Reflux = require('reflux');
var _ = require('lodash');
var Styles = require('../styles');

var Parse = require('parse/react-native');
var ParseReact = require('parse-react/react-native');

var NavBar = require('./navBar');
var SetTutorClasses = require('./setTutorClasses');

var UserClassesStore = require('../stores/userClasses');

var {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ListView,
  SwitchIOS,
} = React;

module.exports = React.createClass({
  mixins: [
    Reflux.connect(UserClassesStore, 'classes'),
  ],
  propTypes: {
    navigator: React.PropTypes.object,
    route: React.PropTypes.object,
    user: React.PropTypes.object,
  },
  getInitialState: function() {
    return {
      dataSource: new ListView.DataSource({
        rowHasChanged: (r1, r2) => r1 !== r2
      }),
    };
  },
  onNext: function() {
    var batch = new ParseReact.Mutation.Batch();
    var user = Parse.User.current();
    var acl = new Parse.ACL(user);

    acl.setPublicReadAccess(true);

    ParseReact.Mutation.Set(this.props.user, {setClasses: true}).dispatch({ batch: batch });

    _.forEach(this.state.classes.current, (classItem) => {
      ParseReact.Mutation.Create('UserClass', {
        user: user,
        ACL: acl,
        classId: classItem.id,
        name: classItem.name,
        verified: classItem.verified,
        enrolled: classItem.enrolled,
      }).dispatch({ batch: batch });
    });

    batch.dispatch();

    this.props.navigator.push({
      name: 'setTutorClasses',
      component: SetTutorClasses,
    });
  },
  onPressRow: function(rowData) {
    var classes = _.cloneDeep(this.state.classes);

    _.forEach(classes.current, (classItem) => {
      if (rowData.id === classItem.id ) {
        classItem.verified = !classItem.verified;
      }
    });

    this.setState({
      classes: classes,
    });
  },
  renderRow: function(rowData) {
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
            dataSource={this.state.dataSource.cloneWithRows(this.state.classes.current)}
            renderRow={this.renderRow}
            automaticallyAdjustContentInsets={false}
          />
        </View>
      </View>
    );
  }
});