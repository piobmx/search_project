import "./SearchHeader.pcss";
import React from "react";
import SearchStore from "../../SearchStore";

function SearchHint({ topic }) {
    switch (topic) {
        case "":
            return <p>Topic not found.</p>;
        case "Atheism":
            return <p>Hints: try "atheism"</p>;
        case "Intellectual Property Right":
            return <p>Hints: try: "intellectual right", "property right"</p>;
        case "School Uniform":
            return <p>Hints: try: "unifrom", "school uniform"</p>;
        default:
            return null;
    }
}

const SearchBox = function ({ query, changeHandler, showSuggestionsHandler }) {
    return (
        <div className="box">
            <div className="input-group">
                <input
                    type="text"
                    className="form-control"
                    name="query"
                    placeholder=""
                    id="input-box"
                    value={query}
                    onChange={(e) => changeHandler(e.target.value)}
                    autoComplete={"off"}
                    onFocus={showSuggestionsHandler}
                    onClick={showSuggestionsHandler}
                />

                <span className="input-group-btn">
                    <button
                        className="btn rounded-0"
                        type="submit"
                        disabled={query.length === 0}>
                        <span className="fa fa-search" />
                    </button>
                </span>
            </div>
            <SearchHint topic={SearchStore.getTopic()}/>
        </div>
    );
};

export default SearchBox;
