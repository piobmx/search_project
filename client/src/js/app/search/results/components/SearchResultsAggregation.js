import "./SearchResults.pcss";

import React from "react";
import SearchStore from "../../SearchStore";

const predictionValueToColor = {
    0: "#C395E4",
    1: "#ABB3C6",
    2: "#B0E0E6",
};

const predictionValueToLabel = {
    0: "Con",
    1: "Neutral",
    2: "Pro",
};

const translateTopic = {
    ipr: "intellectual property rights",
    su: "school uniforms",
    ath: "atheism",
};

const SearchResultsAggregation = function({ searchState, results }) {
    if (searchState["vertical"] === "text") {
        return <></>;
    }
    const topic = SearchStore.getTopic();
    let aggregation = results.map((result) => {
        let prefix = predictionValueToLabel[Math.round(result.prediction)];
        let text;
        if (prefix === "Neutral") {
            text = `Neutral towards ${translateTopic[topic]}`;
        } else {
            text = `${prefix} ${translateTopic[topic]}`;
        }
        return (
            <div
                id="ax"
                style={{
                    ...style.rectangle,
                    backgroundColor:
                        predictionValueToColor[Math.round(result.prediction)],
                }}
            >
                {text}
            </div>
        );
    });

    // let sumStance = 0;
    // results.forEach((result) => {
    //     sumStance += Math.round(result.prediction);
    // });

    return (
        <div style={style.Box}>
            <h3 style={{ margin: "5px" }}>
                Stance Overview of Search Results Appearing in this Page:
            </h3>
            {aggregation}
            {/* Overall Stance: {sumStance} */}
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
