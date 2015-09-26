'use strict';

var React = require('react-native');
var Styles = require('../styles');

var {
  Text,
  TouchableOpacity,
} = React;

module.exports = React.createClass({
  propTypes: {
    text: React.PropTypes.string,
    onPress: React.PropTypes.func,
    side: React.PropTypes.string,
  },
  onHandlePress: function() {
    this.props.onPress();
  },
  render: function() {
    return (
      <TouchableOpacity onPress={this.onHandlePress}>
        <Text style={Styles[this.props.side + 'NavButton']}>
          {this.props.text}
        </Text>
      </TouchableOpacity>
    );
  }
});