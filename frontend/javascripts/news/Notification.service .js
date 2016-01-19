var app = require('../app.js');
var _ = require('lodash');

app.factory('NotificationService', NotificationService);

NotificationService.$inject = ["$resource"];

function NotificationService($resource) {
	return {
		newsCreated: newsCreated,
		packPublished: packPublished,
		newComment: newComment,
		newPostLike: newPostLike,
		newCommentLike: newCommentLike
	};

	function newsCreated(post, allUsers) {
		var users;
		users = allUsers.map(function(x) {return x._id; });
		users = _.difference(users, post.restrict_ids);
		//Should also filter users by access roles
		var data = {
			title: 'New post in Company news',
			text: post.title,
			serviceType: 'News',
			url: 'http://team.binary-studio.com/#/company?post=' + post._id,
			users: users,
			sound: true
		};
		return $resource("app/api/notification", {}, {
					save: { method: 'POST', 
						headers: {'Content-Type': 'application/json'}
					}
				}).save(data).$promise;
	}

	function packPublished(pack, allUsers) {
		var users;
		users = allUsers.map(function(x) {return x._id; });
		var data = {
			title: 'New Weeklies pack published',
			text: pack.title,
			serviceType: 'News',
			url: 'http://team.binary-studio.com/#/weeklies?pack=' + pack._id,
			users: users,
			sound: true
		};
		return $resource("app/api/notification", {}, {
					save: { method: 'POST', 
						headers: {'Content-Type': 'application/json'}
					}
				}).save(data).$promise;
	}


	function newComment(post, user) {
		var data = {
			title: 'New comment to your post',
			text: user.name + ' ' + user.surname + ' commented your post',
			serviceType: 'News',
			url: 'http://team.binary-studio.com/#/sandbox?post=' + post._id,
			users: [post.author],
			sound: true
		};
		return $resource("app/api/notification", {}, {
					save: { method: 'POST', 
						headers: {'Content-Type': 'application/json'}
					}
				}).save(data).$promise;
	}

	function newPostLike(post, user) {
		var data = {
			title: 'New like to your post',
			text: user.name + ' ' + user.surname + ' likes your post',
			serviceType: 'News',
			url: 'http://team.binary-studio.com/#/sandbox?post=' + post._id,
			users: [post.author],
			sound: true
		};
		return $resource("app/api/notification", {}, {
					save: { method: 'POST', 
						headers: {'Content-Type': 'application/json'}
					}
				}).save(data).$promise;
	}

	function newCommentLike(post, user) {
		var data = {
			title: 'New like to your comment',
			text: user.name + ' ' + user.surname + ' likes your comment',
			serviceType: 'News',
			url: 'http://team.binary-studio.com/#/' + post.type + '?post=' + post._id,
			users: [post.author],
			sound: true
		};
		return $resource("app/api/notification", {}, {
					save: { method: 'POST', 
						headers: {'Content-Type': 'application/json'}
					}
				}).save(data).$promise;
	}
}
