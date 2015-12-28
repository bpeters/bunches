'use strict';

var React = require('react-native');
var _ = require('lodash');

var {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  LinkingIOS,
  Platform,
  IntentAndroid,
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
    color: defaultStyles.blue,
  },
  hashtag: {
    fontSize: 14,
    fontFamily: 'Roboto-Bold',
    color: defaultStyles.red,
  },
  link: {
    fontSize: 14,
    fontFamily: 'Roboto-Regular',
    color: defaultStyles.blue,
  },
  phrase: {
    fontSize: 14,
    fontFamily: 'Roboto-Bold',
    color: defaultStyles.green,
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
    onHashtagPress: React.PropTypes.func,
    onMentionPress: React.PropTypes.func,
  },
  onPressLink: function (word) {
    var url;
    if (_.startsWith(word, 'http://') || _.startsWith(word, 'https://')) {
      url = word;
    } else {
      url = 'http://' + word;
    }
    if(Platform.OS === 'ios'){
      LinkingIOS.openURL(url);
    } else {
      IntentAndroid.openURL(url)
    }
  },
  render: function() {
    if (_.startsWith(this.props.message, '/!/!/!/')) {
      var phrase = _.trimLeft(this.props.message, '/!/!/!/');

      return (
        <Text style={Styles.message}>
          <Text style={Styles.phrase}>
            {phrase}
          </Text>
        </Text>
      );
    } else {
      var words = this.props.message.split(' ');
      var urlExpression = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
      var urlRegex = new RegExp(urlExpression);

      var message = _.map(words, (word, i) => {
        if (_.startsWith(word, '@') && _.endsWith(word, '/?/?/?/')) {

          var split = word.split('/?/?/?/');
          var uid = split[1];
          var handle = _.trimLeft(split[0], '@');

          return (
            <Text key={i} style={Styles.mention} onPress={() => {this.props.onMentionPress(uid, handle)}}>
              {'@' + handle + ' '}
            </Text>
          );
        } else if (_.startsWith(word, '#')) {
          return (
            <Text key={i} style={Styles.hashtag} onPress={() => {this.props.onHashtagPress(word)}}>
              {word + ' '}
            </Text>
          );
        } else if (word.match(urlRegex)) {
          return (
            <Text key={i} style={Styles.link} onPress={() => {this.onPressLink(word)}}>
              {word + ' '}
            </Text>
          );
        } else {
          return (
            <Text key={i} style={Styles.word}>
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
  }
});