'use strict';

var React = require('react-native');
var _ = require('lodash');

var NavBar = require('../components/navBar');
var Button = require('../elements/button');
var Success = require('../elements/success');

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

var AddPhoto;
var Loading;

if (Platform.OS === 'android') {
  AddPhoto = require('./settingsPhotoAndroid');
  Loading = require('../elements/loadingAndroid');
} else {
  AddPhoto = require('./settingsPhotoIOS');
  Loading = require('../elements/loadingIOS');
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
  successView: {
    position: 'absolute',
    backgroundColor: 'transparent',
    top: defaultStyles.navBarHeight - 28,
    left: (defaultStyles.bodyWidth / 2) - 28
  },
  buttonView: {
    position: 'absolute',
    bottom: 16,
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
    fontSize: 24,
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
    backgroundColor: defaultStyles.background,
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
      image: this.props.store.user.image,
      error: this.props.store.error,
    }
  },

  onPhotoChange: function(image) {
    this.setState({image});
    this.props.navigator.pop();
  },


  onCamera: function(){
    this.props.navigator.push({
      name: "add photo",
      component: AddPhoto,
      hasSideMenu: false,
      bunch: this.props.store.bunch,
      onPhotoChange: this.onPhotoChange,
    });
  },
  onUpdateAccount: function () {
    if (this.state.username) {
      var usernameCheck = new RegExp("^[A-Za-z0-9]{1,15}$");

      if (!usernameCheck.test(this.state.username)) {
        this.setState({
          error: {
            message: 'username needs to be less than 16 characters and contain no spaces or special characters'
          }
        });
      } else {
        this.props.actions.checkUsername(this.state.username)
          .then((user) => {
            if (user) {
              this.setState({
                error: {
                  message: 'username is already taken'
                }
              });
            } else {
              this.props.actions.updateUser('handle', this.state.username);
              this.setState({
                username: null,
              });
            }
          });
      }
    }

    if (this.state.password) {
      if (this.state.password.length < 8) {
        this.setState({
          error: {
            message: 'password must be greater than or equal to 8 characters in length'
          }
        });
      } else {
        this.props.actions.updateUser('password', this.state.password);
        this.setState({
          password: null,
        });
      }
    }

    if (this.state.image) {
      this.props.actions.updateUser('image', this.state.image);
      this.setState({
        image: null,
      });      
    }


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
        source={{uri: this.state.image}}
      />
    )
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
    if (_.get(this.state.error, 'message')) {
      AlertIOS.alert(
        'Failed to Update Account',
        _.get(this.state.error, 'message'),
        [
          {text: 'Try Again', onPress: () => this.setState({error: null})},
        ]
      );
    }

    var user = _.get(this.props.store.user, 'attributes') || this.props.store.user;

    return (
      <View style={Styles.view}>

        <NavBar
          title='Account'
          menuButton={this.props.menuButton}
        />
        <View style={Styles.inputView}>
          <View style={Styles.static}>
            <TouchableOpacity onPress={this.onCamera}>
              <View style={Styles.body}>
                {this.state.image ? this.renderImage() : this.renderIcon()}
              </View>
            </TouchableOpacity>
            <View style={Styles.info}>
              <Text style={Styles.infoLabel}>
                {user.name}
              </Text>
              <Text style={Styles.infoLabel}>
                {user.email}
              </Text>
            </View>
          </View>
          <Text style={Styles.label}>
            Username
          </Text>
          <TextInput
            style={Styles.input}
            onChangeText={(username) => this.setState({username})}
            value={this.state.username}
            placeholder={user.handle}
          />
          <Text style={Styles.label}>
            Password
          </Text>
          <TextInput
            ref='password'
            style={Styles.input}
            onChangeText={(password) => this.setState({password})}
            placeholder="**********"
            value={this.state.password}
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
        {this.props.store.success ? this.renderSuccess() : null}
      </View>
    );
  }
});