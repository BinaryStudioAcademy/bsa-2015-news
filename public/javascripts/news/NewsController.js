var app = require('../app');

app.controller('NewsController', NewsController);
app.filter('unsafe', function($sce) { 
	return $sce.trustAsHtml; 
});

NewsController.$inject = ['NewsService'];

function NewsController(NewsService) {
	var vm = this;
	vm.text = 'News';
	vm.formView = true;
	vm.user ={
		_id: "1111111111",
		name:'Viktoriya Voytyuk',
		//login: 'voytuk@voytuk'
	};

	vm.tinymceOptions = {
		inline: false,
/*		plugins: [
				"advlist autolink lists link image charmap print preview anchor",
				"searchreplace visualblocks code fullscreen",
				"insertdatetime media table contextmenu paste"
		],
		toolbar: "insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image",*/
		skin: 'lightgray',
		theme : 'modern'
	};

	vm.posts = [];
	getNews();
	function getNews(){
		NewsService.getNews().then(function(data){
			vm.posts = data.slice(0,20);
		});
	}

	vm.createNews = function() {
		vm.news = {};
		if(vm.titleNews && vm.bodyNews){
			vm.news = {
				title: vm.titleNews,
				body: vm.bodyNews,
				//author: vm.user._id,
				date: Date.parse(new Date()),
				comments: [],
				likes: []
			};
		}
		console.log(vm.news);
		NewsService.createNews(vm.news).then(function() {
			getNews();
		});
		vm.formView = true;
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
		console.log(newsId);
		 vm.posts[index].comments.unshift({
		 	_id: '11273832qq',
			author: vm.user,
			body: vm.commentText[index],
			date: Date.parse(new Date()),
			commentLikes: []
		});
console.log(vm.posts);
/*		NewsService.editNews(newsId, vm.comments).then(function(){
			getNews();
			console.log(vm.posts[index].comments);
		});*/

		vm.commentText[index] = '';
		vm.commentForm[index] = false;
	};

	vm.deleteComment = function(parentIndex, index) {

		vm.posts[parentIndex].comments.splice(index, 1);
	};

	vm.commentLike = function(parentIndex, index) {
		var comLike = vm.posts[parentIndex].comments[index].commentLikes;
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





}