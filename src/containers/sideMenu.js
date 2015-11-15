'use strict';

var React = require('react-native');

var ReactSideMenu = require('react-native-side-menu');
var Menu = require('../components/menu');

var defaultStyles = require('../styles');

var {
  View,
  StyleSheet,
} = React;

var Styles = StyleSheet.create({
  view: {
    shadowColor: defaultStyles.dark,
    shadowOpacity: 0.5,
    shadowOffset: {
      width: 0,
      height: 2
    },
  },
});

module.exports= React.createClass({
  propTypes: {
    navigator: React.PropTypes.object,
    route: React.PropTypes.object,
    user: React.PropTypes.object,
    store: React.PropTypes.object,
    actions: React.PropTypes.object,
  },
  getInitialState: function() {
    return {
      touchToClose: false,
    };
  },
  handleOpenWithTouchToClose: function () {
    this.setState({
      touchToClose: true,
    });
  },
  handleChange: function (isOpen) {
    if (!isOpen) {
      this.setState({
        touchToClose: false,
      });
    }
  },
  render: function() {
    var Component = this.props.route.component;

    return (
      <ReactSideMenu
        openMenuOffset={defaultStyles.bodyWidth - 56}
        menu={
          <Menu
            navigator={this.props.navigator}
            user={this.props.user}
            store={this.props.store}
          />
        }
        touchToClose={this.state.touchToClose}
        onChange={this.handleChange}
      >
        <View style={Styles.view}>
          <Component
            navigator={this.props.navigator}
            route={this.props.route}
            user={this.props.user}
            store={this.props.store}
            actions={this.props.actions}
            menuButton={{
              onPress: this.handleOpenWithTouchToClose
            }}
          />
        </View>
      </ReactSideMenu>
    );
  }
});