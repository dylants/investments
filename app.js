"use strict";

var Hapi = require("hapi"),
    yaml = require("js-yaml"),
    fs = require("fs"),
    mongoose = require("mongoose");

var config,
    mongoConnection,
    serverOptions, serverConfiguration, server;

config = yaml.safeLoad(fs.readFileSync("./config.yaml", "utf8"));

/*
 * Connect to mongoDB using configuration found in the config file.
 * This connection will be used by the mongoose API throughout
 * our code base.
 */
mongoConnection = "";

// add username/password if supplied
if (config.mongo.username && config.mongo.password) {
    mongoConnection = config.mongo.username + ":" + config.mongo.password + "@";
}

// add the host
mongoConnection = mongoConnection + config.mongo.host;

// add the port if supplied
if (config.mongo.port) {
    mongoConnection = mongoConnection + ":" + config.mongo.port;
}

// add the database
mongoConnection = mongoConnection + "/" + config.mongo.database;

// connect to the database
mongoose.connect("mongodb://" + mongoConnection, function(error) {
    // handle the error case
    if (error) {
        console.error("Failed to connect to the Mongo server!!");
        console.error(error);
        throw error;
    }
});

// bring in all models into scope (these use mongoose)
fs.readdirSync("models").forEach(function(modelName) {
    require("./models/" + modelName);
});

// hapi server options
serverOptions = {
    host: process.env.HOST || config.server.host,
    port: process.env.PORT || config.server.port
};

// hapi server configuration options
serverConfiguration = {
    cors: true,
    security: true
};

// create the hapi server
server = new Hapi.Server(serverOptions.host, serverOptions.port, serverConfiguration);

// include the routes
server.route(require("./routes").endpoints);

// start the server
server.start(function() {
    console.log("Server started at: " + server.info.uri);
});
