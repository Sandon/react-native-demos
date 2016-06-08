'use strict';

var React = require('react-native');
var {
    AppRegistry,
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

var Search = React.createClass({
    getInitialState: function() {
        return {
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2
            }),
            viewStatus : 'searchInput',
            text : ''
        };
    },

    componentDidMount: function() {
        this.setState({
            dataSource: this.state.dataSource.cloneWithRows(['1', '2', '3', '4'])
        });
    },

    searchItemPress : function ( keyword ) {
        ToastAndroid.show('item pressed', ToastAndroid.SHORT)
    },

    goBack : function () {
        ToastAndroid.show('back pressed', ToastAndroid.SHORT)
    },

    goSearch : function () {
        ToastAndroid.show('search pressed', ToastAndroid.SHORT)
    },

    textChange : function ( text ) {
        this.setState({
            text : text
        });
    },

    render: function() {
        return (
            <View style={styles.container}>
                <View>
                    <View style={styles.searchHeader}>
                        <TouchableOpacity onPress={this.goBack}>
                            <Text style={styles.goBackTxt}>{'<'}</Text>
                        </TouchableOpacity>
                        <TextInput
                            ref={'searchInput'}
                            style={styles.searchInput}
                            onChangeText={ (text) => {
                                this.textChange(text)
                            } }
                            value={this.state.text}
                            placeholder={'search'}
                        />
                        <TouchableOpacity onPress={this.goSearch}>
                            <Text style={styles.goSearchTxt}>{'search'}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <ListView
                    dataSource={this.state.dataSource}
                    renderRow={this.renderRow}
                    style={styles.listView}
                    automaticallyAdjustContentInsets={false}
                />

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

AppRegistry.registerComponent('AwesomeProject', () => Search);