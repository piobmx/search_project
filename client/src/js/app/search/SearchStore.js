import request from "superagent";
import EventEmitter from "events";
import config from "../../config";

import { register } from "../../utils/Dispatcher";
import ActionTypes from "../../actions/ActionTypes";
import SessionActions from "../../actions/SessionActions";

import { log } from "../../utils/Logger";
import { LoggerEventTypes } from "../../utils/LoggerEventTypes";
import Helpers from "../../utils/Helpers";

import SyncStore from "../../stores/SyncStore";
import AccountStore from "../../stores/AccountStore";
import history from "../History";
import BookmarkStore from "./features/bookmark/BookmarkStore";
import AnnotationStore from "./features/annotation/AnnotationStore";
import RatingStore from "./features/rating/RatingStore";
import React from "react";
const CHANGE_EVENT = "change_search";

////

console.log(
    "------ Helpers.getURLParameter('provider'): " +
        Helpers.getURLParameter("provider")
);
console.log("------ config.defaultProvider: " + config.defaultProvider);
const provider = Helpers.getURLParameter("provider") || config.defaultProvider;

let state;

const _setVariant = function () {
    let variant;
    if (
        config.fallbackToS0ForGroupSize1 &&
        AccountStore.getTaskData().size === 1
    ) {
        variant = "S0";
    } else if (config.variantQueryParameter) {
        variant = Helpers.getURLParameter("variant") || config.defaultVariant;
    } else {
        variant = config.defaultVariant;
    }
    state.variant = variant;
    state.relevanceFeedback =
        variant === "S2" ? "individual" : variant === "S3" ? "shared" : false;
    state.distributionOfLabour =
        variant === "S0"
            ? false
            : variant === "S1-Hard"
            ? "unbookmarkedOnly"
            : "unbookmarkedSoft";
};

/*
 * Reset all SearchStore state except variant
 */
const _setState = function () {
    state = {
        query: Helpers.getURLParameter("q") || "",
        vertical:
            Helpers.getURLParameter("v") ||
            config.providerVerticals[provider].keys().next().value,
        page: parseInt(Helpers.getURLParameter("p")) || 1,
        provider: provider,

        finished: false,
        resultsNotFound: false,

        results: [],
        matches: 0,
        elapsedTime: 0,
        serpId: "",

        tutorial: false,
        activeUrl: "",
        activeDoctext: "",
        ranking: "random",
    };
    _setVariant();
};

_setState();

////
const SearchStore = Object.assign(EventEmitter.prototype, {
    emitChange() {
        this.emit(CHANGE_EVENT);
    },
    addChangeListener(callback) {
        this.on(CHANGE_EVENT, callback);
    },
    removeChangeListener(callback) {
        this.removeListener(CHANGE_EVENT, callback);
    },

    setSearchTutorialData() {
        state.tutorial = true;
        this.emitChange();
    },
    removeSearchTutorialData() {
        state.tutorial = false;
        this.emitChange();
    },
    updateMetadata() {
        _update_metadata();
    },

    reshuffleResults(rank) {
        console.log("rank result by", rank);
        let randomResults = state.results;
        let favors = [];
        let against = [];
        let neutral = [];
        let rankedResults;
        for (const r of randomResults) {
            if (r.prediction === 0) {
                against.push(r);
            } else if (r.prediction === 1) {
                neutral.push(r);
            } else if (r.prediction === 2) {
                favors.push(r);
            } else {
                continue;
            }
        }
        if (rank === "bias") {
            rankedResults = against.concat(neutral.concat(favors));
        } else if (rank === "not bias") {
            const fn = (arr) =>
                Array.from(
                    {
                        length: Math.max(...arr.map((o) => o.length)), // find the maximum length
                    },
                    (_, i) => arr.map((r) => r[i] ?? null) // create a new row from all items in same column or substitute with null
                ).flat(); // flatten the results

            const arr = [neutral, favors, against];

            rankedResults = fn(arr);
            rankedResults = rankedResults.filter(function (val) {
                return val !== null;
            });
            // console.log("rankded", rankedResults);
        } else {
            rankedResults = randomResults;
        }
        // console.log("ranked:", rankedResults);
        state.results = rankedResults;
    },

    ////

    getActiveUrl() {
        return state.activeUrl;
    },
    getMatches() {
        return state.matches || 0;
    },
    getElapsedTime() {
        return state.elapsedTime;
    },
    getSerpId() {
        return state.serpId;
    },
    getProvider() {
        return state.provider;
    },
    getVariant() {
        return state.variant;
    },
    getDistributionOfLabour() {
        return state.distributionOfLabour;
    },
    getRelevanceFeedback() {
        return state.relevanceFeedback;
    },
    getActiveDoctext() {
        return state.activeDoctext;
    },
    getTutorial() {
        return state.tutorial;
    },

    getSearchResults() {
        if (state.tutorial) {
            return [
                {
                    name: "You can view the first result here",
                    id: "1",
                    snippet: "This is the first result...",
                    metadata: {},
                },
                {
                    name: "You can view the second result here",
                    id: "2",
                    snippet: "This is the second result...",
                    metadata: {
                        bookmark: {
                            userId: AccountStore.getUserId(),
                            date: new Date(),
                        },
                        views: 10,
                        rating: { total: -5, rating: 0 },
                        annotations: [1],
                    },
                },
                {
                    name: "You can view the third result here",
                    id: "3",
                    snippet: "This is the third result...",
                    metadata: {
                        bookmark: { userId: "test", date: new Date() - 2000 },
                    },
                },
                {
                    name: "You can view the fourth result here",
                    id: "4",
                    snippet: "This is the fourth result...",
                    metadata: {},
                },
                {
                    name: "You can view the fifth result here",
                    id: "5",
                    snippet: "This is the fifth result...",
                    metadata: {},
                },
            ];
        }

        return state.results;
    },
    getSearchResultsMap() {
        return state.results.reduce(function (map, result) {
            if (result.url) {
                map[result.url] = result;
            } else {
                map[result.id] = result;
            }
            return map;
        }, {});
    },
    getSearchState() {
        return {
            query: state.query,
            vertical: state.vertical,
            page: state.page || 1,
            provider: state.provider,
        };
    },
    getSearchProgress() {
        return {
            finished: state.finished,
            resultsNotFound: state.resultsNotFound,
        };
    },

    ////

    modifyMetadata(id, newData) {
        state.results.forEach((result) => {
            if (result.id) {
                if (result.id === id) {
                    result.metadata = Object.assign(result.metadata, newData);
                }
            } else if (result.url === id) {
                result.metadata = Object.assign(result.metadata, newData);
            }
        });

        SearchStore.emitChange();
    },

    ////

    dispatcherIndex: register((action) => {
        switch (action.type) {
            case "rank":
                _reshuffleResults();
                break;
            case "set_stance":
                _setStance();
                break;
            case ActionTypes.SAVE_LOGUI:
                _save_logui(state.logui_json);
                break;
            case ActionTypes.SEARCH:
                _search(
                    action.payload.query,
                    action.payload.vertical,
                    action.payload.page
                );
                break;
            case ActionTypes.CHANGE_VERTICAL:
                _search(state.query, action.payload.vertical, 1);
                break;
            case ActionTypes.CHANGE_PAGE:
                _search(state.query, state.vertical, action.payload.page);
                break;
            case ActionTypes.UPDATE_METADATA:
                _update_metadata();
                break;
            case ActionTypes.OPEN_URL:
                state.activeUrl = action.payload.url;
                state.activeDoctext = action.payload.doctext;
                SyncStore.emitViewState(action.payload.url);
                break;
            case ActionTypes.CLOSE_URL:
                state.activeUrl = "";
                state.activeDoctext = "";
                SyncStore.emitViewState(null);
                break;
            case ActionTypes.GET_DOCUMENT_BY_ID:
                _getById(action.payload.id);
                break;
            case ActionTypes.RESET:
                _setState();
                break;
            case ActionTypes.CHANGE_VARIANT:
                _setVariant();
                break;
            default:
                break;
        }

        SearchStore.emitChange();
    }),
});

const _setStance = () => {};
////
const _save_logui = (logui_json) => {
    console.log("inside logui_json");

    logui_json = {
        query_box_focus: "test",
        query_box_lose_focus: "test",
        query_box_change: "test",
        query_submission: "test",
        left_rail_item_mouse_movements: "test",
        left_rail_item_mouse_click: "test",
        entity_mouse_movements: "test",
    };

    request
        .get(
            process.env.REACT_APP_SERVER_URL +
                "/v1/insert_single_logui_data/text" +
                "/?loguiData=" +
                JSON.stringify(logui_json) +
                "&userId=" +
                AccountStore.getUserId() +
                "&sessionId=" +
                AccountStore.getSessionId()
        )
        .end((err, res) => {
            console.log("logui");
            if (err || !res.body || res.body.error) {
                console.log("", err);
            }
            console.log("logui res", res.body.result);
            // SearchStore.emitChange();
        });
};

