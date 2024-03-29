import "./SearchHeader.pcss";
import React from "react";

import Logo from "./Logo";
import SearchBox from "./SearchBox";
import SearchVerticals from "./SearchVerticals";
import AccountInfo from "./AccountInfo";
import SuggestionsContainer from "../../features/querysuggestions/SuggestionsContainer";
import Timer from "./Timer";

const Header = function({
    query,
    vertical,
    provider,
    searchHandler,
    queryChangeHandler,
    verticalChangeHandler,
    timer,
    statusbar,
    userId,
    groupId,
    showAccountInfo,
    hideSuggestionsHandler,
    showSuggestionsHandler,
    clickSuggestionHandler,
    showSuggestions,
    isManager,
    username,
    sessionId,
    searchTopic,
    searchBias,
    userView,
    showSearchHints,
    QID
}) {
    return (
        <div className="SearchHeader">
            <Logo />
            <form
                id="search-form"
                action="/"
                method="GET"
                className="form"
                onSubmit={(e) => {
                    e.preventDefault();
                    searchHandler();
                }}
            >
                <SearchBox
                    query={query}
                    changeHandler={queryChangeHandler}
                    showSuggestionsHandler={showSuggestionsHandler}
                    showSearchHints={showSearchHints}
                />
                <SuggestionsContainer
                    clickSuggestionHandler={clickSuggestionHandler}
                    hideSuggestionsHandler={hideSuggestionsHandler}
                    showSuggestions={showSuggestions}
                />

                <SearchVerticals
                    query={query}
                    activeVertical={vertical}
                    changeHandler={verticalChangeHandler}
                    provider={provider}
                />
            </form>
            {
                <Timer></Timer>
            }
            {showAccountInfo && (
                <AccountInfo
                    userId={userId}
                    groupId={groupId}
                    username={username}
                    isManager={isManager}
                    sessionId={sessionId}
                    searchTopic={searchTopic}
                    searchBias={searchBias}
                    userView={userView}
                    QID={QID}
                />
            )}

            <div className="StatusBarDiv">{statusbar}</div>

            <div className="TimerDiv">{timer}</div>
        </div>
    );
};

export default Header;
