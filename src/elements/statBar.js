'use strict';

var React = require('react-native');
var moment = require('moment');

var defaultStyles = require('../styles');

var Counter = require('../elements/counter');

var {
  Icon,
} = require('react-native-icons');

var {
  View,
  StyleSheet,
  Text,
} = React;

var Styles = StyleSheet.create({  
  statBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: defaultStyles.light,
    borderTopWidth: 1,
    borderTopColor: defaultStyles.grayLight,
    height: defaultStyles.statBarHeight,
  },
  icon: {
    height: 16,
    width: 16,
    marginRight: 5,
    borderRadius: 8,
  },
  iconFill: {
    height: 16,
    width: 16,
    marginRight: 5,
    backgroundColor: defaultStyles.red,
    borderRadius: 8,
  },
  element: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  score: {
    color: defaultStyles.red,
  },
  numbers : {
    color: defaultStyles.darkMedium,
    fontFamily: 'Roboto-Regular',
  },
});

module.exports = React.createClass({
  propTypes: {
    score: React.PropTypes.number,
    userCount: React.PropTypes.number,
    expiration: React.PropTypes.instanceOf(Date),
  },
  render: function() {
    var timeLeft = moment(this.props.expiration) - moment();
    var date = moment.duration(timeLeft, 'milliseconds');
    var hours = Math.floor(date.asHours());
    var mins = Math.floor(date.asMinutes()) - hours * 60;
    var minutes = (mins < 10) ? ("0" + mins) : mins;
    var time = hours + ':' + minutes;

    return (
      <View style={[Styles.statBar,defaultStyles.statBar]}>
        <View style={Styles.element}>
          <View style={Styles.iconFill}>
            <Icon
              name='fontawesome|bolt'
              size={12}
              color={defaultStyles.white}
              style={Styles.icon}
            />
            </View>
          <Text style={Styles.score}>
            {this.props.score}
          </Text>
        </View>
        <View style={Styles.element}>
          <Icon
            name='material|accounts'
            size={16}
            color={defaultStyles.darkMedium}
            style={Styles.icon}
          />
          <Text style={Styles.numbers}>
            {this.props.userCount}
          </Text>
        </View>
        <View style={Styles.element}>
          <Icon
            name='ion|android-time'
            size={16}
            color={defaultStyles.darkMedium}
            style={Styles.icon}
          />
          <Text style={Styles.numbers}>
            {time}
          </Text>
        </View>
      </View>
    );
  }
});