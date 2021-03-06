var express = require('express');
var ParseServer = require('parse-server').ParseServer;
var ParseDashboard = require('parse-dashboard');
var parseServerConfig = require('parse-server-azure-config');
var http = require('http');
var url = require('url');

var config = parseServerConfig(__dirname, {
  defaults: 'config.js',
  secrets: 'secrets.js'
});

// Modify config as necessary before initializing parse server & dashboard

config.server.liveQuery = {
  classNames: ['EventZ']
};

config.server.websocketTimeout = 10 * 1000;
config.server.cacheTimeout = 60 * 600 * 1000;
config.server.logLevel = 'VERBOSE';

console.log(config);

var app = express();
app.use('/public', express.static(__dirname + '/public'));
app.use('/parse', new ParseServer(config.server));
app.use('/parse-dashboard', ParseDashboard(config.dashboard));

var httpServer = http.createServer(app);
httpServer.listen(process.env.PORT || url.parse(config.server.serverURL).port, function () {
  console.log(`Parse Server running at ${config.server.serverURL}`);
});

var parseLiveQueryServer = ParseServer.createLiveQueryServer(httpServer);