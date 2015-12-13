'use strict';

var React = require('react-native');
var _ = require('lodash');

var defaultStyles = require('../styles');

var {
  Icon,
} = require('react-native-icons');

var {
  View,
  TouchableOpacity,
  Text,
  ListView,
  StyleSheet,
  Image,
  CameraRoll,
  NativeModules,
} = React;

var Styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: defaultStyles.chatBarHeight,
    width: defaultStyles.bodyWidth,
    borderTopColor: defaultStyles.dark,
    borderTopWidth: 1,
    borderBottomColor: defaultStyles.medium,
    borderBottomWidth: 1,
    backgroundColor: defaultStyles.dark,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 4,
  },
  image: {
    width: 100,
    height: 100,
    borderWidth: 2,
    borderColor: defaultStyles.white,
  },
  icon: {
    borderRadius: 9,
    backgroundColor: defaultStyles.blue,
    width: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

module.exports = React.createClass({
  propTypes: {
    store: React.PropTypes.object,
    onPressCameraRollClose: React.PropTypes.func,
    onPressCameraRollPhoto: React.PropTypes.func,
  },
  getInitialState: function() {
    return {
      images: [],
      dataSource: new ListView.DataSource({
        rowHasChanged: (r1, r2) => r1 !== r2
      }),
    };
  },
  componentDidMount: function () {
    var fetchParams = {
      first: 25,
    };

    CameraRoll.getPhotos(fetchParams, this.storeImages, this.logImageError);
  },
  storeImages: function (data) {
    var assets = data.edges;
    var images = assets.map( asset => asset.node.image );

    this.setState({
      images: images,
    });
  },
  logImageError: function (err) {
    console.log(err);
  },
  onPressPhoto: function (rowData) {
    var image = rowData.uri.replace('file://', '');

    console.log(rowData, image);
    //this.props.onPressCameraRollPhoto('data:image/jpeg;base64,' + rowData.uri.replace('file://', ''));
    
    NativeModules.ReadImageData.readImage(image, (image64) => {
      console.log('data:image/jpeg;base64,' + image64);
      this.props.onPressCameraRollPhoto('data:image/jpeg;base64,' + image64)
    });
  },
  renderChatRow: function(rowData) {
    return (
      <TouchableOpacity onPress={() => {this.onPressPhoto(rowData)}}>
        <View style={Styles.row}>
          <Image
            style={Styles.image}
            source={{ uri: rowData.uri }}
          />
        </View>
      </TouchableOpacity>
    );
  },
  renderChatHeader: function() {
    return (
      <View style={Styles.row}>
        <TouchableOpacity onPress={() => this.props.onPressCameraRollClose()}>
          <Icon
            name='material|close'
            size={14}
            color={defaultStyles.white}
            style={Styles.icon}
          />
        </TouchableOpacity>
      </View>
    );
  },
  render: function() {
    return (
      <View style={Styles.container}>
        <ListView
          horizontal={true}
          dataSource={this.state.dataSource.cloneWithRows(this.state.images)}
          renderRow={this.renderChatRow}
          renderHeader={this.renderChatHeader}
          keyboardShouldPersistTaps={true}
          automaticallyAdjustContentInsets={false}
        />
      </View>
    );
  }
});