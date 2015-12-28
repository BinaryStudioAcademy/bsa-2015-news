var mongoose = require('mongoose');
var Repository = require('../units/Repository');
var News = require('../schemas/news');

var NewsRepository = function(){
	Repository.prototype.constructor.call(this);
	this.model = News;
};

NewsRepository.prototype = new Repository();

NewsRepository.prototype.getAllNews = function(user, callback) {
	/*var roleQuery = user.role === 'ADMIN' ? {} : { $or: [ {access_roles: { $size: 0 }}, {access_roles: user.role} ] };
	News.find({ $and: [ roleQuery, { restrict_ids: { $nin: [user.id] } } ] })
		.sort({date:-1})
		.exec(callback);*/
	var roleQuery = user.role === 'ADMIN' ? {} : { $or: [ {access_roles: { $size: 0 }}, {access_roles: user.role} ] };
	News.find({ $and: [ roleQuery, { restrict_ids: { $nin: [user.id] } } ] })
		.sort({date:-1})
		.exec(callback);
};

NewsRepository.prototype.getNews = function(user, newsId, callback) {
	/*var roleQuery = user.role === 'ADMIN' ? {} : { $or: [ {access_roles: { $size: 0 }}, {access_roles: user.role} ] };
	News.findOne({ $and: [ {_id: newsId}, roleQuery, { restrict_ids: { $nin: [user.id] } } ] })
		.exec(callback);*/
	News.findOne({_id: newsId})
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

module.exports = new NewsRepository();
