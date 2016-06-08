/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var React = require('react-native');

var {
    AppRegistry,
    Image,
    StyleSheet,
    Text,
    View,
} = React;

var MOCKED_MOVIES_DATA = [
    {title: 'Title', year: '2015', posters: {thumbnail: 'http://i.imgur.com/UePbdph.jpg'}}
];

var AwesomeProject = React.createClass({
  render: function() {
    return (
      <View style={styles.container}>
          <View style={{height : 200,backgroundColor : 'red'}}></View>
          <View style={{height : 200,backgroundColor : 'blue'}}></View>
          <View style={{height : 200,backgroundColor : 'green'}}></View>
          <View style={{height : 200,backgroundColor : 'yellow'}}></View>
          <View style={{height : 200,backgroundColor : 'black'}}></View>
      </View>
    );
  }
});

var styles = StyleSheet.create({
    container: {
        /*flex: 1,
        justifyContent: 'center',
        alignItems: 'center',*/
        /*backgroundColor: '#F5FCFF'*/
        backgroundColor: '#ddd'
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5
    },
    box : {
        height : 200,
    }

});

AppRegistry.registerComponent('AwesomeProject', () => AwesomeProject);
