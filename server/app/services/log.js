"use strict";

const mongoose = require("mongoose");
const Log = mongoose.model("Log");

exports.insertLogs = async function (userId, queue) {
    queue = queue
        .filter((event) => {
            return typeof event === "object"
            // return typeof event === "object" && event.userId === userId;
        })
        .map((event) => {
            if (!("date" in event)) event.date = new Date();
            return event;
        });
    console.log("NEW LOG:", queue[0].event);
    return Log.insertMany(queue);
};
