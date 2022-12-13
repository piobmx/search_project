import React from "react";
import SearchStore from "../SearchStore";
import SearchResultsAggregation from "./components/SearchResultsAggregation";

export default class SearchResultsAggregationContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            searchState: SearchStore.getSearchState(),
            results: SearchStore.getSearchResults(),
        };
        this._onChange = this._onChange.bind(this);
    }

    componentDidMount() {
        SearchStore.addChangeListener(this._onChange);
    }

    componentWillUnmount() {}

    _onChange() {
        this.setState({
            searchState: SearchStore.getSearchState(),
            results: SearchStore.getSearchResults(),
        });
    }

    render() {
        return (
            <div>
                <SearchResultsAggregation
                    searchState={this.state.searchState}
                    results={SearchStore.getSearchResults()}
                />
            </div>
        );
    }

    changeHandler() {}
}