const _search = (query, vertical, page) => {
    const startTime = new Date().getTime();
    console.log("start _Search");
    if (
        !(
            query === state.query &&
            vertical === state.vertical &&
            page === state.page
        )
    ) {
        console.log("query or vertical or page don't match");
        state.results = [];
    }

    state.query = query || state.query;
    state.vertical = vertical || state.vertical;
    state.page = page || state.page || 1;
    state.finished = false;
    state.resultsNotFound = false;
    console.log("_updateURL");

    _updateUrl(
        state.query,
        state.vertical,
        state.page,
        state.provider,
        state.variant
    );
    SyncStore.emitSearchState(SearchStore.getSearchState());
    SearchStore.emitChange();

    if (query === "") {
        return;
    }
    console.log("start _requesting");
    const searchAPI =
        process.env.REACT_APP_SERVER_URL +
        "/v1/search/" +
        state.vertical +
        "/?query=" +
        state.query +
        "&page=" +
        state.page +
        "&userId=" +
        AccountStore.getUserId() +
        "&sessionId=" +
        AccountStore.getSessionId() +
        "&providerName=" +
        state.provider;
    // "&relevanceFeedback=" +
    // state.relevanceFeedback +
    // "&distributionOfLabour=" +
    // state.distributionOfLabour
    console.log("requesting:", searchAPI);

    const getSearchResult = async function (searchAPI) {
        console.log("asycning API");
        let res = await request
            .get(searchAPI)
            .set("Accept", "application/json")
            .timeout({
                response: 1000, // Wait 5 seconds for the server to start sending,
                deadline: 5000, // but allow 1 minute for the file to finish loading.
            });

        // await new Promise((resolve) => setTimeout(resolve, 500));

        // .set("Cache-Control", "no-cache, must-revalidate");
        console.log(res);
        return res;
    };

    getSearchResult(searchAPI)
        .then((res) => {
            console.log("inside THEN REST");

            if (res.body || res.body.error) {
                const results = res.body.results;
                for (let i = 0; i < results.length; i++) {
                    results[i].position = i;
                }

                state.results = results;
                state.matches = res.body.matches;
                state.serpId = res.body.id;
            }

            if (state.results.length === 0) {
                state.resultsNotFound = true;
            }
            console.log("results:", state.results);
            state.elapsedTime = new Date().getTime() - startTime;
            state.finished = true;

            SearchStore.emitChange();
            SessionActions.getQueryHistory();
            console.log("action end");
            // } catch (err) {
            // console.log("err:", err);
            // }
        })
        .catch((err) => {
            console.log("requesting elastic provide fails:", err);
        });

    console.log("SKIPPING END");
};

const _getById = function (id) {
    request
        .get(
            process.env.REACT_APP_SERVER_URL +
                "/v1/search/" +
                state.vertical +
                "/getById/" +
                id +
                "?providerName=" +
                state.provider
        )
        .end((err, res) => {
            if (!res.body.error) {
                const result = res.body.result;
                if (result.url) {
                    state.activeUrl = result.activeUrl;
                } else {
                    state.activeUrl = result.id;
                }

                var doctext = result.text.split("\n").map((item, key) => {
                    return (
                        <span key={key}>
                            {item}
                            <br />
                        </span>
                    );
                });

                doctext.unshift(
                    <h4>
                        {" "}
                        {result.source} <br />
                    </h4>
                );
                doctext.unshift(
                    <h3>
                        {" "}
                        {result.name} <br />
                    </h3>
                );

                state.activeDoctext = doctext;
            }

            SyncStore.emitViewState(id);
            SearchStore.emitChange();
        });
};

const updateStance = function () {};

const _updateUrl = function (query, vertical, page, provider, variant) {
    const url = window.location.href;
    const route = url.split("/").pop().split("?")[0];
    let params =
        "q=" +
        query +
        "&v=" +
        vertical +
        "&p=" +
        page +
        "&provider=" +
        provider;
    if (config.variantQueryParameter) {
        params += "&variant=" + variant;
    }

    // todo: change this back to push to enable back button
    history.replace({
        pathname: route,
        search: params,
    });
};

/*
 * Update result metadata by refreshing bookmarks and excludes from the BookmarkStore
 */
const _update_metadata = function () {
    // const bookmarks = BookmarkStore.getBookmarks();
    // const excludes = BookmarkStore.getExcludes();
    // const bookmarkMap = {};
    // const excludeMap = {};
    // bookmarks.forEach(bookmark => {
    // bookmarkMap[bookmark.url] = bookmark;
    // });
    // excludes.forEach(exclude => {
    //     excludeMap[exclude.url] = exclude;
    // });
    // const annotationsMap = AnnotationStore.getAnnotations();
    // const ratingsMap = RatingStore.getRatings();

    state.results = state.results.map((result) => {
        // const newresult = result;
        // const resultId = result.url ? result.url : result.id;
        // newresult.metadata.bookmark = bookmarkMap[resultId];
        // newresult.metadata.exclude = excludeMap[resultId];
        // if (annotationsMap.hasOwnProperty(resultId)) {
        //     newresult.metadata.annotations = annotationsMap[resultId];
        // }
        // if (ratingsMap.hasOwnProperty(resultId)) {
        //     newresult.metadata.rating = ratingsMap[resultId];
        // }
        // return newresult;
    });

    SearchStore.emitChange();
};

////

if (Helpers.getURLParameter("q")) {
    _search();
}

export default SearchStore;
