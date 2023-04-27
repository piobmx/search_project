"use strict";
const Utils = require("../../../utils");
const pool = require("../../../dao/db");

const insert_single_logui_data = async function (reqbody) {
    // console.log(
    // "(logui.js)insert_single_logui_data called!!: " +
    // JSON.stringify(req.body)
    // );
    // JSON.stringify(req.body);
    // console.log("req.url:", req.body.fullUrl);
    const loguiData = reqbody;
    const INV = "Invalid";
    const eventType = loguiData["eventType"];
    const eventDetailsType = loguiData["eventDetails"]["type"];
    if (eventDetailsType === "cursorTracking") {
        // res.status(200).json();
        return console.log("ignore cursorTracking event")
    }

    let eventDetailsTrackingDetails;
    if (loguiData["eventDetails"]) {
        eventDetailsTrackingDetails = JSON.stringify(loguiData["eventDetails"]);
    } else {
        eventDetailsTrackingDetails = INV;
    }
    const eventDetailsName = loguiData["eventDetails"]["name"];
    const fullUrl = loguiData["fullUrl"];
    const eventTimestamp = loguiData["timestamps"]["eventTimestamp"];
    const QID = loguiData["QID"];
    // console.log("userID:", userId)
    // console.log('type:', type);
    // console.log('trackingType:', trackingType);
    // console.log('details:', details);
    // console.log('eventTimestamp:', eventTimestamp);hhjj
    const text =
        "INSERT INTO loguidata(QID, eventType, eventDetailsType, eventDetailsName, eventDetailsTrackingDetails, eventTimestamp, fullUrl) VALUES(?,?,?,?,?,?,? )";
    // const text =
    //     'INSERT INTO loguiData(userID, UItype, trackingType, details, eventTimestamp) VALUES(?, ?, ?, ?, ?)';
    // const values = [userId, type, trackingType, details, eventTimestamp];
    const values = [
        QID,
        eventType,
        eventDetailsType,
        eventDetailsName,
        eventDetailsTrackingDetails,
        eventTimestamp,
        fullUrl,
    ];
    // console.log("LOGUI CLIENT:")
    // console.log(text)
    // console.log(values)
    await pool.run(text, values, (err, res) => {
        if (err) {
            return console.log(err.message);
        } else {
            console.log(`Row was added to the 'loguidata' table`);
        }
    });

    //let loguiSQL = `INSERT INTO public.loguiData(userID, UItype, trackingType, details, eventTimestamp) VALUES
    //                ('${userId}', '${type}', '${trackingType}', '${details}', '${eventTimestamp}')`;

    // pool.query(text, values, (err, res) => {
    //  if (err) {
    //    console.log(err.stack)
    //  } else {
    //    console.log(res.rows[0])
    //    // { name: 'brianc', email: 'brian.m.carlson@gmail.com' }
    //  }
    //})

    // pool.query(loguiSQL, (error, result) => {
    //     if (error) return false;
    //     //console.log('saved');
    //     res.status(200).json({ result: true });
    // });
};

const get_logui_data = (req, res) => {
    console.log("logui req query", req.query);
    const limit = req.query.topN;
    // const offset = req.query.offset
    const offset = 0;
    let sql = `SELECT * FROM loguidata ORDER BY eventTimestamp DESC LIMIT ${offset}, ${limit}`;
    console.log("sql: " + sql);
    let loguiResults = [];
    pool.all(sql, (error, results) => {
        if (error) throw error;
        results.forEach((row, ind) => {
            // console.log("inde:", ind);
            loguiResults.push(row);
        });
        res.status(200).json({ results: JSON.stringify(results) });
    });
    console.log("loguiR", loguiResults);
    // return loguiResults
};

module.exports = {
    insert_single_logui_data,
    get_logui_data,
};
