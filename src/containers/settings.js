'use strict';

var React = require('react-native');
var _ = require('lodash');

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
  AlertIOS,
  ScrollView,
} = React;

var AddPhoto;

if (Platform.OS === 'android') {
  AddPhoto = require('./settingsPhotoAndroid');
} else {
  AddPhoto = require('./settingsPhotoIOS');
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
  input: {
    width: defaultStyles.bodyWidth - 16 - 16,
    height: 56,
    borderRadius: 4,
    marginTop: 16,
    backgroundColor: defaultStyles.white,
    paddingLeft: 16,
    fontFamily: 'Roboto-Light',
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
    marginTop: 8,
    fontFamily: 'Roboto-Regular',
    fontSize: 16,
    color: defaultStyles.medium,
    width: defaultStyles.bodyWidth - 16 - 16 - 56 - 40,
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
        116,
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
        this.props.actions.updateUser('password', _.trim(this.state.password));
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
      this.props.actions.updateUser('name', _.trim(this.state.name));
      this.setState({
        name: null,
      });
    }

  },
  onlogOut: function () {
    var Landing = require('./landing');

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
  renderButton: function () {
    return (
      <View>
        <Button
          onPress={this.onUpdateAccount}
          title='SAVE'
          color={defaultStyles.blue}
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
            clearSuccess={this.props.actions.clearSuccess}
            loading={this.props.store.loading}
            success={this.props.store.success}
            store={this.props.store}
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
                  {'@' + user.handle}
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
                <TextInput
                  style={Styles.input}
                  onChangeText={(name) => this.setState({name})}
                  value={this.state.name}
                  placeholder='Full Name'
                  autoCorrect={false}
                  placeholderTextColor={defaultStyles.gray}
                />
                <TextInput
                  style={Styles.input}
                  onChangeText={(username) => this.setState({username})}
                  value={this.state.username}
                  placeholder='Username'
                  placeholderTextColor={defaultStyles.gray}
                  autoCapitalize='none'
                  autoCorrect={false}
                  onFocus={this.inputFocused.bind(this, 'input')}
                  onBlur={this.inputBlured.bind(this, 'input')}
                />
                <TextInput
                  ref='password'
                  style={Styles.input}
                  onChangeText={(password) => this.setState({password})}
                  placeholder="Password"
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
          <View style={defaultStyles.buttonView}>
            <Button
              onPress={this.onlogOut}
              title='LOG OUT'
              color={defaultStyles.red}
            />
          </View>
      </View>
    );
  }
});