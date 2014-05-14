"use strict";

var stocks = require("./stocks");

module.exports.endpoints = [
    { method: "GET", path: "/api/stocks/historical/{stock}", config: stocks.historical },
    { method: "GET", path: "/api/stocks/snapshot",           config: stocks.snapshot }
];
