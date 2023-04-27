"use strict";

exports.index = "sepp";
exports.queryField = "fullbody";

const elasticColumns = {
    url: "url",
    snippet: "salien",
    salien: "salien",
    prediction: "predictionLabel",
    fullBody: "fullbody",
    title: "title",
};

exports.formatHit = function (hit) {
    const source = hit._source;
    const title = source.title ? source.title.replace(/\s+/g, " ") : "";
    console.log("****predlabel*****", source["pred_label"]);

    // Todo: adapt result specification to work for datasets without url.
    return {
        id: hit._id,
        title: source[elasticColumns["title"]],
        name: source[elasticColumns["title"]],
        source: source[elasticColumns["url"]],
        text: source[elasticColumns["salien"]],
        //prediction: Math.floor(Math.random() * 3),
        snippet: source['salien'],
        prediction: source[elasticColumns["prediction"]],
    };
};

exports.custom_query = function (user_query) {
    return {
        query: {
            match: {
                fullbody: {
                    // column9: {
                    query: user_query,
                    operator: "and",
                },
            },
        },
    };
};
