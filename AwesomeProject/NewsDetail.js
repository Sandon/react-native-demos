'use strict';

var React = require('react-native');
var {
    TouchableOpacity,
    StyleSheet,
    ListView,
    Text,
    View,
    Image,
    Platform,
    BackAndroid,
    ToastAndroid
} = React;

var Recom = require( './Recom' );

var NewsDetail = React.createClass({
    getInitialState: function() {
        return {
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2
            }),
            loaded : false
        };
    },

    componentDidMount: function() {
        /*
         * get data from server
         */
        var reqUrl = this.props.urlForDetail + '&id=' + this.props.route.itemId;

        fetch( reqUrl )
            .then((response) => {
                if ( 200 == response.status )
                    return response.json();
                else
                    return null;
            })
            .then((responseData) => {

                if ( !responseData || !responseData.content ) {
                    alert( '数据加载错误' );
                    return;
                }

                // article header
                var dataArr = [ {
                    rowRenderType : 'articleHeader',
                    title : responseData.title,
                    date : responseData.date,
                    sourceSiteName : responseData.sourceSiteName
                } ];

                // article content
                dataArr =dataArr.concat( responseData.content.split( '\r\n' ) );

                // article origin
                dataArr.push({
                    rowRenderType : 'articleOrigin',
                    sourceSiteName : responseData.sourceSiteName,
                    source : responseData.source
                });

                //article recom
                dataArr.push({
                    rowRenderType : 'articleRecom'
                });

                // update
                this.setState({
                    dataSource: this.state.dataSource.cloneWithRows( dataArr ),
                    loaded : true
                });
            })
            .catch((error) => {
                console.warn(error);
            })
            .done();

        /*
         * bind event listener for hardware back button on Android
         */
        if ( 'android' === Platform.OS )
            BackAndroid.addEventListener('hardwareBackPress', this.hardwareBackPress);
    },

    hardwareBackPress: function () {
        // ToastAndroid.show('in news detail', ToastAndroid.SHORT)
        var routes = this.props.navigator.getCurrentRoutes();
        if ( this.props.route == routes[ routes.length - 1 ] ) {
            this.goBack();
            return true;
        }
        return false;
    },

    goBack : function () {
        this.props.navigator.pop();
    },

    goOrigin: function ( sourceUrl ) {
        this.props.navigator.push({ id : 'detailWebView', sourceUrl : sourceUrl });
    },

    renderRow : function (row) {
        // article header
        if ( row.rowRenderType && 'articleHeader' == row.rowRenderType ) {
            return (
                <View style={styles.item}>
                    <View style={styles.titleWrap}>
                        <Text style={styles.title}>{row.title}</Text>
                    </View>
                    <View style={styles.titleInfo}>
                        <Text style={styles.srcName}>{row.sourceSiteName}</Text>
                        <Text style={styles.date}>{row.date}</Text>
                    </View>
                </View>
            )
        }

        // article origin
        if ( row.rowRenderType && 'articleOrigin' == row.rowRenderType ) {
            return (
                <View style={styles.item}>
                    {
                    'ios' === Platform.OS ?
                        <TouchableOpacity onPress={()=>{this.goOrigin(row.source)}}>
                            <Text style={styles.origin}>{'本文章来源于' + row.sourceSiteName + '：' + row.source}</Text>
                        </TouchableOpacity>
                    :
                        <Text style={styles.origin}>{'本文章来源于' + row.sourceSiteName + '：' + row.source}</Text>
                    }

                </View>
            )
        }

        //article recom
        if ( row.rowRenderType && 'articleRecom' == row.rowRenderType ) {
            return 'ios' === Platform.OS ?
                        <View style={styles.item}>
                            <Recom
                                {...this.props}>
                            </Recom>
                        </View>
                    : null
        }

        //article content
        var rst = row.match( /^GAN_GXUN_IMG:([http:\/\/|https:\/\/].+)$/ );
        if ( rst && rst.length == 2 ) {
            // img
            rst = rst[1].split(';');
            var size = {
                width : 355,
                height : 190
            };
            if ( 2 == rst.length ) {
                var tem = rst[1].split('x');

                if ( 2 == tem.length ) {
                    size.width = parseInt( tem[0] );
                    size.height = parseInt( tem[1] );

                    if ( size.width > 355 ) {
                        size.height = 355 /size.width * size.height;
                        size.width = 355;
                    }
                }
            }

            return (
                <View style={styles.item}>
                    <View style={styles.imgWrap}>
                        <Image
                            source={{uri: rst[0]}}
                            style={{width :size.width, height : size.height}}
                        />
                    </View>

                </View>
            );
        } else {
            // text
            return (
                <View  style={[styles.item, styles.para]}>
                    <Text style={styles.text}>{row.replace( /^\s*/, '        ' )}</Text>
                </View>
            )
        }
    },

    render: function() {
        return (
            <View style={styles.container}>
                <View>
                    <View style={styles.navBar}>
                        <TouchableOpacity onPress={this.goBack}>
                            <View style={styles.goBack}>
                                <Text style={styles.goBackTxt}>{'< ' + '返回'}</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.content}>
                    {this.state.loaded ?
                    <ListView
                        dataSource={this.state.dataSource}
                        renderRow={this.renderRow}
                        style={styles.listView}
                        automaticallyAdjustContentInsets={false}
                    />
                    :
                    <View></View>
                    }
                </View>

            </View>
        );
    },

    componentWillUnmount: function () {
        if ( 'android' === Platform.OS ) {
            // ToastAndroid.show('in detail, unmount', ToastAndroid.SHORT)
            BackAndroid.removeEventListener('hardwareBackPress', this.hardwareBackPress);
        }
    }
});

var styles = StyleSheet.create({
    container: {
        flex : 1,
        flexDirection : 'column',
        marginTop : 'ios' === Platform.OS ? 20 : 0,
        backgroundColor : '#fff'
    },
    navBar : {
        flex : 1,
        position : 'relative',
        height : 39,
        borderBottomWidth : 1,
        borderBottomColor : '#ddd'
    },
    goBack : {
        /*position : 'absolute',
        left : 0,
        top : 0,*/
        width : 75,
        height : 38,
        paddingLeft : 12,
        paddingRight : 12
    },
    goBackTxt : {
        height : 16,
        marginTop : 11,
        textAlign : 'left'
    },
    content : {
        flex : 1,
        position : 'relative',
        overflow : 'hidden'
    },
    listView : {
        flex : 1
    },
    item : {
        flex : 1,
        /*width : 355,*/
        marginLeft : 10,
        marginRight : 10
    },
    titleWrap : {
        marginTop : 18,
        marginBottom : 18
    },
    title : {
        fontSize : 18,
        color : '#000',
        lineHeight : 24
    },
    titleInfo : {
        flexDirection : 'row'
    },
    srcName : {
        color : '#4A90E2',
        fontSize : 12
    },
    date : {
        color : '#9B9B9B',
        paddingLeft : 6,
        fontSize : 12
    },
    imgWrap : {
        flexDirection : 'row',
        justifyContent : 'center',
        width : 355,
        marginTop : -8,
        marginBottom : -8
    },
    img : {
        flex : 1,
        width : 355,
        height : 190
    },
    para : {
        flex : 1,
        marginTop : 10,
        marginBottom : 10
    },
    text : {
        fontSize : 15,
        lineHeight : 24
    },
    origin : {
        marginTop : 15,
        marginBottom : 25,
        color : '#9B9B9B',
        fontSize : 13
    }
});

module.exports = NewsDetail;