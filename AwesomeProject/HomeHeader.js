'use strict';

var React = require('react-native');
var {
    TouchableOpacity,
    Image,
    StyleSheet,
    Text,
    View,
    PixelRatio,
    Platform
} = React;

var HomeHeader = React.createClass({

    navTo : function ( id ) {
        //alert(id + 1);
        if ( id != this.props.route.id ) {
            this.props.navigator.replace({ id : id });
        }
    },

    goSearchView : function () {
        // alert('goSearchView');
        this.props.navigator.push({ id : 'search'});
    },

    /*source={require('image!title-2')}*/
    render : function () {
        return (
            <View style={styles.header}>
                <View style={styles.titleContainer}>
                    <Image
                        source={require('./images/title.png')}
                        style={styles.titleImg}
                    />
                    <View style={styles.searchIconWrap}>
                        <TouchableOpacity onPress={this.goSearchView}>
                            <View style={styles.searchIconInner}>
                                <Image
                                    source={require('./images/search.png')}
                                    style={styles.searchIcon}
                                />
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.subContainer}>
                    <View
                        style={[styles.item, "todaySpot" == this.props.route.id ? styles.itemSelected : null]}>
                        <TouchableOpacity
                            onPress={()=> {
                                this.navTo( "todaySpot" )
                            }}>
                            <View style={styles.itemInner}>
                                <Text
                                    style={[styles.text, "todaySpot" == this.props.route.id ? styles.textSelected : null]}>
                                    产经新闻
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View
                        style={[styles.item, "news" == this.props.route.id ? styles.itemSelected : null]}>
                        <TouchableOpacity
                            onPress={()=> {
                                this.navTo( "news" )
                            }}>
                            <View style={styles.itemInner}>
                                <Text
                                    style={[styles.text, "news" == this.props.route.id ? styles.textSelected : null]}>
                                    市场分析
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View
                        style={[styles.item, "dynamic" == this.props.route.id ? styles.itemSelected : null]}>
                        <TouchableOpacity
                            onPress={()=> {
                                this.navTo( "dynamic" )
                            }}>
                            <View style={styles.itemInner}>
                                <Text
                                    style={[styles.text, "dynamic" == this.props.route.id ? styles.textSelected : null]}>
                                    行业聚焦
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View
                        style={[styles.item, "deep" == this.props.route.id ? styles.itemSelected : null]}>
                        <TouchableOpacity
                            onPress={()=> {
                                this.navTo( "deep" )
                            }}>
                            <View style={styles.itemInner}>
                                <Text
                                    style={[styles.text, "deep" == this.props.route.id ? styles.textSelected : null]}>
                                    行业研究
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        )
    }
});

var styles = StyleSheet.create({
    header : {
        marginTop : 'ios' === Platform.OS ? 20 : 0
    },
    titleContainer : {
        height : 40,
        flexDirection : 'row',
        justifyContent : 'center'
    },
    titleImg : {
        width : 77,
        height : 20,
        marginTop : 10
    },
    searchIconWrap : {
        position : 'absolute',
        right : 0
    },
    searchIconInner : {
        padding : 10,
        paddingLeft : 20
    },
    searchIcon : {
        width : 18,
        height : 19
    },
    subContainer : {
        flex : 1,
        height : 40,
        paddingLeft : 4,
        paddingRight : 4,
        flexDirection: 'row',
        justifyContent : 'flex-start',
        backgroundColor : '#000',
        overflow : 'hidden'
    },
    item : {
        borderTopWidth: 3,
        borderColor: '#000'
    },
    itemInner : {
        width : 78,
        height : 37
    },
    itemSelected : {
        borderColor: 'blue'
    },
    text: {
        width : 80,
        height : 17,
        fontSize : 15,
        marginTop : 10,
        /*lineHeight : 37,*/
        color : "#ddd",
        textAlign: 'center'
    },
    textSelected : {
        color : '#fff'
    }
});

module.exports = HomeHeader;