'use strict';

exports.index = 'sepp';
exports.queryField = 'snippet';

exports.formatHit = function (hit) {
    const source = hit._source;
    const title = source.title ? source.title.replace(/\s+/g, " ") : "";

    // Todo: adapt result specification to work for datasets without url.
    return {
        id: hit._id,
        title: source['title'],
        name: source['topic'],
        source: source['url'],
        text: source['snippet'],
        prediction: Math.floor(Math.random() * 3),
    };
};


exports.custom_query = function (user_query) {
    return {
        query: {
            match: {
                snippet: {
                    query: user_query,
                    "operator": "and",
                }
            }
        }

    }
}
