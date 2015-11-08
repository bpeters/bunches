'use strict';

var React = require('react-native');

var defaultStyles = require('../styles');

var {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
} = React;

var {
  Icon,
} = require('react-native-icons');

var Styles = StyleSheet.create({
  body: {
    flex: 1,
    flexDirection: 'row',
    height: defaultStyles.navBarHeight,
    backgroundColor: defaultStyles.blue,
    shadowOpacity: 0.5,
    shadowRadius: 2,
    shadowOffset: {
      width: 0,
      height: 1
    },
  },
  left: {
    flex: 1,
    alignItems: 'flex-start',
  },
  center: {
    flex: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  right: {
    flex: 1,
    alignItems: 'flex-end',

  },
  title: {
    fontSize: 20,
    color: defaultStyles.white,
    fontFamily: 'Roboto-Medium',
  },
  iconView: {
    width: defaultStyles.navBarHeight,
    height: defaultStyles.navBarHeight,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }, 
  icon: {
    width: defaultStyles.navBarHeight,
    height: defaultStyles.navBarHeight,
  },
});

module.exports = React.createClass({
  propTypes: {
    title: React.PropTypes.string,
    onBackPress: React.PropTypes.func,
    onSubmitPress: React.PropTypes.func,
  },
  render: function() {
    return (
      <View style={Styles.body}>

        <View style={Styles.left}>
          <TouchableOpacity onPress={this.props.onBackPress}>
            <Icon
              name='fontawesome|times'
              size={25}
              color='#ffffff'
              style={Styles.icon}
            />
          </TouchableOpacity>
        </View>
        
        <View style={Styles.center}>
          <Text style={Styles.title}>
            {this.props.title}
          </Text>
        </View>



        <View style={Styles.right}>
         <TouchableOpacity onPress={this.props.onSubmitPress}>
            <Icon
              name='fontawesome|check'
              size={25}
              color='#ffffff'
              style={Styles.icon}
            />
          </TouchableOpacity>
        </View>



      </View>
    );
  }
});