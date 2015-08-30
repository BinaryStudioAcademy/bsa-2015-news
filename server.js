var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var mongooseConnection = require('./db/dbconnect').connection;

var app = express();

staticPath = path.normalize(__dirname + '/bower_components');
app.use('news/bower_components', express.static(staticPath));
app.use('/', express.static(__dirname + '/public'));

app.set('view engine', 'jade');
app.set('views', __dirname + '/views');

app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(bodyParser.json());

var routes = require('./routes/')(app);

var server = app.listen(4035, function() {
	console.log('http://localhost:4035');
});

module.exports = app;
