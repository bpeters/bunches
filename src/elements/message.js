'use strict';

var React = require('react-native');
var _ = require('lodash');

var {
  View,
  Text,
  StyleSheet,
} = React;

var defaultStyles = require('../styles');

var Styles = StyleSheet.create({
  message: {
    flexDirection: 'row',
    lineHeight: 18,
  },
  mention: {
    fontSize: 14,
    fontFamily: 'Roboto-Bold',
    color: defaultStyles.dark,
  },
  word: {
    fontSize: 14,
    fontFamily: 'Roboto-Light',
    color: defaultStyles.dark,
  },
});

module.exports = React.createClass({
  propTypes: {
    message: React.PropTypes.string,
  },
  render: function() {
    var words = _.words(this.props.message, /[^, ]+/g);

    var message = _.map(words, (word) => {
      if (_.includes(word, '@')) {
        return (
          <Text style={Styles.mention}>
            {word + ' '}
          </Text>
        );
      } else {
        return (
          <Text style={Styles.word}>
            {word + ' '}
          </Text>
        );
      }
    });

    return (
      <Text style={Styles.message}>
        {message}
      </Text>
    );
  }
});