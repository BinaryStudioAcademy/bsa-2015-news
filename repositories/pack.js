var mongoose = require('mongoose');
var Repository = require('../units/Repository');
var Pack = require('../schemas/pack');

var PackRepository = function(){
	Repository.prototype.constructor.call(this);
	this.model = Pack;
};

PackRepository.prototype = new Repository();

PackRepository.prototype.getAll = function(queryString, callback) {
	var query;
	if (queryString.published === 'yes') {
		query = {published: true};
	} else {
		query = {published: false};
	}
	Pack.find(query).lean()
		.sort({date:-1})
		.skip(queryString.skip)
		.limit(queryString.limit)
		.exec(callback);
};

PackRepository.prototype.getById = function(id, callback) {
	Pack.findOne({_id: id}).lean()
		.exec(callback);
};

PackRepository.prototype.pushNews = function(packId, body, callback) {
	Pack.update({_id: packId}, {$pushAll: {news: body.newsArray}})
		.exec(callback);
};

PackRepository.prototype.removeNews = function(packId, newsId, callback) {
	Pack.update({_id: packId}, {$pull: {news: newsId}})
		.exec(callback);
};

module.exports = new PackRepository();
