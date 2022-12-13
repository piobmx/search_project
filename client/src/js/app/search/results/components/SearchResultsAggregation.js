import "./SearchResults.pcss";

import React from "react";
import config from "../../../../config";
import Loader from "react-loader";

import SearchResultContainer from "../SearchResultContainer";
import SearchResultsPagination from "./SearchResultsPagination";
import CollapsedResultsButton from "./CollapsedSearchResults";
import { Button } from "react-bootstrap";
import CenteredMessage from "../../../common/CenteredMessage";
import Helpers from "../../../../utils/Helpers";

const predictionValueToColor = {
    0: "#ea5555",
    1: "#aaaaaa",
    2: "#35cc35",
};


const SearchResultsAggregation = function ({ searchState, results }) {
    if (searchState['vertical'] === "text") {
        return (
            <></>
        )
    }
    let aggregation = results.map((result) => {
        return (
            <div
                style={{
                    ...style.rectangle,
                    backgroundColor: predictionValueToColor[result.prediction],
                }}>
                {result.prediction}
            </div>
        );
    });

    let sumStance = 0;
    results.forEach((result) => {
        sumStance += result.prediction;
    });

    return (
        <div style={style.Box}>
            <h3 style={{ margin: "5px" }}>Predictions Overview:</h3>
            {aggregation}
            Overall Stance: {sumStance}
        </div>
    );
};

const style = {
    Box: {
        // height: "500px",
        border: "1px solid #BDC3C7",
        borderRadius: "5px",
        marginTop: "5px",
        boxShadow: "0px 1px 1px 0px #BFBFBF",
    },
    rectangle: {
        textAlign: "center",
        fontWeight: "bold",
        border: "1px solid #BDC3C3",
        // width: "99%",
        height: "30px",
        fontSize: "12px",
    },
};

export default SearchResultsAggregation;
