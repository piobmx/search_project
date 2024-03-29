import request from "superagent";
import EventEmitter from "events";
import config from "../../config";

import { register } from "../../utils/Dispatcher";
import ActionTypes from "../../actions/ActionTypes";
import SessionActions from "../../actions/SessionActions";

// import { log } from "../../utils/Logger";
// import { LoggerEventTypes } from "../../utils/LoggerEventTypes";
import Helpers from "../../utils/Helpers";

import SyncStore from "../../stores/SyncStore";
import AccountStore from "../../stores/AccountStore";
import history from "../History";
// import BookmarkStore from "./features/bookmark/BookmarkStore";
// import AnnotationStore from "./features/annotation/AnnotationStore";
// import RatingStore from "./features/rating/RatingStore";
import React from "react";
import UserStore from "../../stores/UserStore";
const CHANGE_EVENT = "change_search";

////

if (process.env.NODE_ENV === "development") {
    console.log(
        "------ Helpers.getURLParameter('provider'): " +
            Helpers.getURLParameter("provider")
    );
    console.log("------ config.defaultProvider: " + config.defaultProvider);
}
const provider = Helpers.getURLParameter("provider") || config.defaultProvider;

let state;

const _setVariant = function() {
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
const _setState = function() {
    const bias = localStorage.getItem("bias") || "";
    const topic = localStorage.getItem("topic") || "";
    const view = localStorage.getItem("view") || "";

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
        topic: topic,
        bias: bias,
        view: view,
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

    ////
    getUserView() {
        return state.view;
    },
    setUserView(newView, update) {
        state.view = newView;
        localStorage.setItem("view", newView);
        if (update) {
            _updateUrl(
                state.query,
                state.vertical,
                state.page,
                state.provider,
                state.variant,
                state.topic,
                state.bias,
                state.view
            );
        }
        this.emitChange();
    },
    getBias() {
        return state.bias;
    },
    setBias(newBias, update) {
        state.bias = newBias;
        localStorage.setItem("bias", newBias);
        if (update) {
            _updateUrl(
                state.query,
                state.vertical,
                state.page,
                state.provider,
                state.variant,
                state.topic,
                state.bias,
                state.view
            );
        }
        this.emitChange();
    },

    getTopic() {
        return state.topic;
    },
    setTopic(newTopic, update) {
        state.topic = newTopic;
        localStorage.setItem("topic", newTopic);
        if (update) {
            _updateUrl(
                state.query,
                state.vertical,
                state.page,
                state.provider,
                state.variant,
                state.topic,
                state.bias,
                state.view
            );
        }
        this.emitChange();
    },

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
        return state.results;
    },

    getSearchResultsMap() {
        return state.results.reduce(function(map, result) {
            if (result.url) {
                map[result.url] = result;
            } else {
                map[result.id] = result;
            }
            return map;
        }, {});
    },
    getSearchState() {
        const searchState = {
            query: state.query,
            vertical: state.vertical,
            page: state.page || 1,
            provider: state.provider,
            topic: state.topic,
            viewpoint: state.view,
            biasType: state.bias,
        };
        return searchState
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
                //_reshuffleResults();
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
    // console.log("inside logui_json");

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
            // console.log("logui");
            if (err || !res.body || res.body.error) {
                // console.log("", err);
            }
            // console.log("logui res", res.body.result);
            // SearchStore.emitChange();
        });
};


const topicKeywords = {
    "ath": ["atheist", "atheism"],
    "ipr": ["property right", "intellectual property right", "intellectual right"],
    "su": ["uniform", "school uniform"],
}

const _search = (query, vertical, page) => {
    const startTime = new Date().getTime();
    // const bias = state.bias;
    // console.log('');console.log("start _Search");
    // console.log(query, state.query);
    // console.log(vertical, state.vertical);
    // console.log(page, state.page);
    // console.log("BIAS", bias);
    // if (!query) {
    //     query = "a"
    // }
    // console.log("QUERY:", query);
    if (
        !(
            query === state.query &&
            vertical === state.vertical &&
            page === state.page
        )
    ) {
        state.results = [];
    }

    state.query = query || state.query;
    state.vertical = vertical || state.vertical;
    state.page = page || state.page || 1;
    state.finished = false;
    state.resultsNotFound = false;

    _updateUrl(
        state.query,
        state.vertical,
        state.page,
        state.provider,
        state.variant,
        state.topic,
        state.bias,
        state.view
    );

    const url = window.location.href;
    // console.log("url:", url);
    let params = {};
    let paramString = url.substring(url.indexOf("?") + 1);
    let paramArray = paramString.split("&");
    for (let i = 0; i < paramArray.length; i++) {
        let param = paramArray[i].split("=");
        params[param[0]] = param[1];
    }
    // console.log("SParams:", params);

    SyncStore.emitSearchState(SearchStore.getSearchState());
    SearchStore.emitChange();

    if (query === "") {
        return;
    }
    // console.log("start _requesting");
    const searchAPI =
        process.env.REACT_APP_SERVER_URL +
        "/v1/search/" +
        state.vertical +
        "/?query=" +
        state.query +
        "&page=" +
        state.page +
        "&topic=" +
        SearchStore.getTopic() +
        "&bias=" +
        SearchStore.getBias() +
        "&viewpoint=" +
        SearchStore.getUserView() +
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
    // console.log("requesting:", searchAPI);

    const getSearchResult = async function(searchAPI) {
        // console.log("asycning API");
        try {
            // console.log("TRYING...", searchAPI);
            let res = await request
                .get(searchAPI)
                .set("Accept", "application/json")
                .timeout({
                    response: 3000, // Wait 1 seconds for the server to start sending,
                    deadline: 5000, // but allow 5 seconds for the file to finish loading.
                });
            // await new Promise((resolve) => setTimeout(resolve, 500));
            // .set("Cache-Control", "no-cache, must-revalidate");
            return res;
        } catch (err) {
            console.error(err);
        }
    };

    getSearchResult(searchAPI)
        .then((res) => {
            if (res.body || res.body.error) {
                let results = res.body.results;
                // rank results here ...
                // console.log(`ranking results...(${bias})`);
                // results = rankingResults(results, bias);

                for (let i = 0; i < results.length; i++) {
                    results[i].position = i;
                }

                console.log(";state.query", state.query.toLowerCase());
                console.log(";state.topic", state.topic);
                
                let flag = false
                const currentQuery = state.query.toLowerCase()
                for (let keyword of topicKeywords[state.topic]) {
                    if (currentQuery.includes(keyword)) flag = true
                }

                if (flag) {state.results = results;}
                else {state.results = []}
                // console.log("RESULTS:", results);
                state.matches = res.body.matches;
                state.serpId = res.body.id;
            }

            if (state.results.length === 0) {
                state.resultsNotFound = true;
            }
            // console.log("results:", state.results);
            state.elapsedTime = new Date().getTime() - startTime;
            state.finished = true;

            SearchStore.emitChange();
            SessionActions.getQueryHistory();
            // console.log("action end");
            // } catch (err) {
            // console.log("err:", err);
            // }
        })
        .catch((err) => {
            // console.log("requesting elastic provide fails:", err);
        });

    // console.log("SKIPPING END");
};

