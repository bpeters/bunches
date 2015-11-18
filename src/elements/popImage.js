'use strict';

var React = require('react-native');

var defaultStyles = require('../styles');

var {
  View,
  TouchableOpacity,
  Image,
  StyleSheet,
  Text,
} = React;

var Styles = StyleSheet.create({  
  imageView: {
    height: 176,
    backgroundColor: defaultStyles.green,
  },
  image: {
    height: 176,
  },
  imageText: {
    marginTop: 136,
    marginLeft: 16,
    color: defaultStyles.white,
    fontSize: 16,
    fontFamily: 'Roboto-Regular',
  },
});

module.exports = React.createClass({
  propTypes: {
    onPress: React.PropTypes.func,
    photo: React.PropTypes.string,
  },
  render: function() {
    if (this.props.photo) {
      return (
        <View>
          <TouchableOpacity activeOpacity={0.9} onPress={this.props.onPress}>
            <Image
              source={{
                uri: this.props.photo,
              }}
              style={Styles.image}
            /> 
          </TouchableOpacity>
        </View>
      );
    } else {
      return (
        <View style={Styles.imageView}>
          <Text style={Styles.imageText}>
            (Optional) Add Photo
          </Text>
        </View>
      );
    }
  }
});