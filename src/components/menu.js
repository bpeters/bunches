'use strict';

var React = require('react-native');
var _ = require('lodash');
var Styles = require('../styles');

var Parse = require('parse/react-native');
var ParseReact = require('parse-react/react-native');

var LogIn = require('./login');
var Activity = require('./activity');
var Profile = require('./profile');
var Channel = require('./channel');

var {
  View,
  ListView,
  TouchableOpacity,
  Text,
} = React;

module.exports= React.createClass({
  mixins: [ParseReact.Mixin],
  propTypes: {
    navigator: React.PropTypes.object,
    user: React.PropTypes.object,
  },
  getInitialState: function() {
    return {
      dataSource: new ListView.DataSource({
        rowHasChanged: (r1, r2) => r1 !== r2,
        sectionHeaderHasChanged: (s1, s2) => s1 !== s2
      }),
    };
  },
  observe: function() {
    return {
      classes: (new Parse.Query('UserClass'))
        .equalTo('user', Parse.User.current())
        .ascending('name'),
    };
  },
  onPressRow: function(rowData) {

    if (rowData.onPress) {
      rowData.onPress();
    } else {
     this.props.navigator.push({
        class: rowData,
        component: Channel,
        hasSideMenu: true,
      });
    }

  },
  renderRow: function(rowData) {
    return (
      <TouchableOpacity onPress={() => this.onPressRow(rowData)}>
        <View>
          <View style={Styles.menuRow}>
            <Text style={Styles.menuRowText}>
              {rowData.name}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  },
  renderSectionHeader: function(sectionData, sectionID) {
    return (
      <View style={Styles.menuSection}>
        <Text style={Styles.menuSectionText}>
          {sectionID}
        </Text>
      </View>
    );
  },
  render: function() {
    var dataBlob = {}

    dataBlob['Classes'] = _.filter(this.data.classes, (classItem) => { 
      return classItem.enrolled && classItem.verified;
    });

    dataBlob['Tutoring'] = _.filter(this.data.classes, (classItem) => { 
      return !classItem.enrolled && classItem.verified;
    });

    dataBlob['Account'] = [
      {
        name: 'Activity',
        onPress: () => {
           this.props.navigator.push({
              name: 'activity',
              component: Activity,
              hasSideMenu: true,
            });
        }
      },
      {
        name: 'Profile',
        onPress: () => {
           this.props.navigator.push({
              name: 'profile',
              component: Profile,
              hasSideMenu: true,
            });
        }
      },
      {
        name: 'Log Out',
        onPress: () => {
          Parse.User.logOut();
           this.props.navigator.push({
              name: 'login',
              component: LogIn
            });
        }
      },
    ];

    return (
      <View style={Styles.menu}>
        <ListView
          style={Styles.list}
          dataSource={this.state.dataSource.cloneWithRowsAndSections(dataBlob)}
          renderRow={this.renderRow}
          renderSectionHeader={this.renderSectionHeader}
          automaticallyAdjustContentInsets={false}
        />
      </View>
    );
  }
});