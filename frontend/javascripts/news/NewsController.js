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

app.directive('whenScrolled', function() {
	return function(scope, elm, attr) {
		var raw = elm[0];
		elm.bind('scroll', function() {
			if (raw.scrollTop + raw.offsetHeight >= raw.scrollHeight) {
				scope.$apply(attr.whenScrolled);
			}
		});
	};
});


NewsController.$inject = [
	'NewsService',
	'AdministrationService',
	'WeekliesService',
	'NotificationService',
	'$mdDialog',
	'$location',
	'$route',
	'$rootScope',
	'$filter',
	'socket',
	'$q',
	'$timeout',
	'$scope',
	'$window'
];

function NewsController(NewsService, AdministrationService, WeekliesService, NotificationService, $mdDialog, $location, $route, $rootScope, $filter, socket, $q, $timeout, $scope, $window) {
	var vm = this;

	vm.loadMore = function() {
		console.log('dfgdfg');
	};

	vm.formView = true;

	NewsService.getMe().then(function(data) {
		vm.whyCouldntYouMadeThisVariableUser = data;

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


	vm.checkRights = function(id) {
		var res = $rootScope.myRole === 'Admin' || $rootScope.myRole === 'Content Manager';
		if (id) {
			res = res || vm.whyCouldntYouMadeThisVariableUser.id === id;
		}
		return res;
	};

	vm.tinymceOptions = {
		inline: false,
		plugins: [
				"advlist autolink lists link image media charmap print preview anchor",
				"searchreplace visualblocks code fullscreen",
				'print textcolor',
				"insertdatetime table contextmenu paste"
		],
		height: 300,
		content_css : ['styles/css/libs.css', 'styles/css/style.css', 'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css'],
		body_class: 'body',
		toolbar: "insertfile undo redo | styleselect | bullist numlist outdent indent | link image media | forecolor | backcolor | mybutton",
		skin: 'lightgray',
		menu: {},
		theme : 'modern',
		browser_spellcheck: true,
		setup: function(editor) {
			var options = [
			{text: 'Red', color: '#F44336'},
			{text: 'Pink', color: '#E91E63'},
			{text: 'Purple', color: '#9C27B0'},
			{text: 'Deep Purple', color: '#673AB7'},
			{text: 'Indigo', color: '#3F51B5'},
			{text: 'Blue', color: '#2196F3'},
			{text: 'Teal', color: '#009688'},
			{text: 'Green', color: '#4CAF50'},
			{text: 'Light Green', color: '#8BC34A'},
			{text: 'Amber', color: '#FFC107'},
			{text: 'Brown', color: '#795548'},
			{text: 'Blue Grey', color: '#607D8B'}
			];
			var menu = options.map(function(option) {
				return {
					text: option.text,
					onclick: function() {
						editor.insertContent('<a style="background:' + option.color + ';" class="custom-button-link" href="http://example.com" data-mce-href="http://example.com" target="_blank">Now setup me!</a>');
					}
				};
			});
			editor.addButton('mybutton', {
				type: 'menubutton',
				text: 'Button',
				icon: false,
				menu: menu
			});
		}
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
		elementpath: false,
		browser_spellcheck: true,
		setup: function(editor) {
			$timeout(function() {
				editor.focus();
			}, 300);
		}
	};

	vm.tinymceInlineOptions = {
		//selector: 'h2.editable',
		inline: true,
		toolbar: 'undo redo',
		menubar: false,
		browser_spellcheck: true
	};

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



	

	vm.fullUsers = [];
	getFullUsers();
	function getFullUsers() {
		NewsService.getFullUsers().then(function(data) {
			data.forEach(function(user) {
				user._lowername = user.name.toLowerCase() + ' ' + user.surname.toLowerCase();
			});
			vm.fullUsers = data;
		});
	}

	vm.roles =[];
	getRoles();
	function getRoles() {
		NewsService.getRoles().then(function(data) {
			vm.roles = data;
		});
	}

	vm.expandNewsForm = function(newsId) {
		vm.expandedForm = newsId;
	};


	//angular chips
	vm.readonly = false;
	vm.selectedCategory = null;
	vm.selectedUser = null;
	vm.searchText = null;
	vm.searchCategory = null;

	//from jade
	vm.selectedNames = [];
	vm.selectedCategories = [];

	vm.allowedCategory = [];


	vm.editpost = function(news) {
		if (JSON.stringify(vm.editing) !== JSON.stringify(news)) {
			news.edited_at = Date.now();
			NewsService.editNews(news._id, news).then(function(data) {
				socket.emit("edit post", news);
			});
		}
		vm.resetEditing();
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
			console.log(post);
			console.log(vm.fullUsers);
			if (post.type === 'company') {
				NotificationService.newsCreated(post, vm.fullUsers);
			}
		});
	};

	vm.getUser = function(id) {
		var user = _.find(vm.fullUsers, {serverUserId: id}) || {};
		//user.avatar = {};
		/*if (Math.random() > 0.5) {
			user.avatar.urlAva = 'http://www.krowmark.com/wp/wp-content/uploads/2015/05/Darth-Vader-darth-vader-18734783-300-355.jpg';
		}
		else {
			user.avatar.urlAva = 'http://cs302205.vk.me/u7126369/-6/z_c6578f9c.jpg';
		}*/
		//user.avatar.urlAva = 'http://cs302205.vk.me/u7126369/-6/z_c6578f9c.jpg';
		return user;
	};

	vm.toggleForm = function() {
		vm.formView = !vm.formView;
		resetNews();
	};

	vm.resetEditingForms = function() {
		vm.formView = true;
		resetNews();
		vm.resetEditing();
	};

	vm.newComment = function(commentText, newsId, form) {

		var comment = {
			author: vm.whyCouldntYouMadeThisVariableUser.id,
			body: commentText,
			date: Date.now(),
			likes: []
			};
		NewsService.addComment(newsId, comment).then(function(){
			NewsService.getComments(newsId).then(function(data) {
				var i = data.comments.length - 1;
				socket.emit("new comment", {postId: newsId, comment: data.comments[i]});
			});
		});
		$timeout(function() {
			form.$setPristine();
			form.$setUntouched();
		});

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

	vm.newsLike = function(news) {

		var userId = vm.whyCouldntYouMadeThisVariableUser.id;

		if(_.contains(news.likes, userId)) {
			NewsService.deleteNewsLike(news._id, userId).then(function() {
				socket.emit("like post", {post: news._id, user: userId, isLike: false});
			});
		} else {
			NewsService.newsLike(news._id, userId).then(function() {
				socket.emit("like post", {post: news._id, user: userId, isLike: true});
			});
		}
	};

	vm.commentLike = function(newsId, commentId) {
		NewsService.toggleCommentLike(newsId, commentId).then(function(data) {
			socket.emit("like comment", {newsId: newsId, commentId: commentId, like: data.like, userId: vm.whyCouldntYouMadeThisVariableUser.id});
		});
	};

	vm.prevLocation = '';
	vm.showModalPost = {};

/*	$scope.$on("$locationChangeSuccess", function(e, currentLocation, previousLocation) {
		var locs = ['company', 'sandbox', 'weeklies'];
		for (var i in locs) {
			var prev = previousLocation.indexOf(locs[i]);
			var curr = currentLocation.indexOf(locs[i]);
			if ((curr !== -1) && (prev !== -1)) {
				vm.reloadData = false;
				break;
			}
			else {
				vm.reloadData = true;
			}
		}
	});*/

	/*$rootScope.$on('$locationChangeSuccess', function(event) {
		var location = $location.url();
		if (vm.prevLocation === location) {
			event.preventDefault();
		} else {
			vm.prevLocation = location;
			var params = $location.url().split("/");
			if (params.length == 5) {
				var type = params[1];
				var id = params[3];
				vm.showModalPost(type, id);
				vm.showModalPost = {
					type: type,
					id: id
				};

			}
		}
	});*/

	/*vm.goToPost = function(type, id) {
		if (type === 'weeklies') {
			$location.url(type + '/pack/' + id);
		} else {
			$location.url(type + '/post/' + id);
		}
	};

	vm.showModalPost = function(type, id) {



		if (type === 'weeklies') {
			WeekliesService.getPack(id).then(function(pack) {
				show(pack);
			}, function() {
				$location.url(type);
			});
		} else {
			NewsService.getPost(id).then(function(post) {
					show(post);
			}, function() {
				$location.url(type);
			});
		}

		function show(data) {
		}
	};*/

	vm.switchTab = function(url) {
		$location.url(url);
	};

	vm.newsFilter = '';

	/*vm.newsSearch = function(item) {
		if ( (item.title.toLowerCase().indexOf(vm.newsFilter.toLowerCase()) > -1) || (item.body.toLowerCase().indexOf(vm.newsFilter.toLowerCase()) > -1) ){
			return true;
		}
		return false;
	};*/

	vm.findLike = function(likes) {
		return _.find(likes, function(like) {
			return like == vm.whyCouldntYouMadeThisVariableUser.id;
		});
	};

	vm.editComment = function(newsId, comment) {
		if (JSON.stringify(vm.editing.body) !== JSON.stringify(comment.body)) {
			comment.edited_at = Date.now();
			NewsService.editComment(newsId, comment._id, comment).then(function(data) {
				socket.emit("edit comment", { newsId: newsId, comment: comment });
			});
		}
		vm.resetEditing();
	};

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
	}

	vm.toggleGenMenu = function() {
		if ($window.innerWidth < 1280) {
			if (vm.showNews || vm.showWidgets || vm.showIntranet) {
				vm.genMenu = false;
				vm.showNews = false;
				vm.showWidgets = false;
				vm.showIntranet = false;
			} else {
				vm.genMenu=!vm.genMenu;
			}
		}
	};


	

	vm.showMenu = function(menu) {
		vm.genMenu = false;
		if (menu === 'news') {
			vm.showNews = true;
		} else if (menu === 'widgets') {
			vm.showWidgets = true;
		} else if (menu === 'intranet') {
			vm.showIntranet = true;
		}
	};

	



	//menu

	//PRODUCTION
	NewsService.getServices().then(function(data) {
		vm.services = data;
	});
	//DEVELOPMENT																								*********************************
	//vm.services = [{"_id":"567a81f67498f49f41e7d540","link":"http://team.binary-studio.com","name":"News","logo":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAACL0lEQVRoQ+1ZO0tDMRT+ThcfiApaC0JrLaKCj6kdVNAW2qGDbtZOWhdXBVfBuiv4E3Sr/gXxNYiDOIguCoLYyQeCIr4GI9ciaNu0Mfc2LeFmPic53/nOl5wkBE0GaYIDNpBKY9JmhB1vJ8DYVBmYOSF/eC57XWlG2NFWEkSLyoEwtk+BSNAGkp0BmxGztaistB7vgbNDs+Fm/D2dgLvr71zKgKTPgdSKNUAGR4GhURuIUDa5YteGkUrTCBv3JkCONi49YzNBdPtzDiYhOs0Y/VfsLNa+B6IR7pr5hGgmQFFfZUDeXoDbdOGwWtxAdS1wcw28v/JtG5qAhmZzu5Y0IyJij89nzofUMpC+4AOxYvuVBmJkeXezMCOhGODyADsbhdnrGQD6hsrEiGity9op04hsgKJ+yoBooxFtgIiWiKydstKSDVDUTxkQbUpLGyCiJSJrp6y0ZAMU9VMGRJsWRRuNGG38XZE23vmrjf8o0MbXl7ONF611WTtlGhG5s/cOZC5MpwfA0wMfkhXvWtL3EW00og0jsrUv6mdrhJcp3nOQNhqpuJN9wrcKYJZbutFpwNhG1Y918ocT2cty/xBZ3BsEc+zmjdN4XJtcyH08UwGKsRAFInvCQAxDFvMlQcj98IwmgN5BFWFnv2ktUSCSzLdw0V/db2Y+yaDSC3dHHfqHXWhqrbMURaPzElU1z9w5ia7A2Fo+Jn58igKxNOASTmYDKWFypaa2GZFKWwmdvgDMZK9Cjatp8wAAAABJRU5ErkJggg==","__v":0},{"_id":"567a8381ec1453994b1757c9","name":"Interview","logo":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAADh0lEQVRoQ+2aTUwTURDH5z3bYimQopIUK7oV64VE680TH4oXo0bwIGARTKrRW3s2BojxXG5q0ihYBDQR/DqY2Ejx5E0uHLRpugaRRvwAQktsa5/Z1W0pdD9ad5cQdk/72vf+M7+Z2c523yJQ6PCOjFMolfYCQg7WBCFTRIc9nvYWWgmTSAlR78NxB0qTCUBgztEnsEAwavJcaJmS264yIP6xIELQQAhMAkZu1uk0GUAIDgNA0O1sbdoUIP1DY4StpiSq9FxqWWDOvffHzUhPfjLnbmer7AGULNjc5mpEmHQRgigumjYbZbFarZbV0cUY44ry8op8DnOAi0uLi4QAC8sds7Oz0UiEjnJjhAhN0mgwMOoLSsmeJJDmdpcbIfCuFbTb7XDQbs9jh/ERQSwej1y/4tzPTLh1dyhiMpVSwPq/3uzHUAhCodA6LULAExjx9YvBiII0tnVTeqyL5BPiBVnlK0n/DTzC/0zl5wA+EGZtMp2yBUcHBH/tREGaO1y9CKCHEazdVwNXneczTPTcPNDReZ5gcZXDmVg7zl1GWaqAqq7KfHhn6BGEP82wYwLQFxj29QplRRTkRLsrCAgaGJHOc2egs/V0Ri88Mwcv374Ty7qk70/VH4XamurMXP/YC/A/ec6BPAsM+84qBvIrkYR7T19BIpmS5CzfpHKTES6cPA4lBn1eECAw+XrE16gYCCPMwIQ/f4Gl5XhRMBVlpVC7Z3cOBCO0OiOqgBTlvYRFGghfkIQudgmBLXqKlhEtI0UXj/BCrbS2dGkxHT2Rynb1bRiDscQgS7GpWlrRbz8g+p39r8QeZcbtcGCvlT1fjq8AINFbucxag04HBr1uY25RhECmPoQLyoxlZyVYdu3QQERzL9TZhTJSUDryTFb1GvlfZ4XWayBbuo9opSUhAqpeI4N0Ch5Esp39kBmD98gm7Ox90wm4OZ3MxLe+CsObJiM7PjaxAijPgzi+ZFy06aCL2qDOLgSiexyTUEDZKTfq9NBTl82mqqUlBBL8+rsgEMqEgTJl+7OqIHSMAB1LZxw2GxA4zLggAL7JqoLI4jGPiAaidXaF6ksrLa20tNISjoDsGz1rt96udbYplINc2dv+UZm33jouOwDIe1W85zEiy2Yoo823Pa0GnGzb05yz7AsDiHQDZF8YUBaE0ISgAVlfGFDWYXnURZ9ryWNGeRUNRPkYF2bhDxaprVGueb1TAAAAAElFTkSuQmCC","link":"http://team.binary-studio.com/interview","__v":0},{"_id":"55e4a51b1263f8cb52a90d1e","__v":0,"link":"http://team.binary-studio.com/accounting","logo":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAFcUlEQVRoQ+2ZS1BTVxjH/yeUR3gmEGAcoeUh4lgEBEWq1ILMWNqpHe3QRVeWGeiim5IFlVWxXUFdBDddFDvUVRdlqlM7lTqDoKJFLG+qIPLoQMfhmfB+FU7nRG4m95Hcm9wkbLi75Jzvf77f+Z/v3HMSAjee4ivplwlIlRuhsiEU9OuGit7Lsh0FHYirAaw/AwF9BUJ2FCil1g9KBSkLphRkR4CFWx/iYxBCUWWj2Mkhcf/ryM04pmhu7nf8iX8nX/L7UgpK4GNHgCrh/MdEGlCYe1oRSFPbfUzNzfD6Ulht2X2QE+lZSIpLUAQyMDqErmd9uw/Cij0oMBBr6+vWZFITkpF1OEMRBNep82kPBseGrR85LZ8XOwNJSzkEtpz04ToE+AeIIMwLZgyOvko0NTEZ+nC9qM/G5gbMCxbrMusfGoCPQY5XE2xcYiBHUg47dOH2gyZYFuet7fqwCBS9Xeiwb9/Q0x2QgJqGiieVLlnLNjtXAypNdfkz9NGN+a1OnRzIT7//wpP/5P2PZEEi/LIsBnLyQrWxrMWV3FwCuVRbZyIg5XPbj2HeaocciP0Wuz92H05nvyULovfLQaTmBFtitTXlZUalMIpAKkzfZ2oIqScgmUxYKQjry+rEurQk6sM+SW5pcSCsjYJ2b1NacsX4WbcckCxI5dUfqkAp78jgCohcAly7FAjXRgnKa74ovepMyyFIpak+AWSrHkC+UMDXIDvjt4D6lVQbS8akgCRBvjRdO08I6gmgkwraJRD23rdQipJvjaU3hXmJQFg9+BFNlzMblYIsrSzbtl9dWARCg0MUF7uz8bfo9lFh3YhAKk3XfgTBRTUgk7NTeNzbieXVFZ5MiDYY7BgTGxUjkndWI6LOFNerjaWf2n8vAVLXAkLecRdkZGLMCuHskTqTuQZC71Uby3i1KwL56rvrrRsbm6fcAWFbbWNrs6KNqiivgLcluwISEOD/8JvPL+Y5deTOw7+mJ6ZnDM/HJhwm5KhGpI7mjkSEL0ilIAcT4hAXbZg5e+pYtFOQu+1dZn14mG5qzoL2vkEsr66KcnEEIjySyFljf2SRAwnRapFzJBUxkTqYFxYtZ3KO8k6goqXFgXBJ9A//g7+HRnk5SYG4sqw4Mfvl5QzkzZREpCW/YcvBLRAWbVlYRHv/czYTVjEpELbV3mr5Q84EXvu5/HdtW7IUiD48DDlpB6ELD+PFuQ0idMfR0mq4cwub/20qgvF/zR/FZ8/Z+gpBhC7Yi6oGYWLLq2to6r2B/qkG0enX/sYnRyO8UXIgaTHFKEy/gBBtkEMJj4Bw6u0jv2F2qxuHkhJtA7Lb3u3Wu1gRvAiFGQVrg/Fe3hnerXJgZBRRfpnISfpAbg7cK3ZnqiubZiz4dWCVTtoVohltPZ22o4kwnh1VcjOyeO8QLYlF+FY2gv3FV2Gp8T3qiP0Ai3QYc7QT23TD+jVzpn/oGcwL87affNjdPibKwLsaa0gAIkkWwkiyrAserxFHIzKIGdqGZTquKKkQEg8DyQWDcfXxmiP2iTAQBsS5I0ySJc4AGIi7j09AWHIMYhYdWNoe4eUaqklCFLLdcsFnS0tqdtfoJKa326xN0ZpcBJFYd03gxfnMEftRuSXmTi04ot4VEI9YIBDZA/HGrKrR3HNEzex5I3bPEW/MqhpNRY40tj4ZijXoD6gZyNuxkzPmF0V5x1PsxxHd2X9ubC4/kBBv8nYyavRfjI0bPy4qqHUKwhp/bX7UEr8vxumPdGoSURM7/nLq3ocFJ0U/rDv8NZ45ExgYeD40ROvaP5xqsnQSu7S82rO+vn5T6AQXIvv/iJfy8rjsHojHp1Sl4J4jKifQ4+F7jnh8SlUK/g+rkCBgL9KwWQAAAABJRU5ErkJggg==","name":"Accounting","sound":false,"toInform":true},{"_id":"55e4a5d71263f8cb52a90d1f","__v":0,"link":"http://team.binary-studio.com/reviewr","logo":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAADLklEQVRoQ+3ZTU8TQRgH8P92240IVqRHTSRGD2gCRMQWNLQm6sGg2foFxE+gRO/qXYN+AvEL2I0SD8YEShSKgAEO1IsEEwyNBlFeFLcvawbYZoFZdqbtblfsHsnTmec3zzPDtCtgjzzCHnGgAnFbJSsV+WcqIsfk2gxwC0DEJUkPeIEnSlT5QcvHtLU6Y/J9APdcgtDTeNAXVUheOx5zyHN5AALCroJoiPddV6gdwgRZ/raClYWVspikKgmBo3UbcxcLmU+mkPqYKgukJlCDEx3HKxB0GvbIf1cRr+RDS/g0pseSWF5corbigUN+nDzTgPH4B2TUtGW7Ot5aBBG6GMTBgB+qmkbi9cgODEGELgchST78XFhC4s2IJcZRiBGhL/FMchbJsektK3742BE0n2vM/40F4xiEhpj7NIfJoSlq2/BiHIHwInQZD8Z2SKEIXoytkH3VVQhf64AoihA27wa7tZPZ0WSsjKYB2WwW8ReDWFv9nf+IbRAd4fWKG7cGDfgyY74nrM5Xgmlqb8wvSCazFWMrJEKqsQkhiU68m1rHFPJs3y/kQjU+OIHU5/n14WyDkMFJVUqBsULYDtExrZEW+Ov8+ULwVGY7Iq2mMdo/jsWv37cU1taK6DORk6vtUpAbQ0MMU24CjlSkUAwPwlEImYy1MrwIxyE0DG2/GCFkT5i1k3GTOLJHth+3emXIhdHsOCaYU60NTIiyVITnfwgBs3wXcT2EB12W1uJJkDW2AtFXyvjjw59fKtRVlXURSxon+kTsr63aGLPY37VKmlkxgxUCuRqTZQ2IFTNvqT8rANGXUUWhjbvr+5ErMbnZA8isCWXUdL26mr7BEi9V+555Jd8sSyyJyQHKq6gyYRZf0hc9oZ7zEWjoZ0pOwIVE99sBpliGIG7I2YdtskcUm+hja/XQhC6GeQFB6wUEakVy2ezk+7vD1BYqSUVCj9q7IHiemieqAczvVy1itdzNxJ2hXqZF4ZgV1gjWKTniODBMrVUWhO5lxFhCyorgwOwKae1pbxY1z2OOZrAtNCvkbo92Dzlz/NqmYBjYsrUYxnBFSAXiijIYkqhUxG0V+QutqoFRIjwYpgAAAABJRU5ErkJggg==","name":"Reviewer","sound":false,"toInform":true},{"_id":"55e4a78b1263f8cb52a90d21","__v":0,"link":"http://team.binary-studio.com/profile","logo":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAACc0lEQVRoQ+2a3WoTQRiG36mNrslqV0JCrT8NNGlwUQzSlCJCInjUE3sHXoJeQr2D9T48aE/VJpsTEexBpLUWbCGFWoQG2WqppdmyMgstpd3d7GzITBJnDsP8fM+87zf7bWYJBqSRAeGABOk1JdsqUp2OzwFDL+BAo8HfTCc387nsBD8QpwGQRWIsLQStGQhSLSYMEPLy7ATp5I2anp8s8QM5Wcl5Q4zKK791fUGqU2oZQ6ieHygOhEZCnhLjg+kF4w/ioQadQCyIvyq+IJWiahKCCxYSDFIjRqXMpIgE6eop4EhFZI50x2HSWvL4veCsXWvP/U1T44gNxyI6T6C1dpq/8Hl9Ey37+DR4PXMLeuZOBBhBIFSFWv2bZ8APs3eRuz3GCCMI5P3yF+zt//UMNjZ8Cc+fFPsD5K35KTDQZ1MPoKkJBhhBirQDmZ0pIK4ovQ/ycXUdO03LM9C4chmzM48YIGhXQYocHB7i3fIK7DMn1knkpcI9pLSR/gChUbbsFuobW9i1fuPIPkZau+YevWy5cfq6K6tfWf1SM9Ac+b79E9b+AY7slvt0TyiKW6aMj6Yi2ItzstO8WGv8cCGCWkq7jsf3cwy1F0cQCmHW13yf6OfB6BO+VNBDqsMRxKx/RdP6w3SsjqhXUS7oIZThBBJUJLYjC1dE9gFIuNKeEwjND3pCRWkJ5UqIuosTSBQAtjESRP75wOaY0L2ltaS1QpuFreP/bC2vi1C6e4JvrHwvRAf/MpTufo9dT78mRmXeL6fCfTDgkDkHJEMnGUsnN/K5iSxbknbSmzQALHT0wUAny/Me21YR3gFFXU+CRN25bo37B0f4mkLj2UrzAAAAAElFTkSuQmCC","name":"Profile","sound":false,"toInform":true},{"_id":"55e4aa131263f8cb52a90d23","__v":0,"link":"http://team.binary-studio.com/feedback","logo":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAEqElEQVRoQ+2ZX0xTVxzHf6eMEgalfyyVBgR0wlzUTMyGZhinG1uMSyY+LHuDNYM97MXeh83Gh23Zw1a3h0Ky7GFgOnhdMrslM2aZA41dlC3iomYKTpE/KZbalhYklNGzHPA2ve39f8+tLz1vkPP78/l97/nem1MEOi63z28pQ2t+UmIFl7h6GVdcr3JIr8QeX/8hQIhAND6pMQkYu7xMz4geNXUBOdnb70OA3HwNY8C9p909DG0YqiAf+b7bY0DIjwDtEWsUA76extj1NfPBdVpA1EBO9g2cQBh6lTSGEbhPn+juUxIjtFcziMfnb4SNA31IZUMjgEtcXsY1qTJ+PUwTyMe+gQ6EwI8ALFqawABxjMH1FdMdUJtHFQhrqwigQ21hfiOAgFqbVgzCY6s0WUguVTatCETMVmnTKLVpWSBybVUHGNk2LQni6TvzKWD8GdvktjonbK2tod0zJ9/92Tm4NxPK/E+OTQuCCNlq+/698Pq+Fl1BLlwdg9+uXMutIWrTvCBitvoUQUDMpvNAyHkoQYYxoZErBQldjayncu6zy1ZRQJFM/BpOt+R+3uSBeHwD3wOCLhogi7OP4WzHxsfuuxfeAGNVqSwYKRDAMOhlut/LTsYD0j8CCL1KA+TssWGI3kmsp7LtMMPxgLyvGGkQfNHL9HCS5YF88u3g5VRqtU0ryJUvbsCtoXucNDs7t8H+U7slVZECMRpLg59/2HVAVJFfg3/Nz8xH7OOTM7wF5ZyRiR+n4NIp/mPW/k0rNLQ7RWHEQJob66Cu2h55s+2lalGQ30fHYtYqkyUcjcPojTuwtLzMKSoF8uifBTjXGYRUcpW3WaOpFI4OtcGmF8yCMHwgFeXl0Lr7eXDYLBBLJOOvtbZYZYGwm27++wBuTdzPxIiBpBKr8EtnEKK3Fzb245xenzzI5Ly8NdQmePhzQXY2bYVdzzVkkqkCIdHxRBJGb46TSYAYyCXPNZgITEueAbKh6Xg9HPyS/8XKglirTNC6qxksVSZOTtUg2eo4N1l53+xEDfJYZa9zXUHO30cHuR4i9G4hIKFHMY4K2Yk0g5Bk6XQamhvqoPLZcsnJn9nxE2fP+7ePScYsPl6G8QczYDAYBPdSAWGzV1vNUGO3QYlIQSUga+k0zEWiMB/jqspHQxWEFDCWPgP1NQ5BdeSCEBWm5sKQWv1PUjGygToIW9VmNkGtw56njhQIUWE2HIHoQlIWALtJNxBSgDxi9U4HmCsrMk2JgSwsLsFUKAwERunSFYRthoAQIAJGXIxYMlkHvXvXX4KkcQJAQNSugoCw6tRutoMtx/+jiSTMPoyoUoG6/SqZIrFoYgZkkcNMDjWNVTBFsptl7VnNWRCCfiogNBTIzVEE0WOqWnIWFdEyPT1ii4roMVUtOWUpcv7ynxOb7dbtWgrpHfswErt75MDLTdl18q6Dfjg/7N7euMWndzNa8t+dnGbeOXKY83sl793vz8N/jGxxOgQv6bQ0oTV2OhS++PbhV/Ju+gRv44kyZWVlHZUV5S9qLU4jfnFp+e+VlZVArhJsbsnfR2g0UYgcRZBCTFlJjaIiSqZViL1FRQoxZSU1/gct9mBR6uOeBAAAAABJRU5ErkJggg==","name":"Feedbacks","sound":false,"toInform":true},{"_id":"55e4aa4d1263f8cb52a90d24","__v":0,"link":"http://team.binary-studio.com/asciit","logo":"data:image/png;base64,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","name":"Asciit","sound":false,"toInform":true},{"_id":"55e4a7da1263f8cb52a90d22","__v":0,"link":"http://team.binary-studio.com/hunter","logo":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAFDElEQVRoQ+2ZS09bRxSAv7F52FiAgUBp0gSkRm3URWsEqNmFtFIfUiVYVVVVtXiXrFp+AZddVxVdtaqi2kgsom5KWrWNumjoohJ9IEBqG5BSQRIlQMDFPMLDxp5qfM3D2Pf62tcGGjGSZWnumZnzzTln5syM4Akp4gnh4ATkuFnySC0iA2hAv/ATtjsxRwYiA3QjCADjSPzCz7gdmKMEmUHQlFQ+jKRH+AnmC3MkIPuscVDvYBIoZ1c7dBAZwItgDGg2mP28XO0oQIYQdGZxoZxd7dBAZIDmZHB35BAHll2tqCAJN3LQiUQp3wV4c4DYEbXkakUDkQF8CL42iYVcmLK6WlFALAR0LhB7spI+4U9sommlWCAagt78tDVppW+cGfeagoMkg1otr/nEgzGF5K7wGy7Zhc9+ZYAggg+KYA1Dt1JjFdQi8hpNlPAX4CkCSI1ZcllYkMFTb7G9+G0RIAaEn26zfgsGIsc0L49+m2D2+3NFAGnJlh0XBCQBsc0tFoZ9PBo25ihvgJKK9O/xSJhYZB0ht4lF1pCxyK5QLHpbdEffzTY5tkF2IQQ6hBFIqRee/yibPkbfh3DiFy2aYVZsCyQFQqlw9zqsTmZW5kwX1PjyBVHLUo9o1fqNOsgbJA1CjTAdhMcz6WPZs0ayP3lDtPWpfC1jMQWRY5oP6agmLlXe5EVKNaVqo9v53+s0tgm3P848SkMHqJ+dkq9F5O/aMIJLlsdeHIG5m5mtcf4KOF2Wu0oXlJ+Ktj7TADO0SE4gkTD88zkoqxws596BqguWILZX19i4/3BXtrS6ivL6OkRZ6QxCBEVrb1/OrmUZRCk/E4SNufQx6i7C029YglBCkdASW/ML7ANIbSvwi1Ytt6TRMsjsTQiNpCvr9cEzhrFpGS5FUPKzaNcyBpt915rqh+iB5b0QwZ0R1ThW7IMol7p3XYdRy6yygsfogiQ/QyRbTeCkw2hTtA9iS7fUxvHNLTZn5yNIEimKo8K95qqvmcZZ8qVo066ZDXWsQLYWQkQWQjg97sRq5azYl5dJLot2zTCRO1YgxGLEo9s4XOWZJn9AtGmGqfzxAjF1U/NN8f8CsowTn2jRMiRyOv2xAZGRKNHlFZAyLGU8XF5be4eSklEcTOJgyCyFP1YgO4Gu4sN9unEnTsI4aTGzxI43FsYiK5P6PlJ5AcqSt0Bqf1FnE1XnbtTHUzmZqqtoTq1bn0HGS4nK05TV1aRGirqUa9cyXsrtF7QPos4gcReUPwerP4JKEhXY6n2oaIXVW9D4qp79PvgOKi/D+ih46qH2op6nVb0Om1OgXuCevXIEIOoQNTcC57/SB1/6Bv79AtbvwQu/gLMSNiZh+n1wuODsJ+Bpg9gKTL0JnrPgvgQNV/X2d96Gel9qtqy7VtZnOWOL/NHbjxTmZ9PZH5pZ/ruJp65C6RlYugEbE4+Jhjyceg+qXoGVn2BxUFdU1XnaIfoA5j8DR/km7hdd1HRCbBVCg1BRG6LxtT8RchynCFqBMA12K5mHDNCVvHHfE5f8iuDltPaSZQTVKfWSUQStB+rUW6Lh2dxIr7zP7KrDxK07qEfNPQUlPZB4sX1pd1DJQCIABB/uq5sA1GW3enrQi4IFn/BjuF8UBSQJo1Jdtaqo/6C6LU8CqllVdSo/SrylJ9/V1XlCKaophRMPowo8EemJuqzxkAnGlkWsuN9hyZyAHNZMWx3nxCJWZ+qw5P4DJVnhQmrlj4YAAAAASUVORK5CYII=","name":"Hunter","sound":false,"toInform":true}];

	
}