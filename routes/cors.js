const express = require("express");
const cors = require("cors");
const app = express();

const whitelist = ["http://localhost:3000", "https://localhost:3443", "http://lmypc:3001", "http://localhost:3001", "https://blissful-johnson-c7f603.netlify.app/","https://restaurant-mern-server.herokuapp.com/"];
var corsOptionsDelegate = (req, callback) => {
    var corsOptions;
    if (whitelist.indexOf(req.header("Origin")) !== -1) {
        corsOptions = { origin: true };
    }
    else {
        corsOptions = { origin: false };

    }
    callback(null, corsOptions);
};

exports.cors = cors();
exports.corsWithOptions = cors(corsOptionsDelegate);
