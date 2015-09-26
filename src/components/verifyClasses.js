'use strict';

var React = require('react-native');
var Styles = require('../styles');

var Parse = require('parse/react-native');
var ParseReact = require('parse-react/react-native');

var NavBar = require('./navBar');

var {
  Text,
  TextInput,
  TouchableOpacity,
  View,
} = React;

module.exports = React.createClass({
  propTypes: {
    navigator: React.PropTypes.object,
    route: React.PropTypes.object
  },
  getInitialState: function() {
    return {
      verifiedClasses: []
    };
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

        </View>
      </View>
    );
  }
});