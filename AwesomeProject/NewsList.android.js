'use strict';

var React = require('react-native');
var {
    AsyncStorage,
    TouchableOpacity,
    Image,
    ListView,
    StyleSheet,
    Text,
    View,
    ToastAndroid
} = React;

//var RefreshableListView = require('./react-native-refreshable-listview/index');
//var RefreshableListView = require( './RCTRefreshListView/RefreshableListView' );
//var TabBanner = require( './TabBanner' );

/**
 * @property navigator
 * @property reqUrl
 * @property keyword
 */
var NewsList = React.createClass({
    getInitialState: function() {
        return {
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2
            }),
            initSize : 0,
            loaded: false,
            withBanner : 'withbanner' == this.props.type,
            bannerData : {
                forBanner : true
            }
        };
    },

    componentDidMount: function() {
        var self = this;
        this.state.listData = [];

        /*this.removeItem( 'listData' );
        return;*/

        // get stored data if it is not in searching view
        /*if ( '' == this.props.keyword ) {
            this.getItem( 'listData' ).then(function ( data ) {

                data && ( self.state.listData = JSON.parse( data ) );

                if ( !self.state.listData.length ) {
                    self.fetchData(null, 'pull');
                }
                else {
                    self.updateListView();
                }
            }).catch((error) => {
                console.warn(error);
            }).done();

        } else {
            self.fetchData( null, 'pull' );
        }*/

        // just get the newest list on android
        self.fetchData(null, 'down');
    },

    componentWillUnmount : function () {
        // stored to disk if necessary
        /*if ( !this.props.keyword ) {
            if ( this.state.listData.length > 100 )
                this.setItem( 'listData', JSON.stringify( this.state.listData.slice(0, 100) ) );
            else
                this.setItem( 'listData', JSON.stringify( this.state.listData ) );
        }*/
    },

    async getItem ( key ) {
        try {
            var value = await AsyncStorage.getItem( this.props.storageKey + ':' + key );
            return value;
        } catch (error) {
            alert( error.message );
        }
    },

    async setItem( key, value ) {
        try {
            var value = await AsyncStorage.setItem( this.props.storageKey + ':' + key, value );
            return value;
        } catch (error) {
            alert( error.message );
        }
    },

    async removeItem ( key ) {
        try {
            var value = await AsyncStorage.removeItem( this.props.storageKey + ':' + key );
            return value;
        } catch (error) {
            alert( error.message );
        }
    },

    updateListView : function () {
        // include banner info if necessary
        var data = this.state.listData;
        if ( this.state.withBanner ) {
            data = [ this.state.bannerData ];
            data = data.concat( this.state.listData );
        }
        // update
        this.setState({
            dataSource: this.state.dataSource.cloneWithRows( data ),
            loaded: true
        });
    },

    fetchData : function ( cb, type ) {

        var len = this.state.listData.length;
        var limit = 10;
        if ( 'pull' == type ) {
            limit = len ? 100 : 10;
        }
        var id = '';
        if ( this.state.listData.length )
            id = 'down' == type ? this.state.listData[ len - 1 ].id : this.state.listData[0].id;

        var reqUrl = this.props.reqUrl + '&loadType=' + type + '&limit=' + limit + ( id ? ( '&id=' + id ) : '' );
        this.props.keyword && ( reqUrl += '&content=' + encodeURIComponent(this.props.keyword) );
        this.props.tabType && ( reqUrl += '&type=' + this.props.tabType );

        //alert(reqUrl);
        //ToastAndroid.show(reqUrl, ToastAndroid.LONG)
        fetch( reqUrl )
            .then((response) => {
                var ret = null;
                if ( 200 == response.status )
                    ret = response.json();
                return ret;
            })
            .then((responseData) => {
                /*alert(responseData)
                return;*/
                if ( !responseData || undefined === responseData.length ) {
                    console.warn( '数据加载错误' );
                    return;
                }

                if ( 0 === responseData.length ) {
                    this.setState({
                        loaded: true
                    });
                    return;
                }

                /*
                 * update data
                 */
                if ( 'pull' == type ) {
                    // pull refresh
                    this.state.listData = responseData.concat( this.state.listData );
                } else {
                    // down refresh
                    this.state.listData = this.state.listData.concat( responseData );
                }

                /*
                 * update view
                 */
                this.updateListView();

                /*
                 * finish
                 */
                // call callback for RefreshableListView
                cb && cb();
            })
            .catch((error) => {
                //alert(error);
                console.warn(error);
            })
            .done();
    },

    loadData : function ( cb ) {
        this.fetchData( cb, 'pull' );
    },

    loadPrev : function () {
        this.fetchData( null, 'down' );
    },

    render: function() {
        if (!this.state.loaded) {
            return this.renderLoadingView();
        }

        return (
            <ListView
                dataSource={this.state.dataSource}
                renderRow={this.renderRow}
                style={styles.listView}
                automaticallyAdjustContentInsets={false}
                onEndReached={this.loadPrev}
                onEndReachedThreshold={10}
            />
        );
    },

    renderLoadingView: function() {
        return (
            <View style={styles.container}>
                <Text>
                    Loading...
                </Text>
            </View>
        );
    },

    itemPress : function ( itemId ) {
        // sourceUrl  = sourceUrl.replace( /^\s+|\s+$/, '' );
        this.props.navigator.push({ id : 'detail', itemId });
    },

    renderRow: function(row) {
        if ( this.state.withBanner && row.forBanner ) {
            return (
                <View></View>
            );
        }
        else {
            var imgUrl = '';
            row.imgs && row.imgs.length && row.imgs[0] && ( imgUrl = row.imgs[0] );
            return (
                <TouchableOpacity
                    onPress={()=> {
                        this.itemPress( row.id );
                    }}>
                    <View style={styles.container}>
                        <View style={[styles.leftContainer, imgUrl ? styles.leftContainerNarrow : null]}>
                            <View style={styles.titleView}>
                                <Text style={styles.title}>{row.title}</Text>
                            </View>
                            <View style={styles.btmView}>
                                <Text style={styles.srcName}>{row.sourceSiteName}</Text>
                                <Text style={styles.date}>{row.date}</Text>
                            </View>
                        </View>
                        {imgUrl ?
                        <Image
                            source={{uri: row.imgs[0]}}
                            style={styles.img}
                        />
                        :
                        <View></View>
                        }
                    </View>

                </TouchableOpacity>
            );
        }
    }
});

var styles = StyleSheet.create({
    listView: {
        flex : 1,
        paddingBottom : 100
    },
    container: {
        flex: 1,
        margin : 10,
        marginBottom : 0,
        paddingBottom : 10,
        borderBottomWidth : 1,
        borderBottomColor : '#E6E6E6',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    leftContainer : {
        flex: 1
    },
    leftContainerNarrow : {
        width : 264
    },
    titleView : {
        flex : 1,
        height : 36,
        marginTop : 4,
        overflow : 'hidden'
    },
    title : {
        lineHeight : 18,
        fontSize : 15
    },
    btmView : {
        flex : 1,
        marginTop : 8,
        flexDirection : 'row',
        justifyContent : 'flex-start'
    },
    srcName : {
        fontSize : 12,
        color : '#4A90E2'
    },
    date : {
        fontSize : 12,
        color : '#9B9B9B',
        paddingLeft : 2
    },
    img : {
        width : 90,
        height : 65
    }
});

module.exports = NewsList;