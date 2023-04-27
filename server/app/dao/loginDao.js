const {Client} = require('pg')

const client = new Client({
    //host: "84.46.248.181",
	host: "127.0.0.1",
    user: "curry",
    port: 5432,
    password: "currypass",
    database: "curry"
})

exports.getAuth = function(userId) {
    
    client.connect();
    
    // let sql = "Select \"isManager\" from auth where \"userId\" = '" + userId + "'";
    let sql = `SELECT isManager from public.auth where userId='${userId}'`

    client.query(sql, (err, res) => {
        let data = false;
        if(!err){
            data = res.rows[0]["isManager"];
        } else {
            console.log(err.message);
        }
        client.end;

        console.log("data3: " + data);
        return data;
    })
};
