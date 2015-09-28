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

var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

module.exports = React.createClass({
  mixins: [
    Reflux.connect(UserClassesStore, 'classes'),
  ],
  propTypes: {
    navigator: React.PropTypes.object,
    route: React.PropTypes.object,
    user: React.PropTypes.object,
  },
  onNext: function() {
    var batch = new ParseReact.Mutation.Batch();
    var user = Parse.User.current();
    var acl = new Parse.ACL(user);

    acl.setPublicReadAccess(true);

    ParseReact.Mutation.Set(this.props.user, {setClasses: true}).dispatch({ batch: batch });

    _.forEach(this.state.classes, (classItem) => {
      ParseReact.Mutation.Create('UserClass', {
        user: user,
        ACL: acl,
        classId: classItem.id,
        name: classItem.name,
        verified: classItem.verified
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
            dataSource={ds.cloneWithRows(this.state.classes)}
            renderRow={this.renderRow}
            automaticallyAdjustContentInsets={false}
          />
        </View>
      </View>
    );
  }
});