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
    backgroundColor: "cyan"
  }, 
  image: {

    height: 176,
    backgroundColor: "cyan"
  },  
  imageText: {
    marginTop: 136,
    marginLeft: 16,
    color: defaultStyles.white,
    fontSize: 16,
    fontFamily: 'Roboto-Regular',
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover', // or 'stretch'
  }
});

module.exports = React.createClass({
  propTypes: {
    onPress: React.PropTypes.func,
    photo: React.PropTypes.string,
    imageText: React.PropTypes.string,
  },
  render: function() {
    return (
      <View>
        <TouchableOpacity onPress={this.props.onPress}>
          <Image
            source={{
              uri: this.props.photo,
            }}
            style={Styles.image}
            />
            <Text style={Styles.imageText}>            
              {this.props.imageText}
            </Text>
            
            
            
        </TouchableOpacity>
      </View>
    );
  }
});