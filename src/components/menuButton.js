'use strict';

var React = require('react-native');
var Styles = require('../styles');

var {
  Text,
  TouchableOpacity,
} = React;

var MenuButton = React.createClass({
  propTypes: {
    onPress: React.PropTypes.func,
  },
  onHandlePress: function(e) {
    this.context.menuActions.toggle();
    if (this.props.onPress) {
      this.props.onPress(e);
    }
  },
  render: function() {
    return (
      <TouchableOpacity onPress={this.onHandlePress}>
        <Text style={Styles.leftNavButton}>
          Menu
        </Text>
      </TouchableOpacity>
    );
  }
});

MenuButton.contextTypes = {
  menuActions: React.PropTypes.object.isRequired
};

module.exports = MenuButton;