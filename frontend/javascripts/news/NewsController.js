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
	vm.author = 'Veronika Balko';
	vm.tinymceOptions = {
		inline: false,
		plugins: [
				"advlist autolink lists link image charmap print preview anchor",
				"searchreplace visualblocks code fullscreen",
				"insertdatetime media table contextmenu paste"
		],
		toolbar: "insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image",
		skin: 'lightgray',
		theme : 'modern'
	};

	vm.posts = [];
	getNews();
	function getNews(){
		NewsService.getNews().then(function(data){
			vm.posts = data.slice(0,20);
			checkUrlPath();
		});
	}

	vm.createNews = function() {
		vm.news = {};
		if(vm.titleNews && vm.bodyNews){
			vm.news = {
				title: vm.titleNews,
				body: vm.bodyNews,
				// author: vm.user._id,
				date: Date.parse(new Date()),
				comments: [],
				likes: []
			};
		vm.titleNews = '';
		vm.bodyNews = '';
		vm.formView = true;
		}

		NewsService.createNews(vm.news).then(function() {
			getNews();
		});


	};


	vm.toggleForm = function() {
		vm.formView = !vm.formView;
	};



	vm.toggleText = [];
	vm.textLength = [];

	vm.loadMore = function(index) {
		vm.toggleText[index] = !vm.toggleText[index];
		if(vm.toggleText[index]){
			vm.textLength[index] = vm.posts[index].body.length;
		}else{
			vm.textLength[index] = 200;
		}
	};


	vm.deleteNews = function(newsId) {
		NewsService.deleteNews(newsId).then(function() {
			getNews();
		});
	};


	vm.like = function(index) {
		if(vm.posts[index].likes.indexOf(vm.user) < 0){
			vm.posts[index].likes.push(vm.user);
		}else{
			vm.posts[index].likes.splice(vm.posts[index].likes.indexOf(vm.user), 1);
		}
	};

	vm.commentForm = [];
	vm.toggleCommentForm = function(index) {
		vm.commentForm[index] = !vm.commentForm[index];
	};

	vm.commentsViev = [];
	vm.toggleComments = function(index) {
		vm.commentsViev[index] =!vm.commentsViev[index];
	};

	vm.newComment = function(index, newsId) {

		var comment = {
			author: vm.user,
			body: vm.commentText[index],
			date: Date.parse(new Date()),
			likes: []
			};
			
			NewsService.editNews(newsId, comment).then(function(){
				vm.posts[index].comments.unshift(comment);
			});

		vm.commentText[index] = '';
		vm.commentForm[index] = false;
	};

	vm.deleteComment = function(parentIndex, index) {

		vm.posts[parentIndex].comments.splice(index, 1);
	};

	vm.commentLike = function(parentIndex, index) {
		var comLike = vm.posts[parentIndex].comments[index].likes;
		if(comLike.indexOf(vm.user) < 0){
			comLike.push(vm.user);
		}else{
			comLike.splice(comLike.indexOf(vm.user), 1);
		}
	};
// Sandbox

	// vm.newsArr = function() {
	// 	vm.posts = vm.newsPost; 
	// };

	// vm.newsArr();

	// vm.sandboxArr = function() {
	// 	vm.posts = vm.sandPosts;
	// };

	socket.emit("client message", "message from client");
	socket.on("server message", function(msg) {
		console.log(msg);
	});

	// Modal post
	vm.showModalPost = showModalPost;
	vm.currentPost = {};

	function checkUrlPath() {
		var path = $location.path();

		if(path.indexOf("post") > -1) {
			path = path.split("/").join("");
			var postId = path.substring(4, path.length);
			var post = $filter('filter')(vm.posts, {_id: postId});

			if(post[0]) showModalPost(post[0], false);
		}
	}

	function showModalPost(post, isSetPath) {
		vm.currentPost = post;

		if(isSetPath) {
			// Set url path in browser
			correctPath();
			$location.path("/post/" + post._id);
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
		$scope.post = vm.currentPost;
		$scope.hide = function() {
			$mdDialog.hide();
		};
		$scope.cancel = function() {
			console.log(true);
		};
		$scope.answer = function(answer) {
			$mdDialog.hide(answer);
		};
	}
}