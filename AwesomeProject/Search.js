'use strict';

var React = require('react-native');
var {
    TouchableOpacity,
    ListView,
    Image,
    TextInput,
    Text,
    View,
    StyleSheet,
    Platform,
    BackAndroid,
    ToastAndroid
} = React;

var NewsList = require( './NewsList' );

var Search = React.createClass({
    getInitialState: function() {
        return {
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2
            }),
            // View status, whether in input search keyword status or in search result status
            // the value is 'searchList' / 'searchResult' accordingly
            viewStatus : 'searchInput',
            // search input
            text : ''
        };
    },

    componentDidMount: function() {
        /*
         * bind event listener for hardware back button on Android
         */
        if ( 'android' === Platform.OS )
            BackAndroid.addEventListener('hardwareBackPress', this.hardwareBackPress);
    },

    hardwareBackPress: function () {
        //ToastAndroid.show('in search', ToastAndroid.SHORT)
        var routes = this.props.navigator.getCurrentRoutes();
        if ( this.props.route == routes[ routes.length - 1 ] ) {
            this.goBack();
            return true;
        }
        return false;
    },

    fetchData: function( text ) {
        if ( text ) {
            var reqUrl = this.props.urlForSuggest + '&key=' + encodeURIComponent(text);
            fetch( reqUrl )
                .then((response) => {
                    if ( 200 == response.status )
                        return response.json();
                    else
                        return null;
                })
                .then((responseData) => {
                    if ( !responseData || !responseData.length ) {
                        return;
                    }

                    this.setState({
                        dataSource: this.state.dataSource.cloneWithRows( responseData )
                    });
                })
                .catch((error) => {
                    console.warn(error);
                })
                .done();
        } else {
            this.setState({
                dataSource: this.state.dataSource.cloneWithRows( [] )
            });
        }
    },

    searchItemPress : function ( keyword ) {
        this.setState({
            viewStatus : 'searchResult',
            text : keyword
        });
    },

    goBack : function () {
        this.props.navigator.pop();
        /*if ( 'searchResult' == this.state.viewStatus ) {
            this.setState({
                viewStatus : 'searchInput'
            });
        } else {
            this.props.navigator.pop();
        }*/
    },

    goSearch : function () {
        if ( '' != this.state.text.trim() )
            this.setState({
                viewStatus : 'searchResult'
            });
    },

    textChange : function ( text ) {
        this.fetchData( text );
        this.setState({
            text : text
        });
    },
    searchInputPress : function () {
        this.setState({
            viewStatus : 'searchInput'
        });
        this.fetchData( this.state.text );
    },
    render: function() {
        return (
            <View style={styles.container}>
                <View>
                    <View style={styles.searchHeader}>
                        <TouchableOpacity onPress={this.goBack}>
                            <Text style={styles.goBackTxt}>{'<'}</Text>
                        </TouchableOpacity>

                        {
                        this.state.viewStatus == 'searchInput' ?
                        <TextInput
                            ref={'searchInput'}
                            style={styles.searchInput}
                            onChangeText={ (text) => {
                                this.textChange(text)
                            } }
                            value={this.state.text}
                            placeholder={'搜索'}
                            underlineColor={'transparent'}
                        />
                        :
                        <TouchableOpacity onPress={this.searchInputPress} style={styles.textShowWrap}>
                            <Text style={styles.textShow}>{this.state.text}</Text>
                        </TouchableOpacity>
                        }

                        {
                        this.state.viewStatus == 'searchInput' ?
                        <TouchableOpacity onPress={this.goSearch}>
                            <Text style={styles.goSearchTxt}>{'搜索'}</Text>
                        </TouchableOpacity>
                        :
                        <Text style={styles.spaceHold}></Text>
                        }
                    </View>
                </View>
                {
                this.state.viewStatus == 'searchResult' ?
                <NewsList navigator={this.props.navigator} reqUrl={this.props.urlForList} keyword={this.state.text} type={'nobanner'}></NewsList>
                :
                <ListView
                    dataSource={this.state.dataSource}
                    renderRow={this.renderRow}
                    style={styles.listView}
                    automaticallyAdjustContentInsets={false}
                    keyboardShouldPersistTaps={true}
                    />
                }
            </View>

        );
    },

    renderRow: function(keyword) {
        return (
            <TouchableOpacity
                onPress={()=>{this.searchItemPress(keyword);}}>
                <View style={styles.keywordItem}>
                    <Text >{keyword}</Text>
                </View>
            </TouchableOpacity>
        );
    },

    componentWillUnmount: function () {
        if ( 'android' === Platform.OS ) {
            //ToastAndroid.show('in search, unmount', ToastAndroid.SHORT)
            BackAndroid.removeEventListener('hardwareBackPress', this.hardwareBackPress);
        }
    }
});

var styles = StyleSheet.create({
    container : {
        flex : 1,
        marginTop : 'ios' === Platform.OS ? 20 : 0,
        backgroundColor : '#fff'
    },
    searchHeader : {
        flex: 1,
        height : 39,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        borderBottomWidth : 0.5,
        borderBottomColor : '#979797'
    },
    goBackTxt : {
        flex : 1,
        height : 18,
        marginTop : 10,
        marginBottom : 10,
        marginRight : 10,
        marginLeft : 18,
        color : '#4A4A4A'
    },
    searchInput : {
        flex : 1,
        width : 256,
        height: 28,
        lineHeight : 28,
        paddingLeft : 10,
        paddingRight : 10,
        paddingTop : 0,
        paddingBottom : 0,
        marginTop : 5,
        borderRadius : 5,
        backgroundColor : '#F0F0F0',
        color : '#4A4A4A',
        fontSize : 14
    },
    textShowWrap : {
        flex : 1,
        width : 256,
        height: 28,
        paddingLeft : 10,
        paddingRight : 10,
        marginTop : 5,
        borderRadius : 5,
        backgroundColor : '#F0F0F0'

    },
    textShow : {
        height : 16,
        marginTop : 5,
        color : '#4A4A4A',
        fontSize : 14
    },
    goSearchTxt : {
        flex : 1,
        height : 18,
        marginTop : 10,
        marginBottom : 10,
        marginLeft : 10,
        marginRight : 18,
        color : '#4A4A4A'
    },
    spaceHold : {
        width : 18
    },
    keywordItem: {
        flex: 1,
        height : 39,
        marginLeft : 10,
        marginRight : 10,
        borderBottomWidth : 0.5,
        borderBottomColor : '#E6E6E6',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        overflow : 'hidden'
    },
    keyword : {
        fontFamily : 'Heiti SC'
    },
    listView: {
        flex : 1,
        paddingBottom : 100
    }
});

module.exports = Search;