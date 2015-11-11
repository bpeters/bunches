'use strict';

var React = require('react-native');

var defaultStyles = require('../styles');

var {
  View,
  StyleSheet,
} = React;

var Styles = StyleSheet.create({  
  bar: {
    height: 5,
  },
});

module.exports = React.createClass({
  propTypes: {
    expiration: React.PropTypes.instanceOf(Date),
    created: React.PropTypes.instanceOf(Date),
    color: React.PropTypes.string,
    width: React.PropTypes.number,
  },
  getInitialState: function () {
    return {
      now: new Date().getTime()
    };
  },
  updateNow: function () {
    setTimeout(() => {
      this.setState({
        now: new Date().getTime()
      });
    }, 10000);
  },
  render: function() {
    this.updateNow();

    var percent = (this.props.expiration - this.state.now) / (this.props.expiration - this.props.created);
    var width = percent * this.props.width;
    var color = defaultStyles.green;

    if (percent <= 0.5) {
      color = defaultStyles.yellow;
    } else if (percent <= 0.25) {
      color = defaultStyles.red;
    }

    return (
      <View 
        style={[Styles.bar, {
          backgroundColor: this.props.color,
        }]}>
        <View 
          style={[Styles.bar, {
            width: width,
            backgroundColor: color
          }]}
        >
        </View>
      </View>
    );
  }
});