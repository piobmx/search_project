'use strict';

exports.index = 'sepp';
exports.queryField = 'fullbody';


const elasticColumns = {
    url: "url",
    snippet: "body",
    salien: "salien",
    prediction: "predictionLabel",
    fullBody: "fullbody",
    title: "title",
};
exports.formatHit = function (hit) {
    const source = hit._source;
    const title = source.title ? source.title.replace(/\s+/g, " ") : "";

    // Todo: adapt result specification to work for datasets without url.
    return {
        id: hit._id,
        title: source[elasticColumns["title"]],
        name: source[elasticColumns["title"]],
        source: source[elasticColumns["url"]],
        text: source[elasticColumns['snippet']],
        snippet: source[elasticColumns['snippet']],
        prediction: source[elasticColumns['prediction']],
        //prediction: Math.floor(Math.random() * 3),
    };
};


exports.custom_query = function (user_query) {
	console.log("********USER QUERY:", user_query)
    return {
        query: {
            match: {
                fullbody: {
                    query: user_query,
                    "operator": "and"
                }
            }
        }

    }
}
