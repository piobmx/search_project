"use strict";

const elasticsearchApi = require("elasticsearch");
const { Client } = require('@elastic/elasticsearch')

const fs = require("fs");


const newESClient = new Client({
    node: process.env.ELASTIC_NODE,
    auth: {
      username: process.env.ES_USERNAME,
      password: process.env.ES_PASSWORD,
    },
    tls: {
    //   ca: fs.readFileSync('./http_ca.crt'),
      rejectUnauthorized: false
    }
  })
  
// const clueweb = require('./es-datasets/clueweb');
// const cranfield = require('./es-datasets/cranfield');
// const ab_nyc_2019 = require('./es-datasets/ab_nyc_2019');
// const search_results_annotated = require('./es-datasets/search_results_annotated');
const search_results_complete_annotated = require("./es-datasets/search_results_complete_annotated");
const search_results_labelled = require("./es-datasets/search_results_predicted");
const search_results_salient = require("./es-datasets/search_results_salient");
const customIndex = require("./es-datasets/search_results_complete_annotated");

const {
    fineStructure,
} = require("mathjs/lib/entry/pureFunctionsAny.generated");

// mapping of vertical to module for elasticsearch dataset
const verticals = {
    text: process.env.ES_INDEX
        ? customIndex
        : search_results_complete_annotated,
    labelled: process.env.ES_INDEX ? customIndex : search_results_labelled,
    explanation: process.env.ES_INDEX ? customIndex : search_results_salient,
};

/**
 * Fetch data from elasticsearch and return formatted results.
 */
exports.fetch = async function (
    query,
    vertical,
    pageNumber,
    resultsPerPage,
    relevanceFeedbackDocuments
) {
    console.log("fetching elastic results...");
    // console.log("process.env: ", process.env)
    // console.log("vertical:", vertical)
    if (
        Array.isArray(relevanceFeedbackDocuments) &&
        relevanceFeedbackDocuments.length > 0
    ) {
        return Promise.reject({
            name: "Bad Request",
            message:
                "The Elasticsearch search provider does not support relevance feedback, but got relevance feedback documents.",
        });
    }
    if (vertical in verticals) {
        const dataset = verticals[vertical];

        if (process.env.ES_INDEX) {
            return await newESClient
                .search({
                    index: dataset.index,
                    from: (pageNumber - 1) * resultsPerPage,
                    size: resultsPerPage,
                    body: dataset.custom_query(query),
                    pretty: true,
                })
                .then(formatResults(vertical));
                // .then(
                //     function (resp) {
                //         return formatResults(resp);
                //     },
                //     function (err) {
                //         console.trace(err.message);
                //     }
                // );
            // .then(function(vertical) {
            //     return formatResults(vertical)
            // }, function(error) {
            //     console.log("ESClient Error:", error)
            // });
        }

        return newESClient
            .search({
                index: dataset.index,
                // type: 'document',
                // from: (pageNumber - 1) * resultsPerPage,
                size: resultsPerPage,
                body: {
                    query: {
                        match: {
                            [dataset.queryField]: query,
                        },
                    },
                },
            })
            .then(formatResults(vertical));
    } else
        return Promise.reject({
            name: "Bad Request",
            message: "Invalid vertical. Valid verticals are ",
            verticals,
        });
};

/**
 * Format the results returned by elasticsearch, using the dataset corresponding to the requested vertical.
 */
function formatResults(vertical) {
    return function (result) {
        const dataset = verticals[vertical];
        if (!result.hits || result.hits.length === 0) {
            throw new Error("No results from search api.");
        }
        let results = [];
        result.hits.hits.forEach(function (hit) {
            // console.log("results push:", hit)
            results.push(dataset.formatHit(hit));
        });

        return {
            results: results,
            matches: result.hits.total,
        };
    };
}
