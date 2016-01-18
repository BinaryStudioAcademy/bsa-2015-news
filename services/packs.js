var _ = require('lodash');
var PackRepository = require('../repositories/pack.js');
var NewsRepository = require('../repositories/news.js');

var PacksService = function(){

};

PacksService.prototype.generateNotification = function() {

};

PacksService.prototype.getPack = function(id, user, callback) {
	PackRepository.getById(id, function(err, pack) {
		if (err) {
			return callback(err, null);
		}

		NewsRepository.getAllNews(user, 'weeklies', function(err, news) {
			if (err) {
				return callback(err, null);
			}
			
			pack.fullNews = [];
			pack.news.forEach(function(newsId) {
				pack.fullNews.push(_.find(news, {_id: newsId}));
			});

			callback(err, pack);
		});
	});
};

PacksService.prototype.getPacks = function(user, queryString, callback) {
	PackRepository.getAll(queryString, function(err, packs) {
		if (err) {
			return callback(err, null);
		}

		NewsRepository.getAllNews(user, 'weeklies', function(err, news) {
			if (err) {
				return callback(err, null);
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