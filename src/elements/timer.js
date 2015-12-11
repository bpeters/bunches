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
    borderRadius: 4,
    marginLeft: 5,
    marginRight: 5,
  },
  barContainer: {
    backgroundColor: defaultStyles.white,
    height: 15,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
    borderColor: defaultStyles.light,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    justifyContent: 'center',
  }
});

module.exports = React.createClass({
  propTypes: {
    expiration: React.PropTypes.instanceOf(Date),
    created: React.PropTypes.instanceOf(Date),
    width: React.PropTypes.number,
    view: React.PropTypes.string,
  },
  render: function() {
    var now = new Date().getTime();
    var percent = (this.props.expiration - now) / (this.props.expiration - this.props.created);
    var width = percent * this.props.width;
    var color = defaultStyles.green;

    if (percent <= 0.5) {
      color = defaultStyles.yellow;
    } 
    if (percent <= 0.25) {
      color = defaultStyles.red;
    }

    return (
      <View style={Styles.barContainer}>
        <View 
          style={[Styles.bar, {
            width: width,
            backgroundColor: color,
          }]}
        >
        </View>
      </View>
    );
  }
});