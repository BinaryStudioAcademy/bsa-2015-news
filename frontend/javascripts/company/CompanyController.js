var app = require('../app');
var _ = require('lodash');

app.controller('CompanyController', CompanyController);


CompanyController.$inject = [
	'NewsService',
	'CompanyService',
	'NotificationService',
	'$mdDialog',
	'$route',
	'$rootScope',
	'$filter',
	'socket',
	'$q',
	'$timeout',
	'$scope',
	'$location'
];

function CompanyController(NewsService, CompanyService, NotificationService, $mdDialog, $route, $rootScope, $filter, socket, $q, $timeout, $scope, $location) {
	var vm = this;

	$scope.newsCtrl.loadMore = function() {
		NewsService.getNews('company', vm.posts.length, 3).then(function(data) {
			Array.prototype.push.apply(vm.posts, data);
		}, function() {});
	};

	$scope.newsCtrl.selectedIndex = 0;

	vm.posts = [];

	function checkModal() {
		var params = $location.search();
		if (params.post) {
			var id = params.post;
			var modalPost = _.find(vm.posts, {_id: id});
			if (modalPost) {
				vm.showModal(id);
			} else {
				NewsService.getPost(id).then(function(post) {
					vm.posts.unshift(post);
					vm.oddPost = id;
					vm.showModal(id);
				}, function() {
					vm.hideModal();
				});
			}
		}
	}

	$scope.$on('$routeUpdate', function() {
		checkModal();
	});

	NewsService.getNews('company', 0, 5).then(function(data) {
		vm.posts = data;
		checkModal();
	}, function() {
		vm.posts = [];
		checkModal();
	});

	vm.showModal = function(id, event) {
		postIndex = vm.posts.map(function(x) {return x._id; }).indexOf(id);
		vm.posts[postIndex].showInModal = true;
		if (event) {
			$location.search('post', id );
			event.stopPropagation();
		}
	};

	vm.hideModal = function(id) {
		if (!id) {
			vm.posts.forEach(function(post) {
				post.showInModal = false;
				vm.restoreData("news");
				vm.restoreData("comment");
				$location.search('post', null );
			});
		} else {
			postIndex = vm.posts.map(function(x) {return x._id; }).indexOf(id);
			if (vm.posts[postIndex].showInModal === true) {
				vm.posts[postIndex].showInModal = false;
				vm.restoreData("news");
				vm.restoreData("comment");
				if (vm.oddPost) {
					var index = vm.posts.map(function(x) {return x._id; }).indexOf(vm.oddPost);
					if (index !== -1) {
						vm.posts.splice(index, 1);
					}
				}
				$location.search('post', null );
			}
		}
	};

	
	vm.filterNews = function(filter) {
		NewsService.getNews('company', 0, 5, filter).then(function(data) {
			vm.posts = data;
		}, function() {
			vm.posts = [];
		});
	};

	NewsService.getMe().then(function(data) {
		vm.whyCouldntYouMadeThisVariableUser = data;
	});

	vm.restoreData = function(type) {
		if ($scope.newsCtrl.editing._id) {
			var postIndex;
			if (type === 'news') {
				postIndex = vm.posts.map(function(x) {return x._id; }).indexOf($scope.newsCtrl.editing._id);
				if (postIndex !== -1) {
					vm.posts[postIndex] = $scope.newsCtrl.editing;
				}
			}
			else if (type === 'comment') {
				postIndex = vm.posts.map(function(x) {return x._id; }).indexOf($scope.newsCtrl.editing.news_id);
				if (postIndex !== -1) {
					var commentIndex = vm.posts[postIndex].comments.map(function(x) {return x._id; }).indexOf($scope.newsCtrl.editing._id);
					vm.posts[postIndex].comments[commentIndex].body = $scope.newsCtrl.editing.body;
				}
			}
			$scope.newsCtrl.editing = {};
		}
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
			vm.posts[postIndex].comments[commentIndex] = data.comment;
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
			if(newPost.isLike) {
				post.likes.push(newPost.user);
				NotificationService.newPostLike(post, _.find($scope.newsCtrl.fullUsers, {serverUserId: newPost.user}));
			}
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
				NotificationService.newCommentLike(news, _.find($scope.newsCtrl.fullUsers, {serverUserId: data.userId}), comment);
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
			NotificationService.newComment(post, _.find($scope.newsCtrl.fullUsers, {serverUserId: data.comment.author}));
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