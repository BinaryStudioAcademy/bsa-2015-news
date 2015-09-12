var app = require('../app');

app.controller('NewsController', NewsController);
app.filter('unsafe', function($sce) { 
	return $sce.trustAsHtml; 
});

NewsController.$inject = [
	'NewsService',
	'$mdDialog',
	'$location',
	'$route',
	'$rootScope',
	'$filter',
	'socket'
];

function NewsController(NewsService, $mdDialog, $location, $route, $rootScope, $filter, socket) {
	var vm = this;
	vm.text = 'News';
	vm.formView = true;
	vm.user ='55ddbde6d636c0e46a23fc90';
	vm.author = 'Ressie Huel';
	vm.foreAll = "All";

	vm.tinymceOptions = {
		inline: false,
		plugins: [
				"advlist autolink lists link image charmap print preview anchor",
				"searchreplace visualblocks code fullscreen",
				'print textcolor',
				"insertdatetime media table contextmenu paste"
		],
		toolbar: "insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image | forecolor | backcolor",
		skin: 'lightgray',
		theme : 'modern'
	};

	vm.tinymceOptionsComment = {
		menubar: false, 
		statusbar: false
	};

	vm.edit = [];
	vm.submitBtn = function(index) {
		vm.edit[index] = !vm.edit[index];
	};

vm.switchTab = function(url) {
	$location.url(url);
};

	$rootScope.$watch('$location.url()', function(current, old) {
		switch($location.url(current)) {
			case "/company": vm.selectedIndex = 0; break;
			case "/sandbox": vm.selectedIndex = 1; break;
			case "/weekly": vm.selectedIndex = 2; break;
		}
	});

	vm.posts = [];
	getNews();
	function getNews(){
		NewsService.getNews().then(function(data){
			vm.posts = data.slice(0,20);
			vm.sandboxPosts = $filter('filter')(vm.posts, {type: 'sandbox'});
			vm.companyPosts = $filter('filter')(vm.posts, {type: 'company'});
			vm.weeklyPosts = $filter('filter')(vm.posts, {type: 'weekly'});
			checkUrlPath();
		});
	}

	vm.fullUsers = [];
	getFullUsers();
	function getFullUsers(){
		NewsService.getFullUsers().then(function(data) {
			vm.fullUsers = data;
			vm.users = loadUsers();
			vm.categories = loadCategory();
			console.log(vm.fullUsers);
		});
	}

	function loadCategory() {
		var allCategories =[
			{'name': 'HR'},
			{'name': 'DEVELOPER'}
		];
		return allCategories.map(function (category) {
			category._lowername = category.name.toLowerCase();
			return category;
		});
	}

	//angular chips
	vm.readonly = false;
	vm.selectedCategory = null;
	vm.selectedUser = null;
	vm.searchText = null;
	vm.searchCategory = null;

	//from jade
	vm.selectedNames = [];
	vm.selectedCategories = [];

	vm.userIds = [];
	vm.allowedCategory = [];

	/**
	 * Search for vegetables.
	 **/

	vm.queryUsers = function (query) {
		var results = query ? vm.users.filter(createFilterFor(query)) : [];
		return results;
	};

	vm.queryCategory = function (query) {
		var results = query ? vm.categories.filter(createFilterFor(query)) : [];
		return results;
	};

	/**
	 * Create filter function for a query string
	 */
	function createFilterFor(query) {
		var lowercaseQuery = angular.lowercase(query);
		return function filterFn(lowercaseFilter) {
			return (lowercaseFilter._lowername.indexOf(lowercaseQuery) === 0);
		};
	}

	function loadUsers() {
		return vm.fullUsers.map(function (user) {
			user._lowername = user.name.toLowerCase();
			return user;
		});
	}


	vm.editpost = function(newsId, newpost) {
		NewsService.editNews(newsId, newpost).then(function() {
			socket.emit("edit post", {postId: newsId, body: newpost});
		});
	};

	
	vm.createNews = function (type, weeklyNews, weeklyTitle){
		NewsService.getMe().then(function(data) {
			vm.userName = data;
			postNews(type, weeklyNews, weeklyTitle);
		});
	};

	 function postNews(type, weeklyNews, weeklyTitle) {
		vm.news = {};
		if((vm.titleNews && vm.bodyNews) || type === 'company'){
			vm.selectedNames.forEach(function(objNames){
				vm.userIds.push(objNames._id);
			});

			vm.selectedCategories.forEach(function(categoriesObj){
				vm.allowedCategory.push(categoriesObj.name);
			});
			console.log('name9999999', vm.userName);
			vm.news = {
				author: vm.userName.id,
				title: weeklyTitle || vm.titleNews,
				body: weeklyNews || vm.bodyNews,
				date: Date.parse(new Date()),
				comments: [],
				likes: [],
				type: type,
				access_roles: vm.allowedCategory,
				restrict_ids: vm.userIds
			};

		vm.selectedNames = [];
		vm.selectedCategories = [];
		vm.userIds = [];
		vm.allowedCategory = [];
		vm.titleNews = '';
		vm.bodyNews = '';
		vm.formView = true;
		}
		NewsService.createNews(vm.news).then(function(post) {
			socket.emit("new post", post);
		});
	}

/*	vm.toggleText = [];
	vm.textLength = [];

	vm.loadMore = function(index) {
		vm.toggleText[index] = !vm.toggleText[index];
		if(vm.toggleText[index]){
			vm.textLength[index] = vm.posts[index].body.length;
		}else{
			vm.textLength[index] = 200;
		}
	};*/
	vm.toggleForm = function() {
		vm.formView = !vm.formView;
	};

	vm.commentForm = [];
	vm.toggleCommentForm = function(index) {
		vm.commentForm[index] = !vm.commentForm[index];
	};

	vm.commentsViev = [];
	vm.toggleComments = function(index) {
		vm.commentsViev[index] =!vm.commentsViev[index];
	};

	vm.newComment = function(commentText, newsId, index) {
		var comment = {
			author: vm.user,
			body: commentText,
			date: Date.parse(new Date()),
			likes: []
			};
		NewsService.addComment(newsId, comment).then(function(){
			comment.postId = newsId;
			socket.emit("new comment", comment);
		});
		vm.commentForm[index] = false;
	};

	vm.deleteNews = function(newsId) {
		var confirm = $mdDialog.confirm()
			.title("Are you sure want to delete this post?")
			.content("")
			.ariaLabel('Confirmation')
			.ok('Yes')
			.cancel('Cancel');
		$mdDialog.show(confirm).then(function() {
			NewsService.deleteNews(newsId).then(function() {
				socket.emit("delete post", newsId);
			});
		}, function() {});
	};

	vm.deleteComment = function(newsId, commentId) {
		NewsService.deleteComment(newsId, commentId).then(function() {
			socket.emit("delete comment", {post: newsId, comment: commentId});
		});
	};

	vm.newsLike = function(newsId, userId, index) {
		if(vm.posts[index].likes.indexOf(userId) < 0) {
			NewsService.newsLike(newsId, userId).then(function() {
				socket.emit("like post", {post: newsId, user: userId, isLike: true});
			});
		} else {
			NewsService.deleteNewsLike(newsId, userId).then(function() {
				socket.emit("like post", {post: newsId, user: userId, isLike: false});
			});
		}
	};

	vm.commentLike = function(newsId, commentId, userId) {
		var	post = $filter('filter')(vm.posts, {_id: newsId});
		var comment = $filter('filter')(post[0].comments, {_id: commentId});

		//NewsService.comentLike(newsId, commentId, userId);
		if(comment[0].likes.indexOf(userId) < 0){
			console.log('not exist');
			comment[0].likes.push(userId);
		}else{
			console.log('exist');
			comment[0].likes.splice(comment[0].likes.indexOf(vm.user), 1);
		}
		
		NewsService.deleteComment(newsId, commentId);
		NewsService.addComment(newsId, comment[0]);
		console.log(comment[0]);

	};

	function updatePosts() {
		vm.sandboxPosts = $filter('filter')(vm.posts, {type: 'sandbox'});
		vm.companyPosts = $filter('filter')(vm.posts, {type: 'company'});
		vm.weeklyPosts = $filter('filter')(vm.posts, {type: 'weekly'});
	}

	// Socket logic
	socket.on("push post", function(post) {
		if(post) vm.posts.unshift(post);
		updatePosts();
	});

	socket.on("change post", function(newPost) {
		if(newPost) {
			var post = $filter('filter')(vm.posts, {_id: newPost.postId});
			if(post[0]) {
				post[0].body = newPost.body;
			}
		}
	});

	socket.on("splice post", function(postId) {
		var index = vm.posts.map(function(x) {return x._id; }).indexOf(postId);
		vm.posts.splice(index, 1);
		updatePosts();
	});

	socket.on("change like post", function(newPost) {
		if(newPost) {
			var post = $filter('filter')(vm.posts, {_id: newPost.post});
			if(post[0]) {
				if(newPost.isLike) post[0].likes.push(newPost.user);
				else {
					var index = post[0].likes.indexOf(newPost.user);
					if(index != -1) post[0].likes.splice(index, 1);
				}
			}
		}
	});
	
	socket.on("push comment", function(comment) {
		var post = $filter('filter')(vm.posts, {_id: comment.postId});
		if(post[0]) {
			delete post[0].postId;
			post[0].comments.push(comment);
		}
	});

	socket.on("splice comment", function(commentDetails) {
		var post = $filter('filter')(vm.posts, {_id: commentDetails.post});
		if(post[0]) {
			var index = post[0].comments.map(function(x) {return x._id; }).indexOf(commentDetails.comment);
			post[0].comments.splice(index, 1);
		}
	});

	// Modal post
	vm.showModalPost = showModalPost;
	var currentPostId = "";

	function checkUrlPath() {
		var path = $location.path();

		if(path.indexOf("post") > -1) {
			path = path.split("/").join("");
			var postId = path.substring(4, path.length);
			var post = $filter('filter')(vm.posts, {_id: postId});

			if(post[0]) showModalPost(post[0]._id, false);
		}
	}

	function showModalPost(postId, isSetPath) {
		currentPostId = postId;

		if(isSetPath) {
			// Set url path in browser
			correctPath();
			$location.path("/post/" + postId);
		}

		$mdDialog.show({
			controller: DialogController,
			templateUrl: './templates/news/ModalPost.html',
			parent: angular.element(document.body),
			clickOutsideToClose: true
		}).then(function(answer) {
			vm.status = 'You said the information was "' + answer + '".';
		}, function() {
			// Reset path in browser
			correctPath();
			$location.path("/");
		});
	}

	function correctPath() {
		var original = $location.path;
		$location.path = function(path) {
			var lastRoute = $route.current;
			var un = $rootScope.$on('$locationChangeSuccess', function () {
				$route.current = lastRoute;
				un();
			});
			return original.apply($location, [path]);
		};
	}

	function DialogController($scope, $mdDialog) {
		var post = $filter('filter')(vm.posts, {_id: currentPostId});
		if(post[0]) $scope.post = post[0];
		$scope.newComment = vm.newComment;
		$scope.editpost = vm.editpost;
		$scope.deleteNews = function(newsId) {
			vm.deleteNews(newsId);
			correctPath();
			$location.path("/");
		};
		$scope.deleteComment = vm.deleteComment;
		$scope.newsLike = vm.newsLike;
		$scope.commentLike = vm.commentLike;
		$scope.hide = function() {
			$mdDialog.hide();
		};
		$scope.answer = function(answer) {
			$mdDialog.hide(answer);
		};
	}
}