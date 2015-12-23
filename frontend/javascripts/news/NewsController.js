var app = require('../app');
var _ = require('lodash');

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
	vm.foreAll = "All";

	NewsService.getMe().then(function(data) {
		vm.WhyCouldntYouMadeThisVariableUser = data;
	});

	vm.checkRights = function(id) {
		var res = vm.WhyCouldntYouMadeThisVariableUser.role === 'ADMIN' || 'CEO' || 'Tech Lead';
		if (id) {
			res = res || vm.WhyCouldntYouMadeThisVariableUser.id === id;
		}
		return res;
	};

	vm.tinymceOptions = {
		inline: false,
		plugins: [
				"advlist autolink lists link image charmap print preview anchor",
				"searchreplace visualblocks code fullscreen",
				'print textcolor',
				"insertdatetime media table contextmenu paste"
		],
		height: 300,
		content_css : ['styles/css/libs.css', 'styles/css/style.css', 'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css'],
		body_class: 'body',
		toolbar: "insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image | forecolor | backcolor",
		skin: 'lightgray',
		theme : 'modern'
	};

	vm.tinymceOptionsComment = {
		menubar: false, 
		statusbar: false
	};

	function unique(arr) {
		var obj = {};
		for (var i = 0; i < arr.length; i++) {
			var str = arr[i];
			obj[str] = true;
		}
		return Object.keys(obj);
	}

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
	function getNews() {
		NewsService.getNews().then(function(data){
			vm.posts = data.slice(0,10);
			vm.sandboxPosts = $filter('filter')(vm.posts, {type: 'sandbox'});
			vm.companyPosts = $filter('filter')(vm.posts, {type: 'company'});
			vm.weeklyPosts = $filter('filter')(vm.posts, {type: 'weekly'});
			checkUrlPath();
		});
	}

	vm.fullUsers = [];
	getFullUsers();
	function getFullUsers() {
		NewsService.getFullUsers().then(function(data) {
			vm.fullUsers = data;
			vm.users = loadUsers();
		});
	}

	vm.roles =[];
	getRoles();
	function getRoles() {
		NewsService.getRoles().then(function(data) {
			vm.roles = data;
			vm.categories = loadCategory();
		});
	}
	function loadCategory() {
		return vm.roles.map(function (category) {
			category._lowername = category.role.toLowerCase();
			return category;
		});
	}

	function loadUsers() {
		return vm.fullUsers.map(function (user) {
			user._lowername = user.name.toLowerCase();
			return user;
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

	vm.editpost = function(newsId, newpost, restrict_ids, access_roles) {
		var restrictIds = [];
		var accessRole = [];
		restrict_ids.forEach(function(data) {
			if(typeof data === "string"){
				restrictIds.push(data);
			}else{
				restrictIds.push(data.serverUserId);
			}
		});
		access_roles.forEach(function(data) {
			if(typeof data === "string"){
				accessRole.push(data);
			}else{
				accessRole.push(data._id);
			}
		});
		NewsService.update_Role_User(newsId, unique(accessRole),unique(restrictIds));
		NewsService.editNews(newsId, newpost).then(function() {
			socket.emit("edit post", {postId: newsId, body: newpost});
		});
	};

	vm.user = [];
	vm.createNews = function (type, weeklyNews, weeklyTitle){
		NewsService.getMe().then(function(data) {
			vm.userName = data;
			vm.user = $filter('filter')(vm.fullUsers, {serverUserId: vm.userName.id});
			vm.userServerId = vm.user[0].serverUserId;
			postNews(type, weeklyNews, weeklyTitle);
		});
	};

	function postNews(type, weeklyNews, weeklyTitle) {
		vm.news = {};
		if((vm.titleNews && vm.bodyNews) || type === 'company'){
			vm.selectedNames.forEach(function(objNames){
				vm.userIds.push(objNames.serverUserId);
			});

			vm.selectedCategories.forEach(function(categoriesObj){
				vm.allowedCategory.push(categoriesObj._id);
			});
			vm.news = {
				author: vm.userServerId,
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

	vm.userIdConvert = function(userElement) {
		if(typeof userElement === "string"){
			vm.user = $filter('filter')(vm.fullUsers, {serverUserId: userElement});
			return vm.user[0].name + ' ' + vm.user[0].surname;
		}else{
			vm.user = $filter('filter')(vm.fullUsers, {serverUserId: userElement.serverUserId});
			return vm.user[0].name + ' ' + vm.user[0].surname;
		}
	};

	vm.rolesIdConvert = function(roleElement) {
		if(typeof roleElement === "string"){
			vm.filteredRole = $filter('filter')(vm.roles, {_id: roleElement});
			return vm.filteredRole[0].role;
		}else{
			vm.filteredRole = $filter('filter')(vm.roles, {_id: roleElement._id});
			return vm.filteredRole[0].role;
		}
	};

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
		vm.titleNews = undefined;
		vm.bodyNews = undefined;
	};

	vm.resetEditingForms = function() {
		vm.formView = true;
		vm.titleNews = undefined;
		vm.bodyNews = undefined;
		vm.edit = [];
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
		NewsService.getMe().then(function(data) {
			vm.userName = data;
			vm.user = $filter('filter')(vm.fullUsers, {serverUserId: vm.userName.id});
			commentFun(commentText, newsId, index);
		});
	};

	function commentFun(commentText, newsId, index) {
		var comment = {
			author: vm.user[0].serverUserId,
			body: commentText,
			date: Date.parse(new Date()),
			likes: []
			};
		NewsService.addComment(newsId, comment).then(function(){
			NewsService.getComments(newsId).then(function(data) {
				var post = _.find(vm.posts, {_id: newsId});
				//post.comments = data.comments;
				var i = data.comments.length - 1;
				socket.emit("new comment", {postId: newsId, comment: data.comments[i]});
			});
		});
		vm.commentForm[index] = false;
	}

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

	vm.newsLike = function(newsId, user, index, type) {

		//var userId = user[0].serverUserId;
		var userId = vm.WhyCouldntYouMadeThisVariableUser.id;

		/*if(_.contains(_.filter(vm.posts, {type: type})[index].likes, userId)) {*/
		if(_.contains(_.find(vm.posts, {_id: newsId}).likes, userId)) {
			NewsService.deleteNewsLike(newsId, userId).then(function() {
				socket.emit("like post", {post: newsId, user: userId, isLike: false});
			});
		} else {
			NewsService.newsLike(newsId, userId).then(function() {
				socket.emit("like post", {post: newsId, user: userId, isLike: true});
			});
		}
	};

	vm.commentLike = function(newsId, commentId) {
		NewsService.toggleCommentLike(newsId, commentId).then(function(data) {
			socket.emit("like comment", {newsId: newsId, commentId: commentId, like: data.like});
		});
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

	socket.on("change like comment", function(data) {
		var news = _.find(vm.posts, function(post) {
			return post._id == data.newsId;
		});
		var comment = _.find(news.comments, function(comment) {
			return comment._id == data.commentId;
		});
		if (data.like === "added") {
			comment.likes.push(vm.WhyCouldntYouMadeThisVariableUser.id);
		}
		else if (data.like === "removed") {
			_.remove(comment.likes, function (from) {
				return from == vm.WhyCouldntYouMadeThisVariableUser.id;
			});
		}
	});
	
	socket.on("push comment", function(data) {
		var post = $filter('filter')(vm.posts, {_id: data.postId});
		if(post[0]) {
			post[0].comments.push(data.comment);
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
			//path = path.split("/").join("");
			path = path.split("/");
			console.log(path);
			//var postId = path.substring(4, path.length);
			var postId = path[path.length - 2];
			var post = $filter('filter')(vm.posts, {_id: postId});
			switch(path[1]) {
				case "company": vm.selectedIndex = 0; break;
				case "sandbox": vm.selectedIndex = 1; break;
				case "weekly": vm.selectedIndex = 2; break;
			}
			if(post[0]) showModalPost(post[0]._id, false);
		}
	}

	function showModalPost(postId, isSetPath) {
		currentPostId = postId;

		var path;

		switch(vm.selectedIndex) {
			case 0: path = "company"; break;
			case 1: path = "sandbox"; break;
			case 2: path = "weekly"; break;
		}

		if(isSetPath) {
			// Set url path in browser
			correctPath();
			//$location.path("/post/" + postId);
			$location.path(path + "/post/" + postId);
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
			$location.path(path);
			//$location.path("/");
		});
	}

	function correctPath() {
		var original = $location.path;
		$location.path = function(path) {
			var lastRoute = $route.current;
			var un = $rootScope.$on('$locationChangeSuccess', function () {
				$route.current = lastRoute;
				//un();
			});
			un();
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
		$scope.userIdConvert = vm.userIdConvert;
		$scope.newsLike = vm.newsLike;
		$scope.commentLike = vm.commentLike;
		$scope.findLike = vm.findLike;
		$scope.commentLike = vm.commentLike;
		$scope.hide = function() {
			$mdDialog.hide();
		};
		$scope.answer = function(answer) {
			$mdDialog.hide(answer);
		};
		$scope.close = function() {
			$mdDialog.hide();
			var path;
			switch(vm.selectedIndex) {
				case 0: path = "company"; break;
				case 1: path = "sandbox"; break;
				case 2: path = "weekly"; break;
			}
			correctPath();
			$location.path(path);
		};
	}

	vm.newsFilter = '';

	vm.newsSearch = function(item) {
		if ( (item.title.indexOf(vm.newsFilter) > -1) || (item.body.indexOf(vm.newsFilter) > -1) ){
			return true;
		}
		return false;
	};

	vm.getUserById = function(id) {
		return $filter('filter')(vm.fullUsers, {serverUserId: id})[0];
	};

	vm.findLike = function(likes) {
		return _.find(likes, function(like) {
			return like == vm.WhyCouldntYouMadeThisVariableUser.id;
		});
	};
}