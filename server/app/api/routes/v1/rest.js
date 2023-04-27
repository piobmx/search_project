"use strict";

const LoginCtrl = require("../../controllers/rest/login");
const LoguiCtrl = require("../../controllers/rest/logui");
const mongolog = require("../../controllers/rest/mongolog");
const LogCtrl = require("../../controllers/rest/log");
const SearchCtrl = require("../../controllers/rest/search");
const FeatureCtrl = require("../../controllers/rest/feature");
const SessionCtrl = require("../../controllers/rest/session");
const SuggestionsCtrl = require("../../controllers/rest/suggestions");

module.exports = function (router) {
    router.use(function (req, res, next) {
        const timeout = 3000;
        res.header("Content-Type", "application/json");
        res.setTimeout(timeout, function () {
            console.log(
                "Request has timed out after " + timeout + " milliseconds."
            );
            res.send(408);
        });
        next();
    });

    // Logui
    router.get("/logui/:offset", LoguiCtrl.get_logui_data);
    router.get("/mongolog", mongolog.getMongoLogs);
    // TODO: logui
    router.post("/insert_single_logui_data", async function (req, res) {
        const result = await LoguiCtrl.insert_single_logui_data(req.body);
        res.send(result);
    });

    // Login
    router.get("/login/:userId", LoginCtrl.userIDLogin);
    // router.post('/login2', LoginCtrl.userNameLogin);

    // Clearer than 1/2
    router.get("/userIDLogin/:userId", LoginCtrl.userIDLogin);
    router.post("/passwordLogin", LoginCtrl.userNameLogin);

    // Register
    router.post("/register", LoginCtrl.register);

    // Search
    router.get("/search/:vertical", SearchCtrl.search);
    router.get("/search/:vertical/getById/:id", SearchCtrl.getById);

    // Suggestions
    router.get("/suggestions", SuggestionsCtrl.suggestions);

    // User
    router.get("/users/:userId/task/:task", SessionCtrl.getUserTask);
    router.get("/users/:userId/task/:task/data", SessionCtrl.getUserData);
    router.post("/users/:userId/logs", LogCtrl.insertLogs);
    router.post("/users/:userId/task/:task/topic", SessionCtrl.postUserTask);

    // Feature
    router.get("/session/:sessionId/query", FeatureCtrl.getQueryHistory);
    router.get("/session/:sessionId/bookmark", FeatureCtrl.getBookmarks);
    router.get("/session/:sessionId/exclude", FeatureCtrl.getExcludes);
    router.post("/session/:sessionId/bookmark", FeatureCtrl.addBookmark);
    router.post("/session/:sessionId/exclude", FeatureCtrl.addExclude);
    router.post("/session/:sessionId/bookmark/star", FeatureCtrl.starBookmark);
    router.delete("/session/:sessionId/bookmark", FeatureCtrl.removeBookmark);
    router.delete("/session/:sessionId/exclude", FeatureCtrl.removeExclude);
    router.get("/session/:sessionId/annotation", FeatureCtrl.getAnnotation);
    router.post("/session/:sessionId/annotation", FeatureCtrl.addAnnotation);
    router.delete(
        "/session/:sessionId/annotation",
        FeatureCtrl.removeAnnotation
    );
    router.get("/session/:sessionId/rating", FeatureCtrl.getRating);
    router.post("/session/:sessionId/rating", FeatureCtrl.submitRating);
    router.get("/session/:sessionId/chat", FeatureCtrl.getChatMessageList);
    router.post("/session/:sessionId/chat", FeatureCtrl.addChatMessage);
};
