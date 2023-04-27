import "./SearchHeader.pcss";
import React from "react";
import SearchStore from "../../SearchStore";

function SearchHint({ topic }) {
    switch (topic) {
        case "":
			return <p>Topic not assigned, try: "atheism", "school uniforms"....</p>;
        case "na":
			return <p>Topic not assigned, try: "atheism", "school uniforms"....</p>;
        case "ath":
			return <p>Hint: You are assigned to "Atheism" topic, please include "atheism" in your query.</p>;
        case "ipr":
			return <p>Hint: You are assigned to "intellectual property rights" topic, please include "intellectual right" or "property right" in your query.</p>;
        case "su":
            return <p>Hint: You are assigned to "school uniform" topic, please include "school uniform" in your query.</p>;
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
