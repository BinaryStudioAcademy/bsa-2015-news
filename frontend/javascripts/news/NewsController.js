var app = require('../app');
var _ = require('lodash');

app.controller('NewsController', NewsController);
app.filter('unsafe', function($sce) { 
	return $sce.trustAsHtml; 
});
app.filter('reverse', function() {
	return function(items) {
		return items.slice().reverse();
	};
});

NewsController.$inject = [
	'NewsService',
	'AdministrationService',
	'ExpenseService',
	'$mdDialog',
	'$location',
	'$route',
	'$rootScope',
	'$filter',
	'socket'
];

function NewsController(NewsService, AdministrationService, ExpenseService, $mdDialog, $location, $route, $rootScope, $filter, socket) {
	var vm = this;
	vm.formView = true;

	NewsService.getMe().then(function(data) {
		vm.WhyCouldntYouMadeThisVariableUser = data;

		ExpenseService.getAccUser().then(function(user) {
			user.categories.forEach(function(cat) {
				if (cat.level > 1) {
					vm.showExpenseWidget = true;
					return;
				}
			});
			vm.showExpenseWidget = vm.WhyCouldntYouMadeThisVariableUser.role === 'ADMIN' || user.admin || vm.showExpenseWidget;
		});

		if (vm.WhyCouldntYouMadeThisVariableUser.role == 'ADMIN') {
			$rootScope.myRole = 'Admin';
			setTabs();
		}
		else {
			AdministrationService.getLocalRoles().then(function(data) {
				var local = _.find(data, {global_role: vm.WhyCouldntYouMadeThisVariableUser.role});
				$rootScope.myRole = local ? local.local_role : 'User';
				setTabs();
			}, function() {
				$rootScope.myRole = 'User';
				setTabs();
			});
		}
		
	});

	function setTabs() {
		if ($rootScope.myRole == 'Admin') {
			vm.tabs = [{
				url: "/company",
				name: "Company news"
			},{
				url: "/sandbox",
				name: "Sandbox"
			},{
				url: "/weeklies",
				name: "Weeklies"
			},{
				url: "/administration",
				name: "Administration"
			}];
		}
		else {
			vm.tabs = [{
				url: "/company",
				name: "Company news"
			},{
				url: "/sandbox",
				name: "Sandbox"
			},{
				url: "/weeklies",
				name: "Weeklies"
			}];
		}
		/*var path = $location.path();
		switch(path) {
			case "/company": vm.selectedIndex = 0; break;
			case "/sandbox": vm.selectedIndex = 1; break;
			case "/weeklies": vm.selectedIndex = 2; break;
			case "/administration": vm.selectedIndex = 3; break;
		}*/
	}

	vm.checkRights = function(id) {
		var res = $rootScope.myRole === 'Admin' || $rootScope.myRole === 'Manager';
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

	vm.tinymceCommentOptions = {
		inline: false,
		plugins: [
				"advlist autolink lists link image charmap print preview anchor",
				"searchreplace visualblocks code fullscreen",
				'print textcolor',
				"insertdatetime media table contextmenu paste"
		],
		height: 100,
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

	vm.setEditing = function(data, id) {
		vm.editing = JSON.parse(JSON.stringify(data));
		if (id) {
			vm.editing.news_id = id;
		}
	};

	vm.resetEditing = function() {
		vm.editing = {};
	};

	vm.resetEditing();

	vm.switchTab = function(url) {
		$location.url(url);
	};

	$rootScope.$watch('$location.url()', function(current, old) {

		switch($location.url(current)) {
			case "/company": vm.selectedIndex = 0; break;
			case "/sandbox": vm.selectedIndex = 1; break;
			case "/weeklies": vm.selectedIndex = 2; break;
			case "/administration": vm.selectedIndex = 3; break;
		}
	});

	vm.posts = [];
	getNews();
	function getNews() {
		NewsService.getNews().then(function(data){
			//vm.posts = data.slice(0,10);
			vm.posts = data;
			vm.sandboxPosts = $filter('filter')(vm.posts, {type: 'sandbox'});
			vm.companyPosts = $filter('filter')(vm.posts, {type: 'company'});
			vm.weekliesPosts = $filter('filter')(vm.posts, {type: 'weeklies'});
			checkUrlPath();
		});
	}

	vm.fullUsers = [];
	getFullUsers();
	function getFullUsers() {
		NewsService.getFullUsers().then(function(data) {
			data.forEach(function(user) {
				user._lowername = user.name.toLowerCase() + ' ' + user.surname.toLowerCase();
			});
			vm.fullUsers = data;
			/*vm.users = loadUsers();*/
		});
	}

	vm.roles =[];
	getRoles();
	function getRoles() {
		NewsService.getRoles().then(function(data) {
			vm.roles = data;
			/*vm.categories = loadCategory();*/
		});
	}
	/*function loadCategory() {
		return vm.roles.map(function (category) {
			category._lowername = category.role.toLowerCase();
			return category;
		});
	}*/

	/*function loadUsers() {
		return vm.fullUsers.map(function (user) {
			user._lowername = user.name.toLowerCase();
			return user;
		});
	}*/

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


	vm.editpost = function(news) {
		NewsService.editNews(news._id, news).then(function(data) {
			if (!data.nModified) {
				news = JSON.parse(JSON.stringify(vm.editing));
			}
			else {
				socket.emit("edit post", news);
			}
			vm.resetEditing();
		});
	};

	vm.user = [];

	function resetNews() {
		vm.news = {restrict_ids: [], access_roles: []};
	}
	resetNews();

	vm.createNews = function(type) {
		vm.news.author = vm.WhyCouldntYouMadeThisVariableUser.id;
		vm.news.date = Date.now();
		vm.news.type = type;

		NewsService.createNews(vm.news).then(function(post) {
			resetNews();
			vm.formView = true;
			socket.emit("new post", post);
		});
	};

	vm.userIdConvert = function(userElement) {
		if(typeof userElement === "string"){
			vm.user = $filter('filter')(vm.fullUsers, {serverUserId: userElement});
			return vm.user.length ? vm.user[0].name + ' ' + vm.user[0].surname : '';
		}else{
			vm.user = $filter('filter')(vm.fullUsers, {serverUserId: userElement.serverUserId});
			return vm.user.length ? vm.user[0].name + ' ' + vm.user[0].surname : '';
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

	vm.toggleForm = function() {
		vm.formView = !vm.formView;
		/*vm.news.title = undefined;
		vm.news.body = undefined;*/
		resetNews();
	};

	vm.resetEditingForms = function() {
		vm.formView = true;
		/*vm.news.title = undefined;
		vm.news.body = undefined;*/
		resetNews();
		vm.resetEditing();
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
		vm.weekliesPosts = $filter('filter')(vm.posts, {type: 'weeklies'});
	}

	// Socket logic
	socket.on("push post", function(post) {
		if(post) vm.posts.unshift(post);
		updatePosts();
	});

	socket.on("change post", function(newPost) {
		//var post = _.find(vm.posts, {_id: newPost._id});
		var postIndex = vm.posts.map(function(x) {return x._id; }).indexOf(newPost._id);
		//post = newPost || post;
		vm.posts[postIndex] = newPost;
		updatePosts();
	});

	socket.on("change comment", function(data) {
		var postIndex = vm.posts.map(function(x) {return x._id; }).indexOf(data.newsId);
		var commentIndex = vm.posts[postIndex].comments.map(function(x) {return x._id; }).indexOf(comment._id);
		vm.posts[postIndex].comments[commentIndex].body = comment.body;
		updatePosts();
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
			//var postId = path.substring(4, path.length);
			var postId = path[path.length - 2];
			var post = $filter('filter')(vm.posts, {_id: postId});
			switch(path[1]) {
				case "company": vm.selectedIndex = 0; break;
				case "sandbox": vm.selectedIndex = 1; break;
				case "weeklies": vm.selectedIndex = 2; break;
				case "administration": vm.selectedIndex = 3; break;
			}
			if(post[0]) showModalPost(post[0]._id, false);
			else {
				correctPath();
				$location.path(path[1]);
			}
		}
	}

	function showModalPost(postId, isSetPath) {
		currentPostId = postId;

		var path;

		switch(vm.selectedIndex) {
			case 0: path = "company"; break;
			case 1: path = "sandbox"; break;
			case 2: path = "weeklies"; break;
			case 3: path = "administration"; break;
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
				case 2: path = "weeklies"; break;
				case 3: path = "administration"; break;
			}
			correctPath();
			$location.path(path);
		};
	}

	vm.newsFilter = '';

	vm.newsSearch = function(item) {
		if ( (item.title.toLowerCase().indexOf(vm.newsFilter.toLowerCase()) > -1) || (item.body.toLowerCase().indexOf(vm.newsFilter.toLowerCase()) > -1) ){
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

	vm.restoreData = function(type) {
		var postIndex;
		if (type === 'news') {
			postIndex = vm.posts.map(function(x) {return x._id; }).indexOf(vm.editing._id);
			vm.posts[postIndex] = vm.editing;
			updatePosts();
		}
		else if (type === 'comment') {
			postIndex = vm.posts.map(function(x) {return x._id; }).indexOf(vm.editing.news_id);
			var commentIndex = vm.posts[postIndex].comments.map(function(x) {return x._id; }).indexOf(vm.editing._id);
			vm.posts[postIndex].comments[commentIndex].body = vm.editing.body;
			updatePosts();
		}

		vm.resetEditing();
	};

	vm.editComment = function(newsId, comment) {
		NewsService.editComment(newsId, comment._id, comment.body).then(function(data) {
			if (!data.nModified) {
				comment = JSON.parse(JSON.stringify(vm.editing));
			}
			else {
				socket.emit("edit comment", { newsId: newsId, comment: comment });
			}
			vm.resetEditing();
		});
	};









	//chips

	vm.hiddenFromList = [];
	vm.onlyForList = [];
	vm.transformUserChip = function(chip) {
		return chip.serverUserId || null;
	};

	vm.transformRoleChip = function(chip) {
		return chip.role || null;
	};

	/*vm.selectedItem = null;
	vm.searchText = null;*/

	vm.userSearch = function(query) {
		var results = query ? vm.fullUsers.filter(userFilter(query)) : [];
		return results;
	};

	vm.roleSearch = function(query) {
		var results = query ? vm.roles.filter(roleFilter(query)) : [];
		return results;
	};

	function userFilter(query) {
		var lowercaseQuery = angular.lowercase(query);
		return function(user) {
			return user._lowername.indexOf(lowercaseQuery) > -1;
		};
	}

	function roleFilter(query) {
		var lowercaseQuery = angular.lowercase(query);
		return function(role) {
			return role.role.toLowerCase().indexOf(lowercaseQuery) > -1;
		};
	}

	vm.getUserName = function(id) {
		var user = _.find(vm.fullUsers, {serverUserId: id});
		return user ? user.name + ' ' + user.surname : '';
	};

	/*vm.getRoleName = function(id) {
		var role = _.find(vm.roles, {_id: id});
		return role ? role.role : '';
	};*/
}