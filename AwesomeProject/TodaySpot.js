'use strict';

var React = require('react-native');
var {
    AppRegistry,
    Image,
    ListView,
    StyleSheet,
    Text,
    View,
} = React;

var HomeHeader = require( './HomeHeader' );
var NewsList = require( './NewsList' );
var TabBanner = require( './TabBanner' );

var TodaySpot = React.createClass({
    render : function () {
        return (
            <View  style={styles.container}>
                <View>
                    <HomeHeader navigator={this.props.navigator} route={this.props.route}></HomeHeader>
                </View>
                <NewsList {...this.props}></NewsList>
            </View>
        );
    }
});
var styles = StyleSheet.create({
    container : {
        flex : 1,
        flexDirection: 'column',
        justifyContent : 'flex-start',
        backgroundColor : '#F5FCFF',
        marginTop : 0
    }
});

module.exports = TodaySpot;