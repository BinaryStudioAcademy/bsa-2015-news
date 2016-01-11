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
app.directive('backImg', function(){
	return function(scope, element, attrs){
		var url = attrs.backImg;
		element.css({
			'background-image': 'url(' + url +')',
			'background-size' : 'cover',
			'background-position': 'center center'
		});
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
	'socket',
	'$q'
];

function NewsController(NewsService, AdministrationService, ExpenseService, $mdDialog, $location, $route, $rootScope, $filter, socket, $q) {
	var vm = this;
	vm.formView = true;

	NewsService.getMe().then(function(data) {
		vm.whyCouldntYouMadeThisVariableUser = data;

		ExpenseService.getAccUser().then(function(user) {
			user.categories.forEach(function(cat) {
				if (cat.level > 1) {
					vm.showExpenseWidget = true;
					return;
				}
			});
			vm.showExpenseWidget = vm.whyCouldntYouMadeThisVariableUser.role === 'ADMIN' || user.admin || vm.showExpenseWidget;
		});

		if (vm.whyCouldntYouMadeThisVariableUser.role == 'ADMIN') {
			$rootScope.myRole = 'Admin';
			setTabs();
		}
		else {
			AdministrationService.getLocalRoles().then(function(data) {
				var local = _.find(data, {global_role: vm.whyCouldntYouMadeThisVariableUser.role});
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
			res = res || vm.whyCouldntYouMadeThisVariableUser.id === id;
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
		menu: {},
		theme : 'modern'
	};

	vm.tinymceCommentOptions = {
		inline: false,
		plugins: [
			'link image media'
		],
		menubar: false,
		toolbar: 'link image media',
		height: 100,
		content_css : ['styles/css/libs.css', 'styles/css/style.css', 'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css'],
		body_class: 'body',
		elementpath: false
	};

	vm.tinymceInlineOptions = {
		//selector: 'h2.editable',
		inline: true,
		toolbar: 'undo redo',
		menubar: false
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
			updatePosts();
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
		vm.news.author = vm.whyCouldntYouMadeThisVariableUser.id;
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

	vm.getUser = function(id) {
		var user = _.find(vm.fullUsers, {serverUserId: id}) || {};
		user.avatar = {};
		/*if (Math.random() > 0.5) {
			user.avatar.urlAva = 'http://www.krowmark.com/wp/wp-content/uploads/2015/05/Darth-Vader-darth-vader-18734783-300-355.jpg';
		}
		else {
			user.avatar.urlAva = 'http://cs302205.vk.me/u7126369/-6/z_c6578f9c.jpg';
		}*/
		user.avatar.urlAva = 'http://cs302205.vk.me/u7126369/-6/z_c6578f9c.jpg';
		return user;
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

	vm.newComment = function(commentText, newsId, index, form) {
		NewsService.getMe().then(function(data) {
			vm.userName = data;
			vm.user = $filter('filter')(vm.fullUsers, {serverUserId: vm.userName.id});
			commentFun(commentText, newsId, index, form);
		});
	};

	function commentFun(commentText, newsId, index, form) {
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
		form.$setPristine();
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
		var userId = vm.whyCouldntYouMadeThisVariableUser.id;

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
			comment.likes.push(vm.whyCouldntYouMadeThisVariableUser.id);
		}
		else if (data.like === "removed") {
			_.remove(comment.likes, function (from) {
				return from == vm.whyCouldntYouMadeThisVariableUser.id;
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
			return like == vm.whyCouldntYouMadeThisVariableUser.id;
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




	//menu

	//PRODUCTION
	/*NewsService.getServices().then(function(data) {
		vm.services = data;
	});*/
	//DEVELOPMENT																								*********************************
	vm.services = [{"_id":"567a81f67498f49f41e7d540","link":"http://team.binary-studio.com","name":"News","logo":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAACL0lEQVRoQ+1ZO0tDMRT+ThcfiApaC0JrLaKCj6kdVNAW2qGDbtZOWhdXBVfBuiv4E3Sr/gXxNYiDOIguCoLYyQeCIr4GI9ciaNu0Mfc2LeFmPic53/nOl5wkBE0GaYIDNpBKY9JmhB1vJ8DYVBmYOSF/eC57XWlG2NFWEkSLyoEwtk+BSNAGkp0BmxGztaistB7vgbNDs+Fm/D2dgLvr71zKgKTPgdSKNUAGR4GhURuIUDa5YteGkUrTCBv3JkCONi49YzNBdPtzDiYhOs0Y/VfsLNa+B6IR7pr5hGgmQFFfZUDeXoDbdOGwWtxAdS1wcw28v/JtG5qAhmZzu5Y0IyJij89nzofUMpC+4AOxYvuVBmJkeXezMCOhGODyADsbhdnrGQD6hsrEiGity9op04hsgKJ+yoBooxFtgIiWiKydstKSDVDUTxkQbUpLGyCiJSJrp6y0ZAMU9VMGRJsWRRuNGG38XZE23vmrjf8o0MbXl7ONF611WTtlGhG5s/cOZC5MpwfA0wMfkhXvWtL3EW00og0jsrUv6mdrhJcp3nOQNhqpuJN9wrcKYJZbutFpwNhG1Y918ocT2cty/xBZ3BsEc+zmjdN4XJtcyH08UwGKsRAFInvCQAxDFvMlQcj98IwmgN5BFWFnv2ktUSCSzLdw0V/db2Y+yaDSC3dHHfqHXWhqrbMURaPzElU1z9w5ia7A2Fo+Jn58igKxNOASTmYDKWFypaa2GZFKWwmdvgDMZK9Cjatp8wAAAABJRU5ErkJggg==","__v":0},{"_id":"567a8381ec1453994b1757c9","name":"Interview","logo":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAADh0lEQVRoQ+2aTUwTURDH5z3bYimQopIUK7oV64VE680TH4oXo0bwIGARTKrRW3s2BojxXG5q0ihYBDQR/DqY2Ejx5E0uHLRpugaRRvwAQktsa5/Z1W0pdD9ad5cQdk/72vf+M7+Z2c523yJQ6PCOjFMolfYCQg7WBCFTRIc9nvYWWgmTSAlR78NxB0qTCUBgztEnsEAwavJcaJmS264yIP6xIELQQAhMAkZu1uk0GUAIDgNA0O1sbdoUIP1DY4StpiSq9FxqWWDOvffHzUhPfjLnbmer7AGULNjc5mpEmHQRgigumjYbZbFarZbV0cUY44ry8op8DnOAi0uLi4QAC8sds7Oz0UiEjnJjhAhN0mgwMOoLSsmeJJDmdpcbIfCuFbTb7XDQbs9jh/ERQSwej1y/4tzPTLh1dyhiMpVSwPq/3uzHUAhCodA6LULAExjx9YvBiII0tnVTeqyL5BPiBVnlK0n/DTzC/0zl5wA+EGZtMp2yBUcHBH/tREGaO1y9CKCHEazdVwNXneczTPTcPNDReZ5gcZXDmVg7zl1GWaqAqq7KfHhn6BGEP82wYwLQFxj29QplRRTkRLsrCAgaGJHOc2egs/V0Ri88Mwcv374Ty7qk70/VH4XamurMXP/YC/A/ec6BPAsM+84qBvIrkYR7T19BIpmS5CzfpHKTES6cPA4lBn1eECAw+XrE16gYCCPMwIQ/f4Gl5XhRMBVlpVC7Z3cOBCO0OiOqgBTlvYRFGghfkIQudgmBLXqKlhEtI0UXj/BCrbS2dGkxHT2Rynb1bRiDscQgS7GpWlrRbz8g+p39r8QeZcbtcGCvlT1fjq8AINFbucxag04HBr1uY25RhECmPoQLyoxlZyVYdu3QQERzL9TZhTJSUDryTFb1GvlfZ4XWayBbuo9opSUhAqpeI4N0Ch5Esp39kBmD98gm7Ox90wm4OZ3MxLe+CsObJiM7PjaxAijPgzi+ZFy06aCL2qDOLgSiexyTUEDZKTfq9NBTl82mqqUlBBL8+rsgEMqEgTJl+7OqIHSMAB1LZxw2GxA4zLggAL7JqoLI4jGPiAaidXaF6ksrLa20tNISjoDsGz1rt96udbYplINc2dv+UZm33jouOwDIe1W85zEiy2Yoo823Pa0GnGzb05yz7AsDiHQDZF8YUBaE0ISgAVlfGFDWYXnURZ9ryWNGeRUNRPkYF2bhDxaprVGueb1TAAAAAElFTkSuQmCC","link":"http://team.binary-studio.com/interview","__v":0},{"_id":"55e4a51b1263f8cb52a90d1e","__v":0,"link":"http://team.binary-studio.com/accounting","logo":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAFcUlEQVRoQ+2ZS1BTVxjH/yeUR3gmEGAcoeUh4lgEBEWq1ILMWNqpHe3QRVeWGeiim5IFlVWxXUFdBDddFDvUVRdlqlM7lTqDoKJFLG+qIPLoQMfhmfB+FU7nRG4m95Hcm9wkbLi75Jzvf77f+Z/v3HMSAjee4ivplwlIlRuhsiEU9OuGit7Lsh0FHYirAaw/AwF9BUJ2FCil1g9KBSkLphRkR4CFWx/iYxBCUWWj2Mkhcf/ryM04pmhu7nf8iX8nX/L7UgpK4GNHgCrh/MdEGlCYe1oRSFPbfUzNzfD6Ulht2X2QE+lZSIpLUAQyMDqErmd9uw/Cij0oMBBr6+vWZFITkpF1OEMRBNep82kPBseGrR85LZ8XOwNJSzkEtpz04ToE+AeIIMwLZgyOvko0NTEZ+nC9qM/G5gbMCxbrMusfGoCPQY5XE2xcYiBHUg47dOH2gyZYFuet7fqwCBS9Xeiwb9/Q0x2QgJqGiieVLlnLNjtXAypNdfkz9NGN+a1OnRzIT7//wpP/5P2PZEEi/LIsBnLyQrWxrMWV3FwCuVRbZyIg5XPbj2HeaocciP0Wuz92H05nvyULovfLQaTmBFtitTXlZUalMIpAKkzfZ2oIqScgmUxYKQjry+rEurQk6sM+SW5pcSCsjYJ2b1NacsX4WbcckCxI5dUfqkAp78jgCohcAly7FAjXRgnKa74ovepMyyFIpak+AWSrHkC+UMDXIDvjt4D6lVQbS8akgCRBvjRdO08I6gmgkwraJRD23rdQipJvjaU3hXmJQFg9+BFNlzMblYIsrSzbtl9dWARCg0MUF7uz8bfo9lFh3YhAKk3XfgTBRTUgk7NTeNzbieXVFZ5MiDYY7BgTGxUjkndWI6LOFNerjaWf2n8vAVLXAkLecRdkZGLMCuHskTqTuQZC71Uby3i1KwL56rvrrRsbm6fcAWFbbWNrs6KNqiivgLcluwISEOD/8JvPL+Y5deTOw7+mJ6ZnDM/HJhwm5KhGpI7mjkSEL0ilIAcT4hAXbZg5e+pYtFOQu+1dZn14mG5qzoL2vkEsr66KcnEEIjySyFljf2SRAwnRapFzJBUxkTqYFxYtZ3KO8k6goqXFgXBJ9A//g7+HRnk5SYG4sqw4Mfvl5QzkzZREpCW/YcvBLRAWbVlYRHv/czYTVjEpELbV3mr5Q84EXvu5/HdtW7IUiD48DDlpB6ELD+PFuQ0idMfR0mq4cwub/20qgvF/zR/FZ8/Z+gpBhC7Yi6oGYWLLq2to6r2B/qkG0enX/sYnRyO8UXIgaTHFKEy/gBBtkEMJj4Bw6u0jv2F2qxuHkhJtA7Lb3u3Wu1gRvAiFGQVrg/Fe3hnerXJgZBRRfpnISfpAbg7cK3ZnqiubZiz4dWCVTtoVohltPZ22o4kwnh1VcjOyeO8QLYlF+FY2gv3FV2Gp8T3qiP0Ai3QYc7QT23TD+jVzpn/oGcwL87affNjdPibKwLsaa0gAIkkWwkiyrAserxFHIzKIGdqGZTquKKkQEg8DyQWDcfXxmiP2iTAQBsS5I0ySJc4AGIi7j09AWHIMYhYdWNoe4eUaqklCFLLdcsFnS0tqdtfoJKa326xN0ZpcBJFYd03gxfnMEftRuSXmTi04ot4VEI9YIBDZA/HGrKrR3HNEzex5I3bPEW/MqhpNRY40tj4ZijXoD6gZyNuxkzPmF0V5x1PsxxHd2X9ubC4/kBBv8nYyavRfjI0bPy4qqHUKwhp/bX7UEr8vxumPdGoSURM7/nLq3ocFJ0U/rDv8NZ45ExgYeD40ROvaP5xqsnQSu7S82rO+vn5T6AQXIvv/iJfy8rjsHojHp1Sl4J4jKifQ4+F7jnh8SlUK/g+rkCBgL9KwWQAAAABJRU5ErkJggg==","name":"Accounting","sound":false,"toInform":true},{"_id":"55e4a5d71263f8cb52a90d1f","__v":0,"link":"http://team.binary-studio.com/reviewr","logo":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAADLklEQVRoQ+3ZTU8TQRgH8P92240IVqRHTSRGD2gCRMQWNLQm6sGg2foFxE+gRO/qXYN+AvEL2I0SD8YEShSKgAEO1IsEEwyNBlFeFLcvawbYZoFZdqbtblfsHsnTmec3zzPDtCtgjzzCHnGgAnFbJSsV+WcqIsfk2gxwC0DEJUkPeIEnSlT5QcvHtLU6Y/J9APdcgtDTeNAXVUheOx5zyHN5AALCroJoiPddV6gdwgRZ/raClYWVspikKgmBo3UbcxcLmU+mkPqYKgukJlCDEx3HKxB0GvbIf1cRr+RDS/g0pseSWF5corbigUN+nDzTgPH4B2TUtGW7Ot5aBBG6GMTBgB+qmkbi9cgODEGELgchST78XFhC4s2IJcZRiBGhL/FMchbJsektK3742BE0n2vM/40F4xiEhpj7NIfJoSlq2/BiHIHwInQZD8Z2SKEIXoytkH3VVQhf64AoihA27wa7tZPZ0WSsjKYB2WwW8ReDWFv9nf+IbRAd4fWKG7cGDfgyY74nrM5Xgmlqb8wvSCazFWMrJEKqsQkhiU68m1rHFPJs3y/kQjU+OIHU5/n14WyDkMFJVUqBsULYDtExrZEW+Ov8+ULwVGY7Iq2mMdo/jsWv37cU1taK6DORk6vtUpAbQ0MMU24CjlSkUAwPwlEImYy1MrwIxyE0DG2/GCFkT5i1k3GTOLJHth+3emXIhdHsOCaYU60NTIiyVITnfwgBs3wXcT2EB12W1uJJkDW2AtFXyvjjw59fKtRVlXURSxon+kTsr63aGLPY37VKmlkxgxUCuRqTZQ2IFTNvqT8rANGXUUWhjbvr+5ErMbnZA8isCWXUdL26mr7BEi9V+555Jd8sSyyJyQHKq6gyYRZf0hc9oZ7zEWjoZ0pOwIVE99sBpliGIG7I2YdtskcUm+hja/XQhC6GeQFB6wUEakVy2ezk+7vD1BYqSUVCj9q7IHiemieqAczvVy1itdzNxJ2hXqZF4ZgV1gjWKTniODBMrVUWhO5lxFhCyorgwOwKae1pbxY1z2OOZrAtNCvkbo92Dzlz/NqmYBjYsrUYxnBFSAXiijIYkqhUxG0V+QutqoFRIjwYpgAAAABJRU5ErkJggg==","name":"Reviewer","sound":false,"toInform":true},{"_id":"55e4a78b1263f8cb52a90d21","__v":0,"link":"http://team.binary-studio.com/profile","logo":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAACc0lEQVRoQ+2a3WoTQRiG36mNrslqV0JCrT8NNGlwUQzSlCJCInjUE3sHXoJeQr2D9T48aE/VJpsTEexBpLUWbCGFWoQG2WqppdmyMgstpd3d7GzITBJnDsP8fM+87zf7bWYJBqSRAeGABOk1JdsqUp2OzwFDL+BAo8HfTCc387nsBD8QpwGQRWIsLQStGQhSLSYMEPLy7ATp5I2anp8s8QM5Wcl5Q4zKK791fUGqU2oZQ6ieHygOhEZCnhLjg+kF4w/ioQadQCyIvyq+IJWiahKCCxYSDFIjRqXMpIgE6eop4EhFZI50x2HSWvL4veCsXWvP/U1T44gNxyI6T6C1dpq/8Hl9Ey37+DR4PXMLeuZOBBhBIFSFWv2bZ8APs3eRuz3GCCMI5P3yF+zt//UMNjZ8Cc+fFPsD5K35KTDQZ1MPoKkJBhhBirQDmZ0pIK4ovQ/ycXUdO03LM9C4chmzM48YIGhXQYocHB7i3fIK7DMn1knkpcI9pLSR/gChUbbsFuobW9i1fuPIPkZau+YevWy5cfq6K6tfWf1SM9Ac+b79E9b+AY7slvt0TyiKW6aMj6Yi2ItzstO8WGv8cCGCWkq7jsf3cwy1F0cQCmHW13yf6OfB6BO+VNBDqsMRxKx/RdP6w3SsjqhXUS7oIZThBBJUJLYjC1dE9gFIuNKeEwjND3pCRWkJ5UqIuosTSBQAtjESRP75wOaY0L2ltaS1QpuFreP/bC2vi1C6e4JvrHwvRAf/MpTufo9dT78mRmXeL6fCfTDgkDkHJEMnGUsnN/K5iSxbknbSmzQALHT0wUAny/Me21YR3gFFXU+CRN25bo37B0f4mkLj2UrzAAAAAElFTkSuQmCC","name":"Profile","sound":false,"toInform":true},{"_id":"55e4aa131263f8cb52a90d23","__v":0,"link":"http://team.binary-studio.com/feedback","logo":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAEqElEQVRoQ+2ZX0xTVxzHf6eMEgalfyyVBgR0wlzUTMyGZhinG1uMSyY+LHuDNYM97MXeh83Gh23Zw1a3h0Ky7GFgOnhdMrslM2aZA41dlC3iomYKTpE/KZbalhYklNGzHPA2ve39f8+tLz1vkPP78/l97/nem1MEOi63z28pQ2t+UmIFl7h6GVdcr3JIr8QeX/8hQIhAND6pMQkYu7xMz4geNXUBOdnb70OA3HwNY8C9p909DG0YqiAf+b7bY0DIjwDtEWsUA76extj1NfPBdVpA1EBO9g2cQBh6lTSGEbhPn+juUxIjtFcziMfnb4SNA31IZUMjgEtcXsY1qTJ+PUwTyMe+gQ6EwI8ALFqawABxjMH1FdMdUJtHFQhrqwigQ21hfiOAgFqbVgzCY6s0WUguVTatCETMVmnTKLVpWSBybVUHGNk2LQni6TvzKWD8GdvktjonbK2tod0zJ9/92Tm4NxPK/E+OTQuCCNlq+/698Pq+Fl1BLlwdg9+uXMutIWrTvCBitvoUQUDMpvNAyHkoQYYxoZErBQldjayncu6zy1ZRQJFM/BpOt+R+3uSBeHwD3wOCLhogi7OP4WzHxsfuuxfeAGNVqSwYKRDAMOhlut/LTsYD0j8CCL1KA+TssWGI3kmsp7LtMMPxgLyvGGkQfNHL9HCS5YF88u3g5VRqtU0ryJUvbsCtoXucNDs7t8H+U7slVZECMRpLg59/2HVAVJFfg3/Nz8xH7OOTM7wF5ZyRiR+n4NIp/mPW/k0rNLQ7RWHEQJob66Cu2h55s+2lalGQ30fHYtYqkyUcjcPojTuwtLzMKSoF8uifBTjXGYRUcpW3WaOpFI4OtcGmF8yCMHwgFeXl0Lr7eXDYLBBLJOOvtbZYZYGwm27++wBuTdzPxIiBpBKr8EtnEKK3Fzb245xenzzI5Ly8NdQmePhzQXY2bYVdzzVkkqkCIdHxRBJGb46TSYAYyCXPNZgITEueAbKh6Xg9HPyS/8XKglirTNC6qxksVSZOTtUg2eo4N1l53+xEDfJYZa9zXUHO30cHuR4i9G4hIKFHMY4K2Yk0g5Bk6XQamhvqoPLZcsnJn9nxE2fP+7ePScYsPl6G8QczYDAYBPdSAWGzV1vNUGO3QYlIQSUga+k0zEWiMB/jqspHQxWEFDCWPgP1NQ5BdeSCEBWm5sKQWv1PUjGygToIW9VmNkGtw56njhQIUWE2HIHoQlIWALtJNxBSgDxi9U4HmCsrMk2JgSwsLsFUKAwERunSFYRthoAQIAJGXIxYMlkHvXvXX4KkcQJAQNSugoCw6tRutoMtx/+jiSTMPoyoUoG6/SqZIrFoYgZkkcNMDjWNVTBFsptl7VnNWRCCfiogNBTIzVEE0WOqWnIWFdEyPT1ii4roMVUtOWUpcv7ynxOb7dbtWgrpHfswErt75MDLTdl18q6Dfjg/7N7euMWndzNa8t+dnGbeOXKY83sl793vz8N/jGxxOgQv6bQ0oTV2OhS++PbhV/Ju+gRv44kyZWVlHZUV5S9qLU4jfnFp+e+VlZVArhJsbsnfR2g0UYgcRZBCTFlJjaIiSqZViL1FRQoxZSU1/gct9mBR6uOeBAAAAABJRU5ErkJggg==","name":"Feedbacks","sound":false,"toInform":true},{"_id":"55e4aa4d1263f8cb52a90d24","__v":0,"link":"http://team.binary-studio.com/asciit","logo":"data:image/png;base64,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","name":"Asciit","sound":false,"toInform":true},{"_id":"55e4a7da1263f8cb52a90d22","__v":0,"link":"http://team.binary-studio.com/hunter","logo":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAFDElEQVRoQ+2ZS09bRxSAv7F52FiAgUBp0gSkRm3URWsEqNmFtFIfUiVYVVVVtXiXrFp+AZddVxVdtaqi2kgsom5KWrWNumjoohJ9IEBqG5BSQRIlQMDFPMLDxp5qfM3D2Pf62tcGGjGSZWnumZnzzTln5syM4Akp4gnh4ATkuFnySC0iA2hAv/ATtjsxRwYiA3QjCADjSPzCz7gdmKMEmUHQlFQ+jKRH+AnmC3MkIPuscVDvYBIoZ1c7dBAZwItgDGg2mP28XO0oQIYQdGZxoZxd7dBAZIDmZHB35BAHll2tqCAJN3LQiUQp3wV4c4DYEbXkakUDkQF8CL42iYVcmLK6WlFALAR0LhB7spI+4U9sommlWCAagt78tDVppW+cGfeagoMkg1otr/nEgzGF5K7wGy7Zhc9+ZYAggg+KYA1Dt1JjFdQi8hpNlPAX4CkCSI1ZcllYkMFTb7G9+G0RIAaEn26zfgsGIsc0L49+m2D2+3NFAGnJlh0XBCQBsc0tFoZ9PBo25ihvgJKK9O/xSJhYZB0ht4lF1pCxyK5QLHpbdEffzTY5tkF2IQQ6hBFIqRee/yibPkbfh3DiFy2aYVZsCyQFQqlw9zqsTmZW5kwX1PjyBVHLUo9o1fqNOsgbJA1CjTAdhMcz6WPZs0ayP3lDtPWpfC1jMQWRY5oP6agmLlXe5EVKNaVqo9v53+s0tgm3P848SkMHqJ+dkq9F5O/aMIJLlsdeHIG5m5mtcf4KOF2Wu0oXlJ+Ktj7TADO0SE4gkTD88zkoqxws596BqguWILZX19i4/3BXtrS6ivL6OkRZ6QxCBEVrb1/OrmUZRCk/E4SNufQx6i7C029YglBCkdASW/ML7ANIbSvwi1Ytt6TRMsjsTQiNpCvr9cEzhrFpGS5FUPKzaNcyBpt915rqh+iB5b0QwZ0R1ThW7IMol7p3XYdRy6yygsfogiQ/QyRbTeCkw2hTtA9iS7fUxvHNLTZn5yNIEimKo8K95qqvmcZZ8qVo066ZDXWsQLYWQkQWQjg97sRq5azYl5dJLot2zTCRO1YgxGLEo9s4XOWZJn9AtGmGqfzxAjF1U/NN8f8CsowTn2jRMiRyOv2xAZGRKNHlFZAyLGU8XF5be4eSklEcTOJgyCyFP1YgO4Gu4sN9unEnTsI4aTGzxI43FsYiK5P6PlJ5AcqSt0Bqf1FnE1XnbtTHUzmZqqtoTq1bn0HGS4nK05TV1aRGirqUa9cyXsrtF7QPos4gcReUPwerP4JKEhXY6n2oaIXVW9D4qp79PvgOKi/D+ih46qH2op6nVb0Om1OgXuCevXIEIOoQNTcC57/SB1/6Bv79AtbvwQu/gLMSNiZh+n1wuODsJ+Bpg9gKTL0JnrPgvgQNV/X2d96Gel9qtqy7VtZnOWOL/NHbjxTmZ9PZH5pZ/ruJp65C6RlYugEbE4+Jhjyceg+qXoGVn2BxUFdU1XnaIfoA5j8DR/km7hdd1HRCbBVCg1BRG6LxtT8RchynCFqBMA12K5mHDNCVvHHfE5f8iuDltPaSZQTVKfWSUQStB+rUW6Lh2dxIr7zP7KrDxK07qEfNPQUlPZB4sX1pd1DJQCIABB/uq5sA1GW3enrQi4IFn/BjuF8UBSQJo1Jdtaqo/6C6LU8CqllVdSo/SrylJ9/V1XlCKaophRMPowo8EemJuqzxkAnGlkWsuN9hyZyAHNZMWx3nxCJWZ+qw5P4DJVnhQmrlj4YAAAAASUVORK5CYII=","name":"Hunter","sound":false,"toInform":true}];

	vm.showAllLikes = function(users) {
		$mdDialog.show({
			controller: LikesController,
			templateUrl: './templates/news/AllLikesModal.html',
			parent: angular.element(document.body),
			clickOutsideToClose: true,
			locals: {
				users: users
			},
		});
		function LikesController($scope, $mdDialog, users) {
			$scope.users = users;
			$scope.getUser = vm.getUser;
			$scope.globalIdToProfile = vm.globalIdToProfile;
		}
	};

	vm.globalIdToProfile = function(global_id) {
		var user = vm.getUser(global_id);
		return user.id;
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

	//weeklies

	/*vm.weekliesMode = 'view' || 'create' || 'edit??';
	vm.supportForm = 'copy' || 'create' || '';*/

	vm.weekliesMode = 'view';
	vm.supportForm = '';

	vm.packs = [];

	NewsService.getPacks().then(function(data) {
		vm.packs = data;
		vm.packs[vm.packs.length - 1].uncollapsed = true;
		vm.packs.forEach(function(pack) {
			pack.fullNews = [];
			pack.news.forEach(function(newsId) {
				pack.fullNews.push(getNewsById(newsId));
			});
		});
	});

	/*vm.togglePackCreation = function() {
		if (vm.weekliesMode === 'create') {
			vm.weekliesMode = 'view';
			return;
		}

		var date = new Date();
		var d = date.getDate().toString();
		var m = (date.getMonth() + 1).toString();

		d = (d.length === 1) ? ('0' + d) : d;
		m = (m.length === 1) ? ('0' + m) : m;

		vm.currentPack = {
			title: 'Weeklies #' + d + '.' + m,
			fullNews: []
		};

		vm.weekliesMode = 'create';
	};*/

	/*vm.togglePackEditing = function() {
		if (vm.weekliesMode === 'edit') {
			vm.weekliesMode = 'view';
			return;
		}
		vm.weekliesMode = 'edit';
	};*/

	vm.toPackEditMode = function(packId) {
		if (!packId) {
			var date = new Date();
			var d = date.getDate().toString();
			var m = (date.getMonth() + 1).toString();
			d = (d.length === 1) ? ('0' + d) : d;
			m = (m.length === 1) ? ('0' + m) : m;

			var pack = {
				title: 'Weeklies #' + d + '.' + m,
				author: vm.whyCouldntYouMadeThisVariableUser.id,
				date: Date.now()
			};

			NewsService.createPack(pack).then(function(data) {
				console.log('EMIT NEW PACK: ', data);
				//EMIT NEW PACK CREATED !!!!111 UPDATE VM.PACKS
				vm.editingPack = _.find(vm.packs, {_id: data._id});
				vm.weekliesMode = 'edit';
			});
		} else {
			vm.editingPack = _.find(vm.packs, {_id: packId});
			vm.weekliesMode = 'edit';
		}
	};

	vm.toViewMode = function() {
		vm.weekliesMode = 'view';
	};

	vm.toggleNewsCopying = function() {
		if (vm.supportForm === 'copy') {
			vm.supportForm = '';
			return;
		}
		vm.copyList = vm.companyPosts;
		vm.supportForm = 'copy';
	};

	vm.toggleNewsCreation = function() {
		if (vm.supportForm === 'create') {
			vm.supportForm = '';
			return;
		}
		vm.supportForm = 'create';
	};

	vm.insertNewsInPack = function(news) {
		NewsService.createNews({
			title: news.title,
			body: news.body,
			type: 'weeklies',
			date: Date.now(),
			author: vm.whyCouldntYouMadeThisVariableUser.id
		}).then(function(data) {
			//?? resetNews();
			socket.emit("new post", data);
			console.log('EMIT MAYBE SMTHNG??');
			NewsService.pushNewsToPack(vm.editingPack._id, [data._id]);
			//?? vm.currentPack.fullNews.push(copy);
		});
	};

	vm.createPack = function() {
		if (vm.currentPack.fullNews.length === 0) {
			return;
		}

		var promises = [];

		var author = vm.whyCouldntYouMadeThisVariableUser.id;
		var date = Date.now();
		var type = 'weeklies';

		vm.currentPack.fullNews.forEach(function(news) {
			promises.push(NewsService.createNews({title: news.title, body: news.body, type: type, date: date, author: author}));
		});

		$q.all(promises).then(function(data) {
			var newsIds = _.pluck(data, '_id');
			var pack = {
				title: vm.currentPack.title,
				author: author,
				date: date,
				news: newsIds
			};
			NewsService.createPack(pack).then(function(data) {
				console.log('created pack: ', data);
			});
		});
	};

	function getNewsById(newsId) {
		return _.find(vm.posts, {_id: newsId});
	}

	vm.editPack = function(id) {
		vm.togglePackEditing();
		vm.editingPack = _.find(vm.packs, {_id: id});
	};

	vm.deletePack = function(packId) {
		var confirm = $mdDialog.confirm()
			.title("Are you sure want to delete this pack of news?")
			.content("")
			.ariaLabel('Confirmation')
			.ok('Yes')
			.cancel('Cancel');
		$mdDialog.show(confirm).then(function() {
			NewsService.removePack(packId).then(function() {
				//socket.emit("delete pack", packId);
			});
		}, function() {});
	};

	vm.removeFromPack = function(index, news) {
		var newsPromise = NewsService.deleteNews(news._id);
		var packPromise = NewsService.removeNewsFromPack(vm.editingPack._id, news._id);

		$q.all([newsPromise, packPromise]).then(function(data) {
			socket.emit("delete post", news._id);
			vm.editingPack.fullNews.splice(index, 1);
			console.log('EMIT SOMETHING ????: ', data);
			//EMIT SOMETHING ????77 DELETED VM.PACKS, REPLACE DELETING BY INDEX
		});
	};
}