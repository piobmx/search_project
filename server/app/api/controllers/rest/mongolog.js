"use strict";

const mongoose = require('mongoose');
const Schema   = mongoose.Schema;
const Log = mongoose.model('Log');
const toFind = {}

// const agg = f().then((e) => console.log(e))

exports.getMongoLogs= async function (req, res) {
	const fo = await Log.find(toFind).sort({date: -1})
    res.status(200).json({ results: JSON.stringify(fo) });
};
