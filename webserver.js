//dependencies laden
const $ = require('jquery');
const fs = require('fs')
const fetch = require("node-fetch");
const jsome = require('jsome');
const log = require('noogger');
const stringify = require('json-stable-stringify');
const appRootPath = require('app-root-path');
const appRoot = appRootPath + "/jolly_hellfire/webserver";

const express = require('express');
const app = express();

// Init Log
var logParams = {
	consoleOutput : true,
	consoleOutputLevel:'DEBUG',    
	dateTimeFormat: "DD-MM-YYYY HH:mm:ss",
	fileNameDateFormat: "YYYY-MM-DD",
	fileNamePrefix:"express-",
	outputPath: appRoot + "/logs/"
}; 
log.init(logParams);
log.alert("STARTING SCRIPT");


//express server
app.use(express.static(appRoot));
app.get("/testpage", function(req, res) {
	var filename = "/testpage.html";
	res.sendfile(appRoot + filename);
	log.info("Send: " + filename);
});


app.listen(3000, function () {
    log.debug('Listening on port 3000.');
});

app.use(function(req, res, next) {
    res.status(404).send("Page not found");
    log.info("get invalid request")
});