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
	'$scope',
	'$location'
];

function SandboxController(NewsService, CompanyService, $mdDialog, $route, $rootScope, $filter, socket, $q, $timeout, $scope, $location) {
	var vm = this;

	$scope.newsCtrl.loadMore = function() {
		NewsService.getNews('sandbox', vm.posts.length, 5, $scope.newsCtrl.newsFilter).then(function(data) {
			Array.prototype.push.apply(vm.posts, data);
			vm.noData = (vm.posts.length === 0);
		}, function() {});
	};


	$scope.newsCtrl.selectedIndex = 1;

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
					vm.noData = true;
				});
			}
		}
	}

	$scope.$on('$routeUpdate', function() {
		checkModal();
	});

	NewsService.getNews('sandbox', 0, 10, $scope.newsCtrl.newsFilter).then(function(data) {
		vm.posts = data;
		checkModal();
		vm.noData = (vm.posts.length === 0);
	}, function() {
		vm.posts = [];
		checkModal();
	});

	vm.filterNews = function() {
		var maxDate = $scope.newsCtrl.getFilterDate();
		NewsService.getNews('sandbox', 0, 10, $scope.newsCtrl.newsFilter, 0, maxDate).then(function(data) {
			vm.posts = data;
			vm.noData = (vm.posts.length === 0);
		}, function() {
			vm.posts = [];
			vm.noData = true;
		});
	};

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




	NewsService.getMe().then(function(data) {
		vm.whyCouldntYouMadeThisVariableUser = data;
	});

	vm.restoreData = function(type) {
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
	};

	vm.newsSearch = function(item) {
		if ( (item.body.toLowerCase().indexOf($scope.newsCtrl.newsFilter.toLowerCase()) > -1) ){
			return true;
		}
		return false;
	};


	// Socket logic
	socket.on("push post", function(post) {
		if (post.type === "sandbox") {
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