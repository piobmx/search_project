import React, { useState } from "react";
import Rating from "react-rating";

import { Collapse } from "react-bootstrap";

import config from "../../../../config";
import Identicon from "identicon.js";
import md5 from "md5";
const stanceValue = {
    0: "Against",
    1: "Neutral",
    2: "Favor",
};
const SearchResult = function ({
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
    const [mouseXY, setMouseXY] = useState([0, 0]);
    const handleMouseEnter = () => {
        setLabelHover(true);
        console.log("In LabelHover:", LabelHover);
    };

    const handleMouseLeave = () => {
        setLabelHover(false);
        console.log("Leave LabelHover:", LabelHover);
    };

    const onMouseMove = (e) => {
        // let rect = e.currentTarget.getBoundingClientRect();
        // let x = e.clientX - rect.left;
        let x = e.clientX;
        // let y = e.clientY - rect.top;
        let y = e.clientY;
        setMouseXY([x, y]);
    };

    const styles = {
        ResultsLabelBox: {
            width: "100%",
            display: "flex",
        },
        labelBox: {
            margin: "10px",
            // cursor: "pointer",
            padding: "20px 10px",
            width: "10%",
            // fontWeight: "bold",
            border: "0px solid rgba(10, 10, 10, 0.65)",
            textAlign: "center",
            backgroundColor: "rgba(218, 218, 218)",
        },
        hoverBox: {
            // display: LabelHover,
            margin: "-50px -24px",
            position: "absolute",
            padding: "15px",
            color: "rgba(240, 240, 240, 1)",
            background: "rgba(100, 80, 100, 0.9)",
            border: "3px solid rgba(30, 30, 30, 0.8)",
            borderBottom: "4mm ridge rgba(211, 220, 50, .6)",
        },
    };

    return (
        <Collapse in={!collapsed}>
            <div className="SearchResultLabel" style={styles.ResultsLabelBox}>
                {LabelHover ? (
                    <span style={styles.hoverBox}>The stance of this document predicted by an AI model.</span>
                ) : (
                    <></>
                )}
                {searchState.vertical === "text" ? (
                    <></>
                ) : (
                    <div
                        className="ResultLabel"
                        style={styles.labelBox}
                        onMouseOver={handleMouseEnter}
                        onMouseOut={handleMouseLeave}
                        onMouseMove={onMouseMove}>
                        Stance: <b>{stanceValue[result.prediction]}</b>
                    </div>
                )}
                <div className="SearchResult">{view}</div>
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
            <span>
                <i className="fa fa-eye" /> {metadata.views}
            </span>
        );
    }

    if (config.interface.ratings && "rating" in metadata) {
        elements.push(
            <span>
                <i className="fa fa-thumbs-o-up" /> {metadata.rating.total}
            </span>
        );
    }

    if (config.interface.annotations && "annotations" in metadata) {
        elements.push(
            <span>
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
            <span>
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
