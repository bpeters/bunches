'use strict';

var React = require('react-native');
var _ = require('lodash');

var NavBar = require('../components/navBar');
var Button = require('../elements/button');
var Success = require('../elements/success');
var Landing = require('../containers/landing');

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
  ScrollView,
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
  scroll: {
    flex: 1,
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
    marginTop: 16,
    fontFamily: 'Roboto-Regular',
    fontSize: 18,
    color: defaultStyles.medium,
  },
  labelName: {
    color: defaultStyles.dark,
    fontFamily: 'Roboto-Bold',
  },
  body: {
    width: 80,
    height: 80,
    borderRadius: 40,
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
    borderRadius: 40,
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  loadingView: {
    position: 'absolute',
    backgroundColor: 'transparent',
    top: defaultStyles.navBarHeight - 28,
    right: (defaultStyles.bodyWidth / 2) - 28,
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
      name: null,
      username: null,
      password: null,
      image: null,
      error: null,
    }
  },
  inputFocused: function (refName) {
    setTimeout(() => {
      this.refs.scrollView.getScrollResponder().scrollResponderScrollNativeHandleToKeyboard(
        React.findNodeHandle(this.refs[refName]),
        110,
        true
      );
    }, 50);
  },
  inputBlured: function (refName) {
    setTimeout(() => {
      this.refs.scrollView.getScrollResponder().scrollTo(0, 0);
    }, 50);
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
        this.props.actions.getUserByHandle(this.state.username)
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

    if (this.state.name) {
      this.props.actions.updateUser('name', this.state.name);
      this.setState({
        name: null,
      });
    }

  },
  onlogOut: function () {
    this.props.navigator.replace({
      name: 'landing',
      component: Landing,
      hasSideMenu: false,
    })
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
    var image = this.props.store.user.image ? this.props.store.user.image.url() : null;

    return (
      <Image
        style={Styles.image}
        source={{uri: this.state.image || image}}
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
  renderLoading: function () {
    return (
      <View style={Styles.loadingView}>
        <Loading />
      </View>
    );
  },
  renderButton: function () {
    return (
      <View>
        <Button
          onPress={this.onUpdateAccount}
          title='SAVE'
          color={defaultStyles.red}
        />
      </View>
    );
  },
  render: function() {

    if(Platform.OS === 'ios'){
      if (_.get(this.state.error, 'message')) {
        AlertIOS.alert(
          'Failed to Update Account',
          _.get(this.state.error, 'message'),
          [
            {text: 'Try Again', onPress: () => this.setState({error: null})},
          ]
        );
      }
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
                  {this.props.store.user.image || this.state.image ? this.renderImage() : this.renderIcon()}
                </View>
              </TouchableOpacity>
              <View style={Styles.info}>
                <Text style={[Styles.infoLabel, Styles.labelName]}>
                  {user.name}
                </Text>
                <Text style={Styles.infoLabel}>
                  {user.email}
                </Text>
              </View>
            </View>
            <ScrollView
              ref='scrollView'
              keyboardDismissMode='on-drag'
              style={Styles.scroll}
              scrollEnabled={false}
            >
              <View ref='input'>
                <Text style={Styles.label}>
                  Full Name
                </Text>
                <TextInput
                  style={Styles.input}
                  onChangeText={(name) => this.setState({name})}
                  value={this.state.name}
                  placeholder={user.name}
                  autoCorrect={false}
                  placeholderTextColor={defaultStyles.gray}
                />
                <Text style={Styles.label}>
                  Username
                </Text>
                <TextInput
                  style={Styles.input}
                  onChangeText={(username) => this.setState({username})}
                  value={this.state.username}
                  placeholder={user.handle}
                  placeholderTextColor={defaultStyles.gray}
                  autoCapitalize='none'
                  autoCorrect={false}
                  onFocus={this.inputFocused.bind(this, 'input')}
                  onBlur={this.inputBlured.bind(this, 'input')}
                />
                <Text style={Styles.label}>
                  Password
                </Text>
                <TextInput
                  ref='password'
                  style={Styles.input}
                  onChangeText={(password) => this.setState({password})}
                  placeholder="**********"
                  placeholderTextColor={defaultStyles.gray}
                  value={this.state.password}
                  secureTextEntry={true}
                  autoCapitalize='none'
                  autoCorrect={false}
                  onFocus={this.inputFocused.bind(this, 'input')}
                  onBlur={this.inputBlured.bind(this, 'input')}
                />
                {this.props.store.loading ? null : this.renderButton()}
              </View>
            </ScrollView>
          </View>
          <View style={Styles.buttonView}>
            <Button
              onPress={this.onlogOut}
              title='LOG OUT'
              color={defaultStyles.blue}
            />
          </View>
        {this.props.store.loading ? this.renderLoading() : null}
        {this.props.store.success ? this.renderSuccess() : null}
      </View>
    );
  }
});