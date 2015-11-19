'use strict';

var React = require('react-native');

var NavBar = require('../components/navBar');
var Button = require('../elements/button');

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
} = React;

var AddPhoto;

if (Platform.OS === 'android') {
  AddPhoto = require('./addPhotoAndroid');
} else {
  AddPhoto = require('./addPhotoIOS')
}

var Styles = StyleSheet.create({
  view: {
    height: defaultStyles.bodyHeight,
    paddingTop: defaultStyles.navBarHeight,
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    backgroundColor: defaultStyles.background,
  },
  inputView: {
    left: 16,
    top: 16,
  },
  label: {
    marginTop: 16,
    marginBottom: 16,
    fontFamily: 'Roboto-Bold',
  },
  input: {
    width: defaultStyles.bodyWidth - 16 - 16,
    height: 56,
    borderRadius: 4,
    marginBottom: 16,
    backgroundColor: defaultStyles.white,
    paddingLeft: 16,
    fontFamily: 'Roboto-Light',
  },
  buttonView: {
    position: 'absolute',
    bottom: 50,
    left: 16,
  },
  static: {
    flex:1,
    flexDirection:'row',
  },
  info: {
    flex:1,
    flexDirection: 'column',
    marginLeft:16,
  },
  infoLabel: {
    marginBottom: 16,
    fontFamily: 'Roboto-Bold',
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
    height: 80,
    width: 80,
    borderRadius: 80,
    justifyContent: 'center',
  },
});

module.exports = React.createClass({
  propTypes: {
    navigator: React.PropTypes.object,
    route: React.PropTypes.object,
    user: React.PropTypes.object,
    store: React.PropTypes.object,
    actions: React.PropTypes.object,
    menuButton: React.PropTypes.object,
  },
  getInitialState: function(){
    return {
      username: this.props.user.username,
      password: null,
      image: this.props.user.image,
    }
  },
  onCamera: function(){
    this.props.navigator.push({
      name: "add photo",
      component: AddPhoto,
      hasSideMenu: false,
      bunch: this.props.store.bunch,
    });
  },
  onUpdateAccount: function () {

  },
  renderIcon: function() {
    return (
      <Icon
        name='ion|person'
        size={56}
        color='#ffffff'
        style={Styles.icon}
      />
    );
  },
  renderImage: function() {
    return (
      <Image
        style={Styles.image}
        source={{uri: this.props.user.image}}
      />
    )
  },
  render: function() {
    return (
      <View style={Styles.view}>
        <NavBar
          title='Account'
          onBackPress={this.onBackPress}
        />
        <View style={Styles.inputView}>
          <View style={Styles.static}>
            <TouchableOpacity onPress={this.onCamera}>
              <View style={Styles.body}>
                {this.props.user.image ? this.renderImage() : this.renderIcon()}
              </View>
            </TouchableOpacity>
            <View style={Styles.info}>
              <Text style={Styles.infoLabel}>
                {this.props.user.name}
              </Text>
              <Text style={Styles.infoLabel}>
                {this.props.user.email}
              </Text>
            </View>
          </View>
          <Text style={Styles.label}>
            Username
          </Text>
          <TextInput
            style={Styles.input}
            onChangeText={(username) => this.setState({username})}
            placeholder={this.state.username}
          />
          <Text style={Styles.label}>
            Password
          </Text>
          <TextInput
            ref='password'
            style={Styles.input}
            onChangeText={(password) => this.setState({password})}
            placeholder="**********"
            secureTextEntry={true}
          />
        </View>
        <View style={Styles.buttonView}>
          <Button
            onPress={this.onUpdateAccount}
            title='SAVE'
            color={defaultStyles.red}
          />
        </View>
      </View>
    );
  }
});