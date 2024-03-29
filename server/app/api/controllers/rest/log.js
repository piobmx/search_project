"use strict";

const log = require("../../../services/log");

exports.insertLogs = function (req, res) {
    const userId = req.params.userId;
    const eventData = req.body.data;

    log.insertLogs(userId, eventData)
        .then(() => {
            console.log("INSERTING LOG:");
            res.status(201).json({
                error: false,
            });
        })
        .catch((err) => {
            console.log("insertLogs err:", err);

            res.status(400).json({
                error: true,
                message: "Could not insert logs.",
            });
        });
};
