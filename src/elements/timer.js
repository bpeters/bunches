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

    // if in chat view
    var heightContainer = 5;
    var backgroundColor = defaultStyles.blue;
    var borderRadius = 0;
    var barRadius = 0;
    var margin = 0;
    var borderColor = defaultStyles.blue;
    var borderWidth = 0;

    // if in bunch view
    if(this.props.view === 'bunch'){
      heightContainer = 10;
      backgroundColor = defaultStyles.white;
      borderRadius = 4;
      barRadius = 3;
      margin = 5;
      borderColor = defaultStyles.light;
      borderWidth = 1;
    }

    return (
      <View 
        style={{
          backgroundColor: backgroundColor,
          height: heightContainer,
          borderBottomLeftRadius: borderRadius,
          borderBottomRightRadius: borderRadius,
          borderLeftColor: borderColor,
          borderRightColor: borderColor,
          borderLeftWidth: borderWidth,
          borderRightWidth: borderWidth,
        }}>
        <View 
          style={[Styles.bar, {
            width: width,
            backgroundColor: color,
            borderRadius: barRadius,
            marginLeft: margin,
            marginRight: margin,
          }]}
        >
        </View>
      </View>
    );
  }
});