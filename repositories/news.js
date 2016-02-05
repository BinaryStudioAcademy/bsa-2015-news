var mongoose = require('mongoose');
var Repository = require('../units/Repository');
var News = require('../schemas/news').model;

var NewsRepository = function(){
	Repository.prototype.constructor.call(this);
	this.model = News;
};

NewsRepository.prototype = new Repository();

NewsRepository.prototype.getAllNews = function(user, queryString, callback) {
	var typeFilter = queryString.type ? {type: queryString.type} : {};
	var filter = {};
	if (queryString.filter) {
		filter = {body: { $regex: queryString.filter, $options: 'i' }};
		if (typeFilter !== 'sandbox') {
			filter = {$or :[filter, {title: { $regex: queryString.filter, $options: 'i' }}]};
		}
	}
	var dateFilter = {};
	if (queryString.maxDate) {
		dateFilter = {date: { $lte: queryString.maxDate }};
	}
	var query = user.role === 'ADMIN' ? { $and: [typeFilter, filter, dateFilter] } : { $and: [ { $or: [ {access_roles: { $size: 0 }}, {access_roles: user.role} ] }, { restrict_ids: { $nin: [user.id] } }, typeFilter, filter, dateFilter] };
	var sort = queryString.dateSort ? {date: queryString.dateSort} : {date: -1};
	News.find(query)
		.sort(sort)
		.skip(queryString.skip)
		.limit(queryString.limit)
		.exec(callback);
};

NewsRepository.prototype.getNews = function(user, newsId, callback) {
	var query = user.role === 'ADMIN' ? {_id: newsId} : { $and: [ {_id: newsId}, { $or: [ {access_roles: { $size: 0 }}, {access_roles: user.role} ] }, { restrict_ids: { $nin: [user.id] } } ] };
	News.findOne(query)
		.exec(callback);
};

NewsRepository.prototype.likeNews = function(userId, newsId, callback) {
	News.update({_id: newsId}, {$addToSet: {likes: userId}})
		.exec(callback);
};

NewsRepository.prototype.dislikeNews = function(userId, newsId, callback) {
	News.update({_id: newsId}, {$pull: {likes: userId}})
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
	News.update({'comments._id': commentId}, {'$set': {'comments.$.body': body, 'comments.$.edited_at': Date.now()}})
		.exec(callback);
};

module.exports = new NewsRepository();
