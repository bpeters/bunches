'use strict';

var React = require('react-native');
var Reflux = require('reflux');
var fuzzy = require('fuzzy');
var _ = require('lodash');
var Styles = require('../styles');

var Parse = require('parse/react-native');
var ParseReact = require('parse-react/react-native');

var NavBar = require('./navBar');
var SetClasses = require('./setClasses');

var InstitutionsStore = require('../stores/institutions');

var {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ListView,
  AlertIOS,
} = React;

module.exports = React.createClass({
  mixins: [
    Reflux.connect(InstitutionsStore, 'institutions'),
  ],
  propTypes: {
    navigator: React.PropTypes.object,
    route: React.PropTypes.object
  },
  getInitialState: function() {
    return {
      dataSource: new ListView.DataSource({
        rowHasChanged: (r1, r2) => r1 !== r2
      }),
      email: null,
      name: null,
      password: null,
      institution: {
        id: null,
        name: null,
      },
      search: null,
      showSearch: false,
      results: null,
      error: null,
    };
  },
  onHandlePress: function() {
    if (this.state.institution.id && this.state.email && this.state.name && this.state.password) {
      var user = new Parse.User();

      user.set('username', this.state.email);
      user.set('password', this.state.password);
      user.set('email', this.state.email);
      user.set('name', this.state.name);
      user.set('institution', this.state.institution.id);
      user.set('setClasses', false);
      user.set('setTutorClasses', false);

      user.signUp(null, {
        success: (user) => {
          this.props.navigator.push({
            name: 'setClasses',
            component: SetClasses,
            user: user,
          })
        },
        error: (user, error) => {
          this.setState({
            error: error
          });
        }
      });
    } else {
      this.setState({
        error: {
          message: 'all fields required'
        }
      });
    }
  },
  fuzzySearch: function(search) {
    var institutions = _.cloneDeep(this.state.institutions);
    var results = fuzzy.filter(search, institutions, {extract: (arg) => { return arg.name; }});
    var matches = results.map((el) => { return el.original; });

    this.setState({
      search: search,
      results: matches,
    });
  },
  handleShowSearch: function() {
    this.setState({
      showSearch: true,
      results: this.state.institutions,
    });
  },
  onPressRow: function(rowData) {
    this.setState({
      institution: rowData,
      search: rowData.name,
      showSearch: false,
    });
  },
  renderInputs: function() {
    return (
      <View>
        <TextInput
          style={Styles.formInput}
          placeholder='Email'
          iosreturnKeyType='next'
          keyboardType='email-address'
          onChangeText={(email) => this.setState({email})}
          value={this.state.email}
        />
        <TextInput
          style={Styles.formInput}
          placeholder='Name'
          iosreturnKeyType='next'
          onChangeText={(name) => this.setState({name})}
          value={this.state.name}
        />
        <TextInput
          style={Styles.formInput}
          placeholder='Password'
          iosreturnKeyType='next'
          secureTextEntry={true}
          onChangeText={(password) => this.setState({password})}
          value={this.state.password}
        />
      </View>
    );
  },
  renderRow: function(rowData) {
    return (
      <TouchableOpacity onPress={() => this.onPressRow(rowData)}>
        <View>
          <View style={Styles.row}>
            <Text style={Styles.rowText}>
              {rowData.name}
            </Text>
          </View>
          <View style={Styles.rowSeparator} />
        </View>
      </TouchableOpacity>
    );
  },
  renderSearch: function() {
    return (
      <ListView
        style={Styles.list}
        dataSource={this.state.dataSource.cloneWithRows(this.state.results)}
        renderRow={this.renderRow}
        automaticallyAdjustContentInsets={false}
      />
    );
  },
  render: function() {

    //lazy loading cause cyclical deps
    var LogIn = require('./login');

    if (this.state.error) {
      AlertIOS.alert(
        'Failed to Sign Up',
        this.state.error.message,
        [
          {text: 'Try Again', onPress: () => this.setState({error: null})},
        ]
      );
    }

    return (
      <View>
        <NavBar
          title='Sign Up'
          rightButton={{
            text: 'Log In',
            onPress: () => {
              this.props.navigator.push({
                name: 'login',
                component: LogIn
              });
            }
          }}
        />
        <View style={Styles.container}>
          {!this.state.showSearch ? this.renderInputs() : null}
          <TextInput
            style={Styles.formInput}
            placeholder='Search for school...'
            onFocus={this.handleShowSearch}
            onBlur={() => this.setState({search: this.state.institution.name})}
            onChangeText={this.fuzzySearch}
            value={this.state.search}
          />
          {this.state.showSearch ? this.renderSearch() : null}
        </View>
        <View style={Styles.footer}>
          <TouchableOpacity onPress={this.onHandlePress}>
            <View style={Styles.bigButton}>
              <Text style={Styles.bigButtonText}>
                Create Account
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
});