'use strict';

var React = require('react-native');
var Styles = require('../styles');

var Parse = require('parse/react-native');
var ParseReact = require('parse-react/react-native');

var LogIn = require('./login');
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
        .equalTo('verified', true)
        .ascending('name'),
      tutoring: (new Parse.Query('UserTutorClass'))
        .equalTo('user', Parse.User.current())
        .equalTo('verified', true)
        .ascending('name'),
    };
  },
  onPressRow: function(rowData) {

    if (rowData.onPress) {
      rowData.onPress();
    } else {
     this.props.navigator.push({
        name: rowData.name,
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

    dataBlob['Classes'] = this.data.classes;
    dataBlob['Tutoring'] = this.data.tutoring;
    dataBlob['Account'] = [
      {
        name: 'Profile'
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