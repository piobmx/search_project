"use strict";

const elasticsearchApi = require("elasticsearch");
const { Client } = require("@elastic/elasticsearch");
const fs = require("fs");

const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const dbPath = path.join(__dirname, "search.db");
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        return console.error(err);
    } else {
        console.log("Connected to search results DB.");
    }
});

const sql = "SELET ? from sr WHERE fullbody like ?";
const params = [];

function getResults(query, meta) {
    // remove punctual
    // split into list
    console.log("QUERY:", query);
    const viewToKey = {
        vp0: 0, // select opposite results
        vp2: 2,
        na: 0,
    };

    const translateTopic = {
        ipr: "intellectual_property_rights",
        su: "school_uniforms",
        ath: "atheism",
        na: "atheism",
    };
    // let finalQuery = "SELECT url, title, salien, body, predictionLabel FROM sr";

    let sql =
        "SELECT pindex, url, title, salien, body, predictionLabel FROM sr WHERE "; // final query = query + keywords + topic + view
    let punctuationless = query.replace(/[.,\/#!$%\^&\*;:{}=\-_\~()]/g, "");
    let string = punctuationless.replace(/\s{2,}/g, " ");
    const keywordList = string.split(" ");
    console.log(keywordList);

    let keywordKey = "";
    if (keywordList.length > 0) {
        keywordKey += " (";
        for (const [i, keyword] of keywordList.entries()) {
            keywordKey += ` fullbody like "%${keyword}%" `;
            if (i !== keywordList.length - 1) {
                keywordKey += " OR ";
            } else {
                keywordKey += " )";
            }
        }
    } else {
        keywordKey += " fullbody is not null";
    }

    const cheat = true;
    if (cheat) {
        keywordKey = " fullbody is not null";
    }

    let topicKey = "";
    const topic = translateTopic[meta.topic];

    if (meta.topic !== "") {
        topicKey = " AND topic like" + `"%${topic}%"` + " ";
    } else {
        topicKey = " AND topic is not null ";
    }
    // if (meta.topic !== '') {
    //     topicKey = " topic == \"%topic%\""
    // }
    let viewKey = "";
    if (meta.viewpoint !== "") {
        viewKey = " AND predictionLabel=" + viewToKey[meta.viewpoint] + " ";
    } else {
        viewKey = " AND predictionLabel is not null ";
    }

    const finalQuery = sql + keywordKey + topicKey;
    console.log(finalQuery);

    // const sql = `SELECT *** FROM sr WHERE `;

    return new Promise((resolve, reject) => {
        db.all(finalQuery, (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
}

const formatSqliteRows = function (row, vertical) {
    return {
        id: row.pindex,
        title: row.title,
        name: row.title,
        source: row.url,
        text: vertical === "explanation" ? row.salien : row.body,
        snippet: vertical === "explanation" ? row.salien : row.body,
        prediction: row.predictionLabel,
    };
};

const newESClient = new Client({
    node: process.env.ELASTIC_NODE,
    auth: {
        username: process.env.ES_USERNAME,
        password: process.env.ES_PASSWORD,
    },
    tls: {
        //   ca: fs.readFileSync('./http_ca.crt'),
        rejectUnauthorized: false,
    },
});

// const clueweb = require('./es-datasets/clueweb');
// const cranfield = require('./es-datasets/cranfield');
// const ab_nyc_2019 = require('./es-datasets/ab_nyc_2019');
// const search_results_annotated = require('./es-datasets/search_results_annotated');
const search_results_vertical1 = require("./es-datasets/search_results_vertical1");
const search_results_vertical2 = require("./es-datasets/search_results_vertical2");
const search_results_veritcal3 = require("./es-datasets/search_results_vertical3");

const {
    fineStructure,
} = require("mathjs/lib/entry/pureFunctionsAny.generated");

// mapping of vertical to module for elasticsearch dataset
const verticals = {
    text: search_results_vertical1,
    labelled: search_results_vertical2,
    explanation: search_results_veritcal3,
    na: search_results_vertical1,
};

/**
 * Fetch data from elasticsearch and return formatted results.
 */
exports.fetch = async function (
    query,
    vertical,
    pageNumber,
    resultsPerPage,
    relevanceFeedbackDocuments,
    meta
) {
    console.log("fetching elastic results with vertical", vertical);
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
        const sql = `SELECT title, url, body FROM sr WHERE fullbody like "%%"`;

        // console.log("********dataset:", dataset);
        console.log("********vertical:", vertical);
        console.log("********user query:", query);
        // console.log("********query:", dataset.custom_query(query));
        const balancedTemplate = [
            "1",
            "1",
            "1",
            "1",
            "0",
            "1",
            "2",
            "0",
            "1",
            "2",
        ];
        const stronglyAgainstTemplate = [
            "2",
            "2",
            "2",
            "2",
            "1",
            "0",
            "2",
            "1",
            "0",
            "2",
        ];
        const stronglyFavorTemplate = [
            "0",
            "0",
            "0",
            "0",
            "1",
            "2",
            "0",
            "1",
            "2",
            "0",
        ];
        const bias = meta.bias;
        const viewpoint = meta.viewpoint;
        let templateToUse;
        if (bias.includes("alanced")) {
            templateToUse = balancedTemplate;
        } else if (bias.includes("iased")) {
            if (viewpoint.includes("vp0")) {
                templateToUse = stronglyAgainstTemplate; // show opposite viewpoint
            } else if (viewpoint.includes("vp2")) {
                templateToUse = stronglyFavorTemplate;
            } else {
                templateToUse = balancedTemplate;
            }
        } else {
            templateToUse = balancedTemplate;
        }
        console.log(
            "Bias:",
            bias,
            "Viewpoint:",
            viewpoint,
            "resultsPerPage:",
            resultsPerPage
        );

        if (process.env.ES_INDEX) {
            const results = getResults(query, meta).then((rows) => {
                let rest = [];
                let curation = [];
                const resultsFrom =
                    pageNumber > 3 ? 10 : (pageNumber - 1) * resultsPerPage;

                let results;
                let templateIndex = 0;
                let classifiedObjects = rows.reduce(function (acc, obj) {
                    if (!acc[obj.predictionLabel]) {
                        acc[obj.predictionLabel] = [];
                    }
                    acc[obj.predictionLabel].push(obj);
                    return acc;
                }, {});

                // console.log("templateToUse", templateToUse);
                templateToUse.forEach((item, index) => {
                    // let listToChoose = classifiedObjects[item];
                    if (classifiedObjects[item].length === 0) {
                        return;
                    }
                    let randomInd = Math.floor(
                        Math.random() * classifiedObjects[item].length
                    );
                    let randomResult = classifiedObjects[item][randomInd];
                    // console.log('randomInd', randomInd);
                    // console.log("pindex", randomResult.pindex);

                    curation.push(formatSqliteRows(randomResult, vertical));
                    // if (classifiedObjects[item].length > 1) {
                    classifiedObjects[item] = classifiedObjects[item].filter(
                        (item) => item !== randomResult
                    );
                    // }
                    // console.log(classifiedObjects["0"].length);
                    // console.log(classifiedObjects["1"].length);
                    // console.log(classifiedObjects["2"].length);
                });
                rest = classifiedObjects["0"].concat(
                    classifiedObjects["1"].concat(classifiedObjects["2"])
                );

                rest = rest.map((result) => formatSqliteRows(result, vertical));

                results = curation.concat(rest);
                // results = results.slice(
                //     resultsFrom,
                //     resultsFrom + resultsPerPage
                // );
                const randomResults = results
                    .sort(() => Math.random() - 0.5)
                    .slice(0, resultsPerPage);

                if (pageNumber === 1) {
                    results = curation;
                } else if (pageNumber === 2 || pageNumber === 3) {
                    results = randomResults;
                } else if (pageNumber === 4) {
                    results = randomResults;
                } else if (pageNumber > 4) {
                    results = randomResults;
                } else {
                    results = randomResults;
                }

                // console.log("TEMPLATE:", templateToUse);
                // curation.forEach((row) => {
                //     console.log("row:", row.prediction);
                // });
                // console.log("MATCH", results.length);
                return {
                    results: results,
                    matches: rows.length,
                };
            });
            return results;
            // return await newESClient
            //     .search({
            //         index: dataset.index,
            //         from: (pageNumber - 1) * resultsPerPage,
            //         size: resultsPerPage,
            //         body: dataset.custom_query(query),
            //         pretty: true,
            //     })
            //     .then(formatResults(vertical));
        }

        return 0;
        // return newESClient
        //     .search({
        //         index: dataset.index,
        //         size: resultsPerPage,
        //         body: {
        //             query: {
        //                 match: {
        //                     [dataset.queryField]: query,
        //                 },
        //             },
        //         },
        //     })
        //     .then(formatResults(vertical));
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
