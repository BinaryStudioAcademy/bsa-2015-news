var app = require('../app');

app.controller('NewsController', NewsController);

function NewsController() {

	var vm = this;

	vm.text = 'News';
	vm.user ='Mike Ross';

	vm.posts=[{
		title: 'Apple',
		body: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nam reiciendis odio id commodi nihil tenetur, iure mollitia assumenda eius asperiores laborum culpa accusamus accusantium debitis, rem, magni quo omnis porro. Temporibus minus commodi accusantium at maiores illo optio deserunt rerum ducimus laudantium accusamus iusto, quis perspiciatis officiis natus porro ratione!' ,
		author: 'Donald Tramp',
		date: '2015.11.20',
		likes: [
			'Jon Smith'
			],
		comments: [{
				author: 'Bill Jon',
				text: 'consectetur adipisicing elit.',
				date: '1900.12.23'
			},
			{
				author: 'Poll Mc',
				text: 'consectetur adipisicing elit.',
				date: '1909.11.03'
			}]
		},
		{
		title: 'Banana',
		body: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit.' ,
		author: 'Donald Tramp',
		date: '2014.12.30',
		likes: [
			'Jon Smith'
			],
		comments: []
		},
		{
			title: 'Cherry',
			body: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nam reiciendis odio id commodi nihil tenetur, iure mollitia assumenda eius asperiores laborum culpa accusamus accusantium debitis, rem, magni quo omnis porro. Temporibus minus commodi accusantium at maiores illo optio deserunt rerum ducimus laudantium accusamus iusto, quis perspiciatis officiis natus porro ratione! ' ,
			author: 'Donald Tramp',
			date: '2014.8.21',
			likes: [
				'Jon Smith',
				'Mark Pol'
				],
			comments: []
		},
		{
			title: 'Berry',
			body: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nam reiciendis odio id commodi nihil tenetur, iure mollitia assumenda eius asperiores laborum culpa accusamus accusantium debitis, rem, magni quo omnis porro. Temporibus minus commodi accusantium at maiores illo optio deserunt rerum ducimus laudantium accusamus iusto, quis perspiciatis officiis natus porro ratione! ' ,
			author: 'Donald Tramp',
			date: '2014.8.21',
			likes: [
				'Jon Smith',
				'Luis Ving',
				'Jase Carm'
				],
			comments: [{
					author: 'Poll Mc',
					text: 'consectetur adipisicing elit.',
					date: '1909.11.03'
				}]
		}
	];

	vm.formView = true;
	vm.toggleForm = function() {
		vm.formView = !vm.formView;
	};

	vm.createNews = function() {
		if(vm.titleNews && vm.bodyNews){
			vm.posts.unshift({
				title: vm.titleNews,
				body: vm.bodyNews,
				author: vm.user,
				date: Date.parse(new Date()),
				comments: [],
				likes: []
			});
		}
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


	vm.deleteNews = function(index) {
		vm.posts.splice(index, 1);
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

	vm.newComment = function(index) {
		vm.posts[index].comments.unshift({
			author: vm.user,
			text: vm.commentText[index],
			date: Date.parse(new Date())
		});
		vm.commentText[index] = '';
		vm.commentsViev[index] = true;
	};

	vm.deleteComment = function(parentIndex, index) {
		vm.posts[parentIndex].comments.splice(index, 1);
	};


}