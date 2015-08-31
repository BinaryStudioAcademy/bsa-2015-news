console.log('*** Making data for you... \n*** It could take some time...');

var fs = require('fs');
var casual = require('casual');
var Factory = require('rosie').Factory;
var _ = require('lodash');
var bcrypt = require('bcryptjs');
var MongoClient = require('mongodb').MongoClient;
// var objectId = require('./objectId.js');
var ObjectId = require('mongodb').ObjectID;

var salt = bcrypt.genSaltSync(10, function(err, salt) {return salt});
var hash = bcrypt.hashSync('111111', salt, function(err, hash) {return hash});

var db = {};
db.news = [];
db.users = [];

Factory.define('User')
	.sequence('_id', function() {return new ObjectId();})
	.attr('name', function() {return casual.name;})
	.attr('login', function() {return casual.email;})
	.attr('password', function() {return hash;});

Factory.define('News')
	.sequence('_id', function() {return new ObjectId();})
	.attr('type', function() {return _.sample(['company', 'sandbox', 'weekly']);})
	.attr('title', function() {return casual.title;})
	.attr('body', function() {return casual.text;})
	.attr('date', function() {return casual.integer(142202113, 1440338169);});

_.times(50, function(n) {
	var user = Factory.build('User');
	db.users.push(user);
});

_.times(200, function(n) {
	var news = Factory.build('News', {author: _.sample(db.users)._id, comments: [], likes: []});
	_.times(casual.integer(1, 5), function(nn) {
		var comment = {_id: new ObjectId(), author: _.sample(db.users)._id, body: casual.title, date: news.date + casual.integer(200, 350) * nn, likes: []};
		comment.likes = _.pluck(_.sample(db.users, casual.integer(0, 10)), '_id');
		news.comments.push(comment);
	});
	news.likes = _.pluck(_.sample(db.users, casual.integer(0, 10)), '_id');
	db.news.push(news);
});

var url = 'mongodb://localhost:27017/intranet-news';

_.forEach(db, function(obj, name) {
	MongoClient.connect(url, function(err, database) {
		if (err) throw err;

		database.collection(name).remove({});
		database.collection(name).insert(obj);
		database.close();
	});
});

console.log('Done!');
