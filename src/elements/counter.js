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
    flex:1,
    flexDirection:'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingRight:10,
    alignSelf:'stretch',
  },
  iconView: {
    height:16,
    width:16,
    borderRadius: 8,
  },
  iconText: {
    fontSize: 16,
    fontFamily: 'Roboto-Regular',
    paddingRight: 2,
  },
  icon: {
    width: 16,
    height: 16,
  }, 
});

module.exports = React.createClass({
  propTypes: {
    users: React.PropTypes.number,
    messages: React.PropTypes.number,
    color: React.PropTypes.string,
  },
  render: function() {

    // Fix numbers
    var u = this.props.users;
    var m = this.props.messages;

    // Set colors
    if(this.props.color=="white") {
      if(u>=1000){
        u = (u/1000).toFixed(1) + "K";
      }
      if(m>=1000){
        m = (m/1000).toFixed(1) + "K";
      }

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
          <Text style={[Styles.iconText,textUser]}>
            {u}
          </Text>
          <View style={[Styles.iconView,bgUser]}>
            <Icon
              name='material|account'
              size={12}
              color={iconUser}
              style={Styles.icon}
            />
          </View>
        </View>
        <View style={Styles.bolt}>
          <Text style={[Styles.iconText,textChat]}>
            {m}
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