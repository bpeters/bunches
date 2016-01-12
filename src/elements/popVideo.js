'use strict';

var React = require('react-native');

var IconButton = require('../elements/iconButton');

var config = require('../config/default');

var defaultStyles = require('../styles');

var {
  Icon,
} = require('react-native-icons');

var {
  View,
  TouchableOpacity,
  Image,
  StyleSheet,
  Text,
} = React;

var Styles = StyleSheet.create({
  image: {
    height: 176,
    borderRadius: 4,
  },
  iconViewCenter: {
    top: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
});

module.exports = React.createClass({
  propTypes: {
    onPress: React.PropTypes.func,
    photo: React.PropTypes.string,
  },
  render: function() {
    var imageUrl = config.aws.url + this.props.photo;

    return (
      <View>
        <TouchableOpacity activeOpacity={0.9} onPress={this.props.onPress}>
          <Image
            source={{
              uri: imageUrl,
            }}
            style={Styles.image}
          > 
          <View style={Styles.iconViewCenter}>
            <IconButton
              onPress={this.props.onPress}
              icon='material|play'
              size={76}
            />
          </View>
          </Image>
        </TouchableOpacity>
      </View>
    );
  }
});