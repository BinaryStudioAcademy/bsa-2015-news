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
		total.removed.userRoles = data.result.n;
		RoleRepository.drop(function(err, data) {
			if (err) {
				callback(err, null);
			}
			total.removed.localRoles = data.result.n;
			PackRepository.drop(function(err, data) {
				if (err) {
					callback(err, null);
				}
				total.removed.packs = data.result.n;
				NewsRepository.drop(function(err, data) {
					if (err) {
						callback(err, null);
					}
					total.removed.news = data.result.n;
					callback(err, total);
				});
			});
		});
	});
};

module.exports = new NewsService();