'use strict';

var React = require('react-native');
var {
    TouchableOpacity,
    WebView,
    StyleSheet,
    Text,
    View,
    ListView
    } = React;

var Recom = require( './Recom' );

var WEBVIEW_REF = 'webview';


var injectJs = '' +
    '(function () {' +
    'var metaEls =document.getElementsByTagName("meta");' +
    'var theBody = document.getElementsByTagName("body")[0];' +
    'var found = false;' +
    'for ( var i = 0; i != metaEls.length; i++ ) {' +
    'if ( "viewport" == metaEls[i].getAttribute( "name" ) && !theBody.getAttribute("GANG_XUN_BRIDGE_TAG") ) {' +
    'found = true;' +
        //'alert("found");' +
    'document.title = "GANG_XUN_BRIDGE_HEIGHT" + document.height;' +
    'break;' +
    '}' +
    '}' +
    'if ( !found ) {' +
        //'alert("not found");' +
    'theBody.setAttribute("GANG_XUN_BRIDGE_TAG","1");' +
    'var head=document.getElementsByTagName("head")[0];' +
    'var meta=document.createElement("meta");' +
    'meta.setAttribute("name","viewport");' +
    'meta.setAttribute("content","width=device-width,initial-scale=1.0, user-scalable=1, minimum-scale=0.0, maximum-scale=2.0");' +
    'head.appendChild(meta);' +
    'document.title = "GANG_XUN_BRIDGE_NOHEIGHT";' +
    '}' +
    '})();';
/*injectJs = 'document.title = "GANG_XUN_BRIDGE_HEIGHT" + document.height;';*/


var NewsDetailWebView = React.createClass({
    getInitialState: function() {
        return {
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2
            }),
            height : 800,
            onlyWebView : true
        };
    },

    componentDidMount: function() {
        this.setState({
            dataSource: this.state.dataSource.cloneWithRows( [1,2] )
        });
    },

    goBack : function () {
        this.props.navigator.pop();
    },

    onNavigationStateChange(navState) {
        var title = navState.title;
        //alert(title);
        var rst = title.match( /^GANG_XUN_BRIDGE_HEIGHT([0-9]+)$/ );

        if ( ( rst && rst.length == 2 && rst[1] != 0 && ( !this.webviewHeight || this.webviewHeight != rst[1] ) ) ) {
            this.setState({
                height: parseInt( rst[1] ),
                onlyWebView : false
            });
            this.webviewHeight = rst[1];
        } else if ( ( /^GANG_XUN_BRIDGE_NOHEIGHT$/ ).test(title) ) {
            // alert('noheight');
        }
    },
    renderRow : function (row) {
        if ( 1 == row ) {
            return (
                <WebView
                    ref={WEBVIEW_REF}
                    automaticallyAdjustContentInsets={false}
                    style={{height : this.state.height}}
                    url={this.props.route.sourceUrl}
                    javaScriptEnabledAndroid={true}
                    startInLoadingState={true}
                    scalesPageToFit={true}
                    bounces={false}
                    onNavigationStateChange={this.onNavigationStateChange.bind(this)}
                    injectedJavaScript={injectJs}
                />
            );
        } else {
            /*return (
             <View style={{height: 100, backgroundColor : 'yellow'}}></View>
             );
             */
            if ( this.props.route.itemId ) {
                return (
                    <View style={styles.recomWrap}>
                        <Recom
                            {...this.props}
                            itemId={this.props.route.itemId}>
                        </Recom>
                    </View>
                );
            } else {
                return null
            }
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


                {this.state.onlyWebView ?
                    <WebView
                        ref={WEBVIEW_REF}
                        automaticallyAdjustContentInsets={false}
                        style={{flex : 1, overflow : 'hidden', backgoundColor : '#fff'}}
                        url={this.props.route.sourceUrl}
                        javaScriptEnabledAndroid={true}
                        startInLoadingState={true}
                        scalesPageToFit={true}
                        bounces={false}
                        onNavigationStateChange={this.onNavigationStateChange.bind(this)}
                        injectedJavaScript={injectJs}
                    />
                    :
                    <ListView
                        dataSource={this.state.dataSource}
                        renderRow={this.renderRow}
                        style={styles.listView}
                        automaticallyAdjustContentInsets={false}
                        bounces={false}
                    />
                    }



            </View>
        );
    }

});

var styles = StyleSheet.create({
    container: {
        flex : 1,
        flexDirection : 'column',
        marginTop : 20,
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
        position : 'absolute',
        left : 0,
        top : 0,
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
    webViewWrap : {
        flex : 1
    },
    webView: {
        flex : 1,
        backgroundColor: '#000'
    },
    recomWrap : {
        flex : 1
    },
    listView: {
        flex : 1,
        paddingBottom : 10
    }
});

module.exports = NewsDetailWebView;