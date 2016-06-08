'use strict';

var React = require('react-native');
var {
    TouchableOpacity,
    Image,
    ListView,
    StyleSheet,
    Text,
    View,
} = React;

/**
 * @property navigator
 * @property reqUrl
 * @property keyword
 */
var Recom = React.createClass({
    getInitialState: function() {
        return {
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2
            }),
            loaded: false
        };
    },

    componentDidMount: function() {
        this.fetchData( null, 'pull' );
    },

    fetchData : function ( ) {
        var reqUrl = this.props.urlForRecom + '&id=' + this.props.route.itemId;

        // alert(reqUrl);
        fetch( reqUrl )
            .then((response) => {
                if ( 200 == response.status )
                    return response.json();
                else
                    return null;
            })
            .then((responseData) => {
                if ( !responseData || !responseData.length ) return;

                // update
                this.setState({
                    dataSource: this.state.dataSource.cloneWithRows( responseData ),
                    loaded: true
                });
            })
            .catch((error) => {
                console.warn(error);
            })
            .done();
    },

    render: function() {
        if (!this.state.loaded) {
            return <View></View>;
        }

        return (
            <View sytle={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.headerText}>相关阅读</Text>
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

    itemPress : function ( sourceUrl ) {
        //sourceUrl  = sourceUrl.replace( /^\s+|\s+$/, '' );
        this.props.navigator.push({ id : 'detailWebView', sourceUrl : sourceUrl });
    },

    renderRow: function(row) {
        return (
            <TouchableOpacity
                onPress={()=>{this.itemPress(row.source);}}>
                <View style={styles.itemContainer}>
                    <View style={styles.leftContainer}>
                        <View style={styles.titleView}>
                            <Text style={styles.title}>{row.title}</Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }
});

var styles = StyleSheet.create({
    container : {

    },
    header : {
        height : 30,
        backgroundColor : '#eaeaea'
    },
    headerText : {
        color : '#9B9B9B',
        paddingLeft : 13,
        marginTop : 7
    },
    itemContainer: {
        flex: 1,
        margin : 10,
        marginBottom : 0,
        paddingBottom : 10,
        borderBottomWidth : 1,
        borderBottomColor : '#ddd',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    leftContainer : {
        flex: 1
    },
    titleView : {
        flex : 1
    },
    title : {
        fontSize : 14
    },
    listView: {
        flex : 1,
        paddingBottom : 10
    }
});

module.exports = Recom;