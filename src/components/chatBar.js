'use strict';

var React = require('react-native');

//var ChatInput = require('../elements/chatInput');

var {
  Icon,
} = require('react-native-icons');

var defaultStyles = require('../styles');

var {
  View,
  ScrollView,
  TextInput,
  StyleSheet, 
} = React;

var Styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  contentContainerStyle : {
    flex: 1,
  },
  body: {
    flex: 1,
    flexDirection: 'row',
    height: defaultStyles.chatBarHeight,
    backgroundColor: defaultStyles.blue,
    shadowColor: defaultStyles.dark,
    shadowOpacity: 0.5,
    shadowRadius: 2,
    shadowOffset: {
      width: 0,
      height: -1
    },
  },
  list: {
    height: defaultStyles.bodyHeight
  },
  wrap: {
    flexDirection: 'row',
    left: 16,
    top: 16,
    backgroundColor: defaultStyles.light,
    width: defaultStyles.bodyWidth - 32,
    height: 44,
    borderColor: defaultStyles.white,
    borderWidth: 1,
    borderRadius: 2,
  },
  input : {
    left: 20,
    fontFamily: 'Roboto-light',
    color: defaultStyles.dark,
    height: 42,
    width: defaultStyles.bodyWidth - 88
  },
  icon: {
    top: 10,
    left: 10,
    width: 24,
    height: 24,
  },
});

module.exports = React.createClass({
  propTypes: {
    user: React.PropTypes.object,
  },
  getInitialState: function () {
    return {
      message: null,
      scrollEnabled: false,
    };
  },
  inputFocused: function (refName) {
    setTimeout(() => {
      var scrollResponder = this.refs.scrollView.getScrollResponder();

      scrollResponder.scrollResponderScrollNativeHandleToKeyboard(
        React.findNodeHandle(this.refs[refName]),
        56,
        true
      );
    }, 50);
  },
  render: function() {
    return (
      <ScrollView
        ref='scrollView'
        keyboardDismissMode='on-drag'
        style={Styles.scroll}
        contentContainerStyle={Styles.contentContainerStyle}
        scrollEnabled={this.state.scrollEnabled}
      >
        <View style={Styles.list}>

        </View>
        <View ref='chat' style={Styles.body}>
          <View style={Styles.wrap}>
            <Icon
              name='fontawesome|paper-plane'
              size={24}
              color='#b4b4b4'
              style={Styles.icon}
            />
            <TextInput
              style={Styles.input}
              onChangeText={(message) => this.setState({message})}
              value={this.state.message}
              onFocus={this.inputFocused.bind(this, 'chat')}
            />
          </View>
        </View>
      </ScrollView>
    );
  }
});