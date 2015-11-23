'use strict';

var React = require('react-native');
var _ = require('lodash');

var {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  LinkingIOS,
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
  link: {
    fontSize: 14,
    fontFamily: 'Roboto-Regular',
    color: defaultStyles.red,
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
  onPressLink: function (word) {
    LinkingIOS.openURL(word);
  },
  render: function() {
    var words = _.words(this.props.message, /[^, ]+/g);

    var urlExpression = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;

     var urlRegex = new RegExp(urlExpression);

    var message = _.map(words, (word) => {
      if (_.includes(word, '@')) {
        return (
          <Text style={Styles.mention}>
            {word + ' '}
          </Text>
        );
      } else if (word.match(urlRegex)) {
        return (
          <Text style={Styles.link} onPress={() => {this.onPressLink(word)}}>
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