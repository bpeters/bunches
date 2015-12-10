'use strict';

var React = require('react-native');

var {
  Icon,
} = require('react-native-icons');

var defaultStyles = require('../styles');

var {
  View,
  Text,
  StyleSheet,
} = React;

var Styles = StyleSheet.create({  
  bolt: {
    flex: 1,
    flexDirection:'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingRight: 16,
    alignSelf:'stretch',
  },
  iconView: {
    height: 16,
    width: 16,
    borderRadius: 8,
  },
  iconText: {
    fontSize: 16,
    fontFamily: 'Roboto-Regular',
    paddingRight: 4,
  },
  icon: {
    width: 16,
    height: 16,
    borderRadius: 8,
  }, 
});

module.exports = React.createClass({
  propTypes: {
    score: React.PropTypes.number,
    color: React.PropTypes.string,
  },
  render: function() {

    // Set colors
    if (this.props.color === 'white') {

      var container = {
        flex:1,
        flexDirection: 'row',
        alignItems: 'center',
      };

      var textUser = textChat = {
        color: defaultStyles.white,
      };

      var bgUser = bgChat = {
        backgroundColor: defaultStyles.white,
      };

      var iconUser = defaultStyles.green;
      var iconChat = defaultStyles.red;
    } else {
      var container = {
        flex:1,
        flexDirection: 'column',
        alignItems: 'center',
      };

      var textUser = {
        color: defaultStyles.green,
      };

      var bgUser = {
        backgroundColor: defaultStyles.green,
      };

      var textChat = {
        color: defaultStyles.red,
      };

      var bgChat = {
        backgroundColor: defaultStyles.red,
      };

      var iconUser = iconChat = defaultStyles.white;
    }

    return (
      <View style={container}>
        <View style={Styles.bolt}>
          <Text style={[Styles.iconText,textChat]}>
            {this.props.score}
          </Text>

          <View style={[Styles.iconView,bgChat]}>
            <Icon
              name='fontawesome|bolt'
              size={12}
              color={iconChat}
              style={Styles.icon}
            />
          </View>
        </View>
      </View>
    );
  }
});