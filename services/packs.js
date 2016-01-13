var _ = require('lodash');
var PackRepository = require('../repositories/pack.js');
var NewsRepository = require('../repositories/news.js');

var PacksService = function(){

};

PacksService.prototype.generateNotification = function() {

};

PacksService.prototype.getPacks = function(user, callback) {
	PackRepository.getAll(function(err, packs) {
		if (err) {
			callback(err, null);
		}

		NewsRepository.getAllNews(user, 'weeklies', function(err, news) {
			if (err) {
				callback(err, null);
			}

			packs.forEach(function(pack) {
				pack.fullNews = [];
				pack.news.forEach(function(newsId) {
					pack.fullNews.push(_.find(news, {_id: newsId}));
				});
			});
			callback(err, packs);
		});
	});
};

module.exports = new PacksService();