var mongoose = require('mongoose');
var Repository = require('../units/Repository');
var News = require('../schemas/news').model;

var NewsRepository = function(){
	Repository.prototype.constructor.call(this);
	this.model = News;
};

NewsRepository.prototype = new Repository();

NewsRepository.prototype.getAllNews = function(user, queryString, callback) {
	/*var roleQuery = user.role === 'ADMIN' ? {} : { $or: [ {access_roles: { $size: 0 }}, {access_roles: user.role} ] };
	News.find({ $and: [ roleQuery, { restrict_ids: { $nin: [user.id] } } ] })*/
	var typeFilter = queryString.type ? {type: queryString.type} : {};
	var query = user.role === 'ADMIN' ? typeFilter : { $and: [ { $or: [ {access_roles: { $size: 0 }}, {access_roles: user.role} ] }, { restrict_ids: { $nin: [user.id] } }, typeFilter] };
	News.find(query)
		.sort({date:-1})
		.skip(queryString.skip)
		.limit(queryString.limit)
		.exec(callback);
};

NewsRepository.prototype.getNews = function(user, newsId, callback) {
	/*var roleQuery = user.role === 'ADMIN' ? {} : { $or: [ {access_roles: { $size: 0 }}, {access_roles: user.role} ] };
	News.findOne({ $and: [ {_id: newsId}, roleQuery, { restrict_ids: { $nin: [user.id] } } ] })
		.exec(callback);*/
	var query = user.role === 'ADMIN' ? {_id: newsId} : { $and: [ {_id: newsId}, { $or: [ {access_roles: { $size: 0 }}, {access_roles: user.role} ] }, { restrict_ids: { $nin: [user.id] } } ] };
	News.findOne(query)
		.exec(callback);
};

NewsRepository.prototype.getComments = function(newsId, callback) {
	News.findOne({_id: newsId}, {_id: 0, comments: 1})
		.exec(callback);
};

NewsRepository.prototype.likeComment = function(userId, newsId, commentId, callback) {
	News.update({_id: newsId,'comments._id': commentId}, {$addToSet: {'comments.$.likes': userId}})
		.exec(callback);
};

NewsRepository.prototype.dislikeComment = function(userId, newsId, commentId, callback) {
	News.update({_id: newsId,'comments._id': commentId}, {$pull: {'comments.$.likes': userId}})
		.exec(callback);
};

NewsRepository.prototype.editComment = function(userId, commentId, body, callback) {
	News.update({'comments._id': commentId}, {'$set': {'comments.$.body': body}})
		.exec(callback);
};

module.exports = new NewsRepository();
