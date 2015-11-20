'use strict';

var React = require('react-native');
var _ = require('lodash');

var NavBar = require('../components/navBar');
var Button = require('../elements/button');
var Success = require('../elements/success');
var ProfileContainer = require('../components/profileContainer');
var IconButton = require('../elements/iconButton');


var defaultStyles = require('../styles');

var {
  Icon,
} = require('react-native-icons');

var {
  View,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  Platform,
  AlertIOS,
} = React;


var Styles = StyleSheet.create({
  view: {
    height: defaultStyles.bodyHeight,
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    backgroundColor: defaultStyles.background,
    flexDirection:'column',
  },
  picView: {
    flex: 1,
    alignSelf:'stretch',
    alignItems:'center',
    justifyContent:'center',
    height: 100,
  },
  container: {
    flex: 2,
    alignSelf:'stretch',
  },
  overlayText: {
    position:'absolute',
    top: 75,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    width:defaultStyles.window.width,
  },
  iconView: {
    position:'absolute',
    top: 20,
    left: 20,
    width: 30,
    height: 30,
  },
  info: {
    color: defaultStyles.white,
    fontSize: 26,
  },


  body: {
    width: 80,
    height: 80,
    backgroundColor: defaultStyles.medium,
  },
  icon: {
    left: 12,
    top: 12,
    width: 56,
    height: 56,
  },
  image: {
    flex:1,
    alignSelf:'stretch',
    alignItems:'stretch',
    justifyContent: 'center',
  },
});

module.exports = React.createClass({
  propTypes: {
    navigator: React.PropTypes.object,
    route: React.PropTypes.object,
    store: React.PropTypes.object,
    actions: React.PropTypes.object,
    menuButton: React.PropTypes.object,
  },
  getInitialState: function(){
    return {
      username: null,
      password: null,
      image: 'http://files.parsetfss.com/0fddd9cf-f4d4-4699-81df-b9e09d9a5f66/tfss-7ad46de2-1f2b-4817-8862-c1932f826496-image.jpeg',
      error: this.props.store.error,
    }
  },
  onBack: function(){
    this.props.navigator.pop();
  },



  renderSuccess: function () {
    setTimeout(() => {
      this.props.actions.clearSuccess();
    }, 3000);

    return (
      <View style={Styles.successView}>
        <Success />
      </View>
    );
  },
  render: function() {
    console.log(this.props.store.profileMessages);
    var user = {};
    user.name = 'hunter';
    user.handle = 'pooper';

    return (
      <View style={Styles.view}>
        <View style={Styles.picView}>

          <Image
            style={Styles.image}
            source={{uri: this.state.image}}
          />


           <View style={Styles.overlayText}>
            <Text style={Styles.info}>{user.name ? user.name : null}</Text>
            <Text style={Styles.info}>{user.handle ? "@" + user.handle : null}</Text>
          </View>



          <View style={Styles.iconView}>
            <IconButton
              onPress={this.onBack}
              icon='material|arrow-left'
              size={30}
            />
          </View>

          

        </View>
        <View style={Styles.container}>
          <ProfileContainer
            chats={this.props.store.profileMessages}
          />
        </View>


      </View>
    );
  }
});