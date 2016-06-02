import React from 'react';
import {connectToStores} from 'fluxible-addons-react';
import {NavLink, navigateAction} from 'fluxible-router';
import SearchResultsStore from '../../stores/SearchResultsStore';
let ReactDOM = require('react-dom');

class SearchBox extends React.Component {

    handleRedirect(searchstring){
        //console.log('test' + this.refs.searchstring.value);
        //let searchstring = this.refs.searchstring.value;
        //let searchstring = 'RDFisGood';
        //console.log(searchstring.value);
        //console.log(this.value);
        this.context.executeAction(navigateAction, {
            //url: '/searchresults/' + searchstring
            url: '/searchresults/RDFisGood'
        });
        return false;
    }
    render() {
        return (
            <div className="ui small icon input" ref="searchBox">
                <input type="text" placeholder="Search..." ref="searchstring" />
                <i className="search link icon" onClick={this.handleRedirect.bind(this)} onChange={this.handleRedirect.bind(this)}></i>
            </div>
        );
    }
}
SearchBox.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};
SearchBox = connectToStores(SearchBox, [SearchResultsStore], (context, props) => {
    return {
        SearchResultsStore: context.getStore(SearchResultsStore).getState()
    };
});

export default SearchBox;