const _getById = function(id) {
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

const topicList = ["na", "ipr", "ath", "su"];
const biasTypeList = ["na", "balanced", "biased"];
const viewPointList = ["na", "vp0", "vp2", "vp1"];

const _updateUrl = function(
    query,
    vertical,
    page,
    provider,
    variant,
    topic,
    bias,
    view
) {
    const url = window.location.href;
    // console.log("url:", url);
    let old_params = {};
    let paramString = url.substring(url.indexOf("?") + 1);
    let paramArray = paramString.split("&");
    for (let i = 0; i < paramArray.length; i++) {
        let param = paramArray[i].split("=");
        old_params[param[0]] = param[1];
    }
    // console.log("PParams:", old_params);
    let qid;
    if (old_params.hasOwnProperty("qid")) {
        UserStore.setFromQualtics(true);
        qid = old_params["qid"];
        UserStore.setQualtricsID(qid);
    } else {
        if (localStorage.hasOwnProperty("qid")) {
            UserStore.setFromQualtics(true);
            qid = localStorage.getItem("qid");
            UserStore.setQualtricsID(qid);
        } else {
            UserStore.setFromQualtics(false);
        }
    }
    if (old_params.hasOwnProperty("b")) {
        SearchStore.setBias(old_params["b"], false);
    }

    if (old_params.hasOwnProperty("t")) {
        SearchStore.setTopic(old_params["t"], false);
    }
    if (old_params.hasOwnProperty("vp")) {
        SearchStore.setUserView(old_params["vp"], false);
    }
    // bias = old_params["b"] || localStorage.getItem("bias") || "";
    // topic = old_params["t"] || localStorage.getItem("topic") || "";
    // view = old_params["vp"] || localStorage.getItem("view") || "";

    bias = localStorage.getItem("bias") || "na";
    topic = localStorage.getItem("topic") || "na";
    view = localStorage.getItem("view") || "na";
    // console.log("BIAS", bias, "TOPIC:", topic, "VP", view);
    // console.log("NEWEST URL:", url);
    const route = url
        .split("/")
        .pop()
        .split("?")[0];
    let topicParam = topic === "na" ? "na" : topic.toLowerCase();
    let biasParam = bias === "na" ? "na" : bias.toLowerCase();
    let viewParam = view === "na" ? "na" : view.toLowerCase();

    // console.log("BIASp", biasParam, "TOPIC:", topicParam, "VPs", viewParam);
    if (
        !biasTypeList.includes(biasParam.toLowerCase()) ||
        !topicList.includes(topicParam.toLowerCase()) ||
        !viewPointList.includes(viewParam.toLowerCase())
    ) {
        if (!biasTypeList.includes(biasParam.toLowerCase())) {
            biasParam = "na";
        }
        if (!topicList.includes(topicParam.toLowerCase())) {
            topicParam = "na";
        }
        if (!viewPointList.includes(viewParam.toLowerCase())) {
            viewParam = "na";
        }
        console.error("URL PARAMS NOT LEGIT");
    }

    let params =
        "q=" +
        query +
        "&qid=" +
        qid +
        "&v=" +
        vertical +
        "&p=" +
        page +
        "&provider=" +
        provider +
        "&t=" +
        topicParam +
        "&b=" +
        biasParam +
        "&vp=" +
        viewParam;
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
const _update_metadata = function() {
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

    // state.results = state.results.map((result) => {
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
    // });

    SearchStore.emitChange();
};

////

if (Helpers.getURLParameter("q")) {
    _search();
} else {
    _updateUrl(
        state.query,
        state.vertical,
        state.page,
        state.provider,
        state.variant,
        state.topic,
        state.bias,
        state.view
    );
}

export default SearchStore;
