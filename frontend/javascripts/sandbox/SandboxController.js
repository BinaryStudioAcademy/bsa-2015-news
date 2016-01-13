var app = require('../app');
var _ = require('lodash');

app.controller('SandboxController', SandboxController);


SandboxController.$inject = [
	'NewsService',
	'CompanyService',
	'$mdDialog',
	'$route',
	'$rootScope',
	'$filter',
	'socket',
	'$q',
	'$timeout',
	'$scope'
];

function SandboxController(NewsService, CompanyService, $mdDialog, $route, $rootScope, $filter, socket, $q, $timeout, $scope) {
	var vm = this;

	vm.posts = [];
	
	NewsService.getNews('company').then(function(data){
		vm.posts = data;
	});

	NewsService.getMe().then(function(data) {
		vm.whyCouldntYouMadeThisVariableUser = data;
	});

	vm.restoreData = function(type) {
		var postIndex;
		if (type === 'news') {
			postIndex = vm.posts.map(function(x) {return x._id; }).indexOf($scope.newsCtrl.editing._id);
			vm.posts[postIndex] = $scope.newsCtrl.editing;
		}
		else if (type === 'comment') {
			postIndex = vm.posts.map(function(x) {return x._id; }).indexOf($scope.newsCtrl.editing.news_id);
			var commentIndex = vm.posts[postIndex].comments.map(function(x) {return x._id; }).indexOf($scope.newsCtrl.editing._id);
			vm.posts[postIndex].comments[commentIndex].body = $scope.newsCtrl.editing.body;
		}
		$scope.newsCtrl.editing = {};
	};


	// Socket logic
	socket.on("push post", function(post) {
		if (post.type === "company") {
			vm.posts.unshift(post);
		}
	});

	socket.on("change post", function(newPost) {
		var postIndex = vm.posts.map(function(x) {return x._id; }).indexOf(newPost._id);
		if (postIndex !== -1) {
			vm.posts[postIndex] = newPost;
		}
	});

	socket.on("change comment", function(data) {
		var postIndex = vm.posts.map(function(x) {return x._id; }).indexOf(data.newsId);
		if (postIndex !== -1) {
			var commentIndex = vm.posts[postIndex].comments.map(function(x) {return x._id; }).indexOf(data.comment._id);
			vm.posts[postIndex].comments[commentIndex].body = data.comment.body;
		}
	});

	socket.on("splice post", function(postId, type) {
		var index = vm.posts.map(function(x) {return x._id; }).indexOf(postId);
		if (index !== -1) {
			vm.posts.splice(index, 1);
		}
	});

	socket.on("change like post", function(newPost) {
		var post = _.find(vm.posts, {_id: newPost.post});
		if(post) {
			if(newPost.isLike) post.likes.push(newPost.user);
			else {
				var index = post.likes.indexOf(newPost.user);
				if(index !== -1) post.likes.splice(index, 1);
			}
		}
	});

	socket.on("change like comment", function(data) {
		var news = _.find(vm.posts, {_id: data.newsId});
		if (news) {
			var comment = _.find(news.comments, {_id: data.commentId});
			if (data.like === "added") {
				comment.likes.push(vm.whyCouldntYouMadeThisVariableUser.id);
			}
			else if (data.like === "removed") {
				_.remove(comment.likes, function(from) {
					return from == vm.whyCouldntYouMadeThisVariableUser.id;
				});
			}
		}
	});
	
	socket.on("push comment", function(data) {
		var post = _.find(vm.posts, {_id: data.postId});
		if (post) {
			post.comments.push(data.comment);
		}
	});

	socket.on("splice comment", function(commentDetails) {
		var post = _.find(vm.posts, {_id: commentDetails.post});
		if (post) {
			var index = post.comments.map(function(x) {return x._id; }).indexOf(commentDetails.comment);
			post.comments.splice(index, 1);
		}
	});
	

	$scope.$on("$destroy", function() {
		socket.removeAllListeners("push post");
		socket.removeAllListeners("change post");
		socket.removeAllListeners("change comment");
		socket.removeAllListeners("splice post");
		socket.removeAllListeners("change like post");
		socket.removeAllListeners("change like comment");
		socket.removeAllListeners("push comment");
		socket.removeAllListeners("splice comment");
	});
}