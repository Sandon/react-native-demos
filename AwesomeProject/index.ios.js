'use strict';

var React = require('react-native');
var {
    AppRegistry,
    StyleSheet,
    Navigator,
    TabBarIOS,
    Text,
    View
} = React;

var TodaySpot = require( './TodaySpot' );
var NewsDetail = require( './NewsDetail' );
var NewsDetailWebView = require( './NewsDetailWebView' );
var Search = require( './Search' );

//var SUGGEST_URL = 'http://demo.1688.com:7001?mocktype=suggestdata';
var SUGGEST_URL = 'http://www.51steel.wang/news/list_suggests.json?';

// var LIST_URL = 'http://demo.1688.com:7001?mocktype=listdata';
var LIST_URL = 'http://www.51steel.wang/news/list_news.json?';

// var RECOM_URL = 'http://demo.1688.com:7001/?mocktype=listdata';
var RECOM_URL = 'http://www.51steel.wang/news/list_recomm.json?';

//var DETAIL_URL = 'http://demo.1688.com:7001?mocktype=detail';
var DETAIL_URL = 'http://www.51steel.wang/news/news_detail.json?';

var TopNavigator = React.createClass({

    renderScene: function (route, nav) {
        switch (route.id) {
            // 产经新闻
            case 'todaySpot':
                return (<TodaySpot
                            route={route}
                            navigator={nav}
                            tabType='产经新闻'
                            storageKey={'@HomeTab1'}
                            reqUrl={LIST_URL}
                            keyword={''}
                            type={'nobanner'}>
                        </TodaySpot>);
            // 市场分析
            case 'news':
                return (<TodaySpot
                            route={route}
                            navigator={nav}
                            tabType='市场分析'
                            storageKey={'@HomeTab2'}
                            reqUrl={LIST_URL}
                            keyword={''}
                            type={'nobanner'}>
                        </TodaySpot>);
            // 行业聚焦
            case 'dynamic':
                return (<TodaySpot
                            route={route}
                            navigator={nav}
                            tabType='行业聚焦'
                            storageKey={'@HomeTab3'}
                            reqUrl={LIST_URL}
                            keyword={''}
                            type={'nobanner'}>
                        </TodaySpot>);
            // 行业研究
            case 'deep':
                return (<TodaySpot
                            route={route}
                            navigator={nav}
                            tabType='行业研究'
                            storageKey={'@HomeTab4'}
                            reqUrl={LIST_URL}
                            keyword={''}
                            type={'nobanner'}>
                        </TodaySpot>);
            // 详情页
            case 'detail' :
                return (
                    <NewsDetail
                        route={route}
                        navigator={nav}
                        urlForRecom={RECOM_URL}
                        urlForDetail={DETAIL_URL}>
                    </NewsDetail>);
            // 详情 WebView
            case 'detailWebView':
                return <NewsDetailWebView route={route} navigator={nav}></NewsDetailWebView>;
            // 搜索页
            case 'search':
                return <Search  route={route} navigator={nav} urlForSuggest={SUGGEST_URL} urlForList={LIST_URL}></Search>;
            default:
                return (<TodaySpot
                            route={route}
                            navigator={nav}
                            tabType='产经新闻'
                            storageKey={'@HomeTab1'}
                            reqUrl={LIST_URL}
                            keyword={''}
                            type={'withbanner'}>
                        </TodaySpot>);
        }
    },

    render: function() {
        return (
            <Navigator
                initialRoute={{title: "今日焦点", id: "todaySpot"}}
                renderScene={this.renderScene}
                configureScene={(route) => {
                    if (route.sceneConfig) {
                        return route.sceneConfig;
                    }
                    return Navigator.SceneConfigs.FloatFromRight;
                }}
            />

        );
    }
});

var styles = StyleSheet.create({
    tabContent: {
        flex: 1,
        alignItems: 'center'
    },
    tabText: {
        color: 'white',
        margin: 50
    }
});

//module.exports = TabBarExample;
AppRegistry.registerComponent('AwesomeProject', () => TopNavigator);
