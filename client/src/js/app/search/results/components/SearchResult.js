import React, { useState } from "react";
import Rating from "react-rating";

import { Collapse } from "react-bootstrap";
import SearchStore from "../../SearchStore";
import config from "../../../../config";
import Identicon from "identicon.js";
import md5 from "md5";
const predictionValueToColor = {
    0: "#C395E4",
    1: "#ABB3C6",
    2: "#B0E0E6",
};

const expandedTopic = {
    "ipr": "Intellectual Property Rights",
    "su": "School Uniforms",
    "ath": "Atheism",
}
const SearchResult = function({
    searchState,
    serpId,
    result,
    bookmarkClickHandler,
    urlClickHandler,
    provider,
    collapsed,
    excludeClickHandler,
    hideCollapsedResultsHandler,
    isCollapsible,
    visited,
    index,
}) {
    let initialBookmark = 0;
    let initialExclude = 0;
    if ("metadata" in result) {
        initialBookmark = result.metadata.bookmark ? 1 : 0;
        initialExclude = result.metadata.exclude ? 1 : 0;
    }

    const bookmarkButton = (
        <Rating
            className="rating"
            emptySymbol="fa fa-bookmark-o"
            fullSymbol="fa fa-bookmark"
            onClick={bookmarkClickHandler}
            stop={1}
            initialRating={initialBookmark}
            title="Save result"
        />
    );

    // TODO: use variant from SearchStore instead of defaultVariant
    const excludeButton = (
        <div>
            {config.defaultVariant === "S0" ? (
                <div />
            ) : (
                <Rating
                    className="rating"
                    emptySymbol="fa fa-ban"
                    fullSymbol="fa fa-ban red"
                    onClick={excludeClickHandler}
                    stop={1}
                    initialRating={initialExclude}
                    title="Exclude result from future queries"
                />
            )}
        </div>
    );

    const props = {
        searchState: searchState,
        serpId: serpId,
        result: result,
        index: index,
        metadata: formatMetadata(result.metadata),
        bookmarkButton: bookmarkButton,
        excludeButton: excludeButton,
        urlClickHandler: urlClickHandler,
        hideCollapsedResultsHandler: hideCollapsedResultsHandler,
        isCollapsible: isCollapsible,
        visited: visited,
    };
    const ResultType = config.providerVerticals[provider].get(
        searchState.vertical
    );
    const view = <ResultType {...props} />;

    const [LabelHover, setLabelHover] = useState(false);
    const handleMouseEnter = () => {
        setLabelHover(true);
        console.log("In LabelHover:", LabelHover);
    };

    const handleMouseLeave = () => {
        setLabelHover(false);
        console.log("Leave LabelHover:", LabelHover);
    };
    const topic =expandedTopic[SearchStore.getTopic()];
    const prediction = Math.round(result.prediction);
    const labelText = (pred, topic) => {
        if (topic === "") {
            topic = "NaN";
        }
        if (pred === 2) {
            return (
                "Pro " + topic
            );
        } else if (pred === 1) {
            return "Neutral";
        } else if (pred === 0) {
            return "Con " + topic ;
        } else {
            return "";
        }
    };
    return (
        <Collapse
            in={!collapsed}
            key={Math.floor(Math.random() * 10000).toString()}
        >
            <div className="SearchResultLabel" key="collapsen">
                <div className="SearchResultRow">
                    {/* {LabelHover ? (
                        <span style={styles.hoverBox}>
                            The stance of this document predicted by an AImodel.
                        </span>
                    ) : (
                        <></>
                    )} */}
                    {searchState.vertical === "text" ? (
                        <></>
                    ) : (
                        <div
                            className="ResultLabel"
                            onMouseOver={handleMouseEnter}
                            onMouseOut={handleMouseLeave}
                            style={{
                                backgroundColor:
                                    predictionValueToColor[prediction],
                            }}
                        >
                            {/* Stance: <b>{stanceValue[Math.round(result.prediction)]}</b> */}
                            {labelText(prediction, topic)}
                        </div>
                    )}
                    <div className="SearchResult">{view}</div>
                </div>
            </div>
        </Collapse>
    );
};

function formatMetadata(metadata) {
    let elements = [];
    if (!metadata) {
        return <div />;
    }

    if (config.interface.views && "views" in metadata) {
        elements.push(
            <span key="1">
                <i className="fa fa-eye" /> {metadata.views}
            </span>
        );
    }

    if (config.interface.ratings && "rating" in metadata) {
        elements.push(
            <span key="1">
                <i className="fa fa-thumbs-o-up" /> {metadata.rating.total}
            </span>
        );
    }

    if (config.interface.annotations && "annotations" in metadata) {
        elements.push(
            <span key="1">
                <i className="fa fa-comments" /> {metadata.annotations.length}
            </span>
        );
    }

    if (config.interface.saveTimestamp && metadata.bookmark) {
        const date = new Date(metadata.bookmark.date);
        const now = new Date().toLocaleDateString();
        let options = {
            size: 20,
        };
        let icon = new Identicon(
            md5(metadata.bookmark.userId),
            options
        ).toString();
        let iconUrl = "data:image/png;base64," + icon;
        let formattedTime = date.toLocaleDateString();
        if (formattedTime === now) formattedTime = date.toLocaleTimeString();

        elements.push(
            <span key="2">
                <i className="fa fa-bookmark" />{" "}
                <img
                    src={iconUrl}
                    alt={"User " + md5(metadata.bookmark.userId)}
                />{" "}
                {formattedTime}
            </span>
        );
    }

    return <div className="metadata">{elements}</div>;
}

export default SearchResult;
