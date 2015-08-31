var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var mongooseConnection = require('./db/dbconnect').connection;

var app = express();

staticPath = path.normalize(__dirname + '/bower_components');
app.use('/bower_components', express.static(staticPath));
app.use('/news', express.static(__dirname + '/public'));

app.set('view engine', 'jade');
app.set('views', __dirname + '/views');

app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(bodyParser.json());

var router = express.Router();
var routes = require('./routes/index.js')(router);

app.use('/news', router);


var server = app.listen(4035, function() {
	console.log('http://localhost:4035');
});

var io = require('socket.io').listen(server);
require('./io/webSocket.js')(io);

module.exports = app;
