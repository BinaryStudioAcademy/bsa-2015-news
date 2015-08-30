var app = require('../app');

app.controller('NewsController', NewsController);
app.filter('unsafe', function($sce) { 
	return $sce.trustAsHtml; 
});

NewsController.$inject = ['NewsService', '$scope'];

function NewsController(NewsService, $scope) {
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
				'print textcolor',
				"insertdatetime media table contextmenu paste"
		],
		toolbar: "insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image | forecolor | backcolor",
		skin: 'lightgray',
		theme : 'modern'
	};

	vm.tinymceOptionsComment = {
		menubar: false, 
		statusbar: false,
	};

	vm.posts = [];
	getNews();
	function getNews(){
		NewsService.getNews().then(function(data){
			vm.posts = data.slice(0,20);
					console.log(vm.posts);
		});
	}

	vm.editpost = function(newsId, newpost) {
			NewsService.editNews(newsId, newpost).then(function(){
			});
	};

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

	vm.newComment = function(commentText, newsId, index) {

		var comment = {
			author: vm.user,
			body: commentText,
			date: Date.parse(new Date()),
			likes: []
			};
			
			NewsService.addComment(newsId, comment).then(function(){
				vm.posts[index].comments.unshift(comment);
			});

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

}