import "./SearchResults.pcss";

import React from "react";
import config from "../../../../config";
import Loader from "react-loader";

import SearchResultContainer from "../SearchResultContainer";
import SearchResultsPagination from "./SearchResultsPagination";
import CollapsedResultsButton from "./CollapsedSearchResults";
// import { Button } from "react-bootstrap";
import $ from "jquery";
import CenteredMessage from "../../../common/CenteredMessage";
import Helpers from "../../../../utils/Helpers";

const expandedTopic = {
    ipr: `"intellectual property rights", "property right" or "intellectual right"`,
    su: `"school uniform" or "uniform"`,
    ath: `"atheism" or "atheist"`,
};
const SearchResults = function({
    searchState,
    progress,
    serpId,
    results,
    matches,
    elapsedTime,
    activeUrl,
    provider,
    distributionOfLabour,
    activeDoctext,
    tutorial,
    collapsed,
    autoHide,
    pageChangeHandler,
    isCollapsible,
    showCollapsedResults,
    hideCollapsedResults,
    topic,
    showAllCollapsedResults,
    hideAllCollapsedResults,
}) {
    // const getCollapsibleResultsLength = function () {
    //     return results.filter((result) => isCollapsible(result)).length;
    // };

    const resultsAreCollapsed = function(results) {
        let output = false;
        results.forEach((result) => {
            if (collapsed[Helpers.getId(result)]) {
                output = true;
            }
        });
        return output;
    };

    const style = {
        color: "darkgray",
    };

    if (searchState.query === "" && results.length === 0) {
        return (
            <CenteredMessage height="800px" style={style}>
                <h3> Query does not match any data.) </h3>
            </CenteredMessage>
        );
    }

    if (progress.resultsNotFound) {
        const queryNotIncludesKeyword = `We have not found results for you! Please make sure your query includes ${expandedTopic[topic]}!`;

        return (
            <>
                <CenteredMessage height="800px" style={style}>
                    <h3> Sorry! :( </h3>
                    <h4> {queryNotIncludesKeyword} </h4>
                </CenteredMessage>
            </>
        );
    }

    if (!tutorial && !progress.finished) {
        return (
            <CenteredMessage height="800px">
                <Loader />
                <br></br>
                <b>Please refresh if the page doesn't load.</b>
            </CenteredMessage>
        );
    }

    // Trick to remove last page from pagination;
    $(".pagination")
        .find("a")
        .last()
        .hide();

    const pagination = (
        <SearchResultsPagination
            searchState={searchState}
            finished={results.length > 0 || progress.finished}
            matches={matches}
            changeHandler={pageChangeHandler}
        />
    );

    const prefix = matches < config.aboutPrefixAt ? "" : "About ";
    const timeIndicator =
        prefix +
        Helpers.numberWithCommas(matches) +
        " results (" +
        elapsedTime +
        " seconds)";
    let visitedUrls = JSON.parse(localStorage.getItem("visited-urls"));
    if (!visitedUrls) {
        visitedUrls = {};
    }
    let list = [];
    let lastCollapsedResults = [];
    let lastCollapsedResultsComponents = [];
    for (const [index, result] of results.entries()) {
        const collapsedResult =
            distributionOfLabour && collapsed[Helpers.getId(result)];

        const resultProps = {
            searchState: searchState,
            serpId: serpId,
            result: result,
            bookmark: 0,
            provider: provider,
            collapsed: collapsedResult,
            hideCollapsedResultsHandler: hideCollapsedResults,
            autoHide: autoHide,
            isCollapsible: isCollapsible(result),
            visited: visitedUrls[Helpers.getId(result)] === true,
        };

        if (distributionOfLabour === "unbookmarkedSoft") {
            if (collapsed[Helpers.getId(result)]) {
                lastCollapsedResults.push(result);
                lastCollapsedResultsComponents.push(
                    <SearchResultContainer
                        {...resultProps}
                        key={index}
                        index={index}
                    />
                );
            } else {
                if (lastCollapsedResults.length > 0) {
                    list.push(
                        <CollapsedResultsButton
                            results={lastCollapsedResults}
                            resultsAreCollapsed={resultsAreCollapsed(
                                lastCollapsedResults
                            )}
                            showCollapsedResultsHandler={showCollapsedResults}
                            hideCollapsedResultsHandler={hideCollapsedResults}
                            searchState={searchState}
                            serpId={serpId}
                            index={index}
                            key={1}
                        />
                    );
                    list = list.concat(lastCollapsedResultsComponents);
                    list.push(
                        <SearchResultContainer
                            {...resultProps}
                            key={Helpers.getId(result)}
                            index={index}
                        />
                    );
                    lastCollapsedResults = [];
                    lastCollapsedResultsComponents = [];
                } else {
                    list.push(
                        <SearchResultContainer
                            {...resultProps}
                            key={Helpers.getId(result)}
                            index={index}
                        />
                    );
                }
            }
        } else {
            list.push(
                <SearchResultContainer
                    {...resultProps}
                    key={Helpers.getId(result)}
                    index={index}
                />
            );
        }
    }
    if (lastCollapsedResults.length > 0) {
        list = list.concat(lastCollapsedResultsComponents);
        list.push(
            <CollapsedResultsButton
                key={Helpers.getResultIds(lastCollapsedResults)}
                results={lastCollapsedResults}
                resultsAreCollapsed={resultsAreCollapsed(lastCollapsedResults)}
                showCollapsedResultsHandler={showCollapsedResults}
                hideCollapsedResultsHandler={hideCollapsedResults}
                searchState={searchState}
                serpId={serpId}
            />
        );
    }
    // const currentCollapsedResultsLength = Object.values(collapsed).filter(
    //     (value) => value
    // ).length;
    // const allBookmarkedResultsHidden =
    // currentCollapsedResultsLength === getCollapsibleResultsLength();

    return (
        <div>
            <div className="SearchResults" id="intro-search-results">
                {config.interface.timeIndicator && results.length > 0 && (
                    <div className="time"> {timeIndicator}</div>
                )}
                <div className="list">{list}</div>
            </div>

            {pagination}
        </div>
    );
};

export default SearchResults;
