var _ = require('lodash');
var NewsRepository = require('../repositories/news.js');

var NewsService = function(){

};

NewsService.prototype.generateNotification = function() {

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