// const Pool = require('pg').Pool;
const sqlite3 = require('sqlite3').verbose();
 
// const db = new sqlite3.Database("../../loguiDB/sepp.db", (err) => { 
const db = new sqlite3.Database("/home/curry/master_project/search_project/server/loguiDB/sepp.db", (err) => { 
	if (err) { 
		return console.error("LoguiDB connection ERR: ", err.message); 
	} 
	console.log('Connected to the in-memory SQlite database.');
});

module.exports = db;
//module.exports = pool;
