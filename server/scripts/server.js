'use strict';

// Default NODE_ENV to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

// Load newrelic application monitoring in production
if (process.env.NODE_ENV === 'production') {
    require('newrelic');
}

// Check ENV variables
const requiredEnv = ['PORT', 'DB', 'REDIS', 'DEFAULT_SEARCH_PROVIDER'];
const unsetEnv = requiredEnv.filter((env) => !(env in process.env));
if (unsetEnv.length > 0) {
    throw new Error(
        'Required ENV variables are not set: [' + unsetEnv.join(', ') + ']',
    );
}

var timeout = require('connect-timeout');
// Load dependencies
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(timeout('10s'));
// const cors= require('cors');
// app.use(cors());

const http = require('http').Server(app);
const router = express.Router();

const { Server } = require('socket.io');
const io = new Server(http, {
    // timeout: 4000,
    cors: {
        origin: [
            'http://localhost:8080',
            'http://127.0.0.1:8080',
            'ws://127.0.0.1:8080',
            'http://84.46.248.181:8080',
            'ws://84.46.248.181:8080',
        ],
        //	    origin: "http://127.0.0.1:8080",
        methods: ['GET', 'POST'],
        credentials: true,
    },
});

// Run initializers
require('../app/config/initializers/mongoose')(process.env.DB);
require('../app/api/routes/v1/rest')(router);
require('../app/api/routes/v1/socket')(io);

// Setup server
app.set('port', process.env.PORT);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
function errorHandler(err, req, res, next) {
    console.log('Oops');
}
app.use(errorHandler);

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    //res.header("Access-Control-Allow-Origin", "http://127.0.0.1:8080");
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept',
    );
    //res.header("Access-Control-Allow-Headers", "Content-Type,Authorization");
    next();
});
app.use('/v1', router);

app.get('/', (req, res) => {
    // res.setTimeout(6000, function () {
    //     console.log("app.get Request has timed out.");
    //     res.send(408);
    // });

    res.send('The API is up and running!');
});

// app.get("/", function (req, res) {
//     res.status(418).json({
//         error: false,
//         message: "The API is up and running.",
//     });
// });

// Start the server
console.log('Starting Server');
//http.listen()
// let host = "127.0.0.1"
let host = "84.46.248.181"
//let host = "0.0.0.0"


http.listen(
    app.get('port'),
    host,
    function () {
        console.log(`SearchX API is running on address: ${host}:${app.get('port')}`);
    },
);
