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
			NewsService.editNews(newsId, newpost);
	};

	vm.createNews = function() {
		vm.news = {};
		if(vm.titleNews && vm.bodyNews){
			vm.news = {
				title: vm.titleNews,
				body: vm.bodyNews,
				date: Date.parse(new Date()),
				comments: [],
				likes: []
			};
		vm.titleNews = '';
		vm.bodyNews = '';
		vm.formView = true;
		}
		NewsService.createNews(vm.news);
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
		NewsService.addComment(newsId, comment);
		vm.commentForm[index] = false;
	};

	vm.deleteNews = function(newsId) {
		NewsService.deleteNews(newsId);
	};

	vm.deleteComment = function(newsId, commentId) {
		NewsService.deleteComment(newsId, commentId);
	};

	vm.newsLike = function(newsId, userId, index) {
		if(vm.posts[index].likes.indexOf(userId) < 0){
				NewsService.newsLike(newsId, userId);
			}else{
				NewsService.deleteNewsLike(newsId, userId);
		}
	};

	vm.commentLike = function(newsId, commentId, userId) {

		NewsService.comentLike(newsId, commentId, userId);
/*		var comLike = vm.posts[parentIndex].comments[index].likes;
		if(comLike.indexOf(vm.user) < 0){
			comLike.push(vm.user);
		}else{
			comLike.splice(comLike.indexOf(vm.user), 1);
		}*/
	};

}