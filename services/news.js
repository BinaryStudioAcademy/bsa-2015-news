var _ = require('lodash');
var NewsRepository = require('../repositories/news.js');

var PackRepository = require('../repositories/pack.js');
var RoleRepository = require('../repositories/role.js');
var UserRepository = require('../repositories/user.js');

var NewsService = function() {
};

NewsService.prototype.dropAll = function(callback) {
	var total = {removed: {}};
	UserRepository.drop(function(err, data) {
		if (err) {
			callback(err, null);
		}
		total.removed.userCollection = data.result.n;
		RoleRepository.drop(function(err, data) {
			if (err) {
				callback(err, null);
			}
			total.removed.roleCollection = data.result.n;
			PackRepository.drop(function(err, data) {
				if (err) {
					callback(err, null);
				}
				total.removed.packCollection = data.result.n;
				NewsRepository.drop(function(err, data) {
					if (err) {
						callback(err, null);
					}
					total.removed.newsCollection = data.result.n;
					callback(err, total);
				});
			});
		});
	});
};

/*NewsService.prototype.toggleCommentlike = function(userId, newsId, commentId, callback) {
	NewsRepository.getComments(newsId, function(err, data) {
		if (err) {
			callback(err, null);
		}
		var comment = _.find(data.comments, function(comment) {
			return comment._id == commentId;
		});
		var like = _.find(comment.likes, function(likeId) {
			return likeId == userId;
		});
		if (like) {
			NewsRepository.dislikeComment(userId, newsId, commentId, function(err, data) {
				data.like = 'removed';
				callback(err, data);
			});
		}
		else {
			NewsRepository.likeComment(userId, newsId, commentId, function(err, data) {
				data.like = 'added';
				callback(err, data);
			});
		}
	});
};*/

module.exports = new NewsService();