var app = require('../app');

app.controller('NewsController', NewsController);
app.filter('unsafe', function($sce) { 
	return $sce.trustAsHtml; 
});

function NewsController() {

	var vm = this;
	
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

	vm.text = 'News';
	vm.user ='Viktoriya Voytyuk';

	vm.newsPosts=[{
		title: 'Camping',
		body: 'Camping is an elective outdoor recreational activity. Generally held, participants leave developed areas to spend time outdoors in more natural ones in pursuit of activities providing them enjoyment. To be regarded as "camping" a minimum of one night is spent outdoors, distinguishing it from day-tripping, picnicking, and other similarly short-term recreational activities',
		author: 'Nazar Dubas',
		date: '2015.08.23',
		likes: [
			'Veronica Shvets'
			],
		comments: [{
				author: 'Taras Zinkiv',
				text: 'Couldn\'t agree more, people who want to go camping in the UK are insane, those who want to do it abroad, the answer is simple',
				date: '2015.08.24',
				commentLikes:[
				'Luis Ving',
				'Jase Carm'
				]
			},
			{
				author: 'Anya Burshtyko',
				text: 'Sorry, you went camping for a second date?! I think there might be a clue to the cause of your problem there.',
				date: '2015.08.24',
				commentLikes:[
				'Luis Ving'
				]
			},
			{
				author: 'Anya Burshtyko',
				text: 'Sorry, you went camping for a second date?! I think there might be a clue to the cause of your problem there.',
				date: '2015.08.24',
				commentLikes:[
				'Luis Ving'
				]
			},
			{
				author: 'Anya Burshtyko',
				text: 'Sorry, you went camping for a second date?! I think there might be a clue to the cause of your problem there.',
				date: '2015.08.24',
				commentLikes:[
				'Luis Ving'
				]
			}]
		},
		{
		title: 'Club or open air?',
		body: 'If there is one message this blog supports it is the fact that Berlin has an awesome nightlife. In the monthly party-agenda you can find great parties in unique clubs and you have not been to Berlin if you did not visit a few of these famous places. But still there are a few obvious benefits for visiting an open-air instead of a club.' ,
		author: 'Taras Zinkiv',
		date: '2015.07.30',
		likes: [
			'Taras Zinkiv'
			],
		comments: []
		},
		{
			title: 'Vacation in spain',
			body: 'A single visit to Spain can result in many different experiences. Culture lovers and history buffs can be awed at more than 40 UNESCO World Heritage sites and more than 1,000 museums. Outdoor enthusiasts can walk, hike and golf their way across stunning landscapes. And foodies can get their fill of delectable regional cuisine paired with incomparable wines.' ,
			author: 'Veronica Shvets',
			date: '2015.07.06',
			likes: [
				'John Smith',
				'Luis Ving',
				'Jase Carm'
				],
			comments: [{
					author: 'Anya Burshtyko',
					text: 'I spent my weekend here, great seaview, exellent staff.',
					date: '2015.07.07',
					commentLikes: []
				}]
		},
		{
			title: 'Party',
			body: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nam reiciendis odio id commodi nihil tenetur, iure mollitia assumenda eius asperiores laborum culpa accusamus accusantium debitis, rem, magni quo omnis porro. Temporibus minus commodi accusantium at maiores illo optio deserunt rerum ducimus laudantium accusamus iusto, quis perspiciatis officiis natus porro ratione! ' ,
			author: 'Anya Burshtyko',
			date: '2015.07.11',
			likes: [
				'John Smith',
				'Mark Pol'
				],
			comments: []
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
			date: Date.parse(new Date()),
			commentLikes: []
		});
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

	vm.newsArr = function() {
		vm.posts = vm.newsPosts; 
	};


	vm.newsArr();

	vm.sandboxArr = function() {
		vm.posts = vm.sandPosts;
	};


vm.sandPosts=[{
		title: 'sandCamping',
		body: 'Camping is an elective outdoor recreational activity. Generally held, participants leave developed areas to spend time outdoors in more natural ones in pursuit of activities providing them enjoyment. To be regarded as "camping" a minimum of one night is spent outdoors, distinguishing it from day-tripping, picnicking, and other similarly short-term recreational activities',
		author: 'Nazar Dubas',
		date: '2015.08.23',
		likes: [
			'Veronica Shvets'
			],
		comments: [{
				author: 'Taras Zinkiv',
				text: 'Couldn\'t agree more, people who want to go camping in the UK are insane, those who want to do it abroad, the answer is simple',
				date: '2015.08.24',
				commentLikes:[
				'Luis Ving',
				'Jase Carm'
				]
			},
			{
				author: 'Anya Burshtyko',
				text: 'Sorry, you went camping for a second date?! I think there might be a clue to the cause of your problem there.',
				date: '2015.08.24',
				commentLikes:[
				'Luis Ving'
				]
			},
			{
				author: 'Anya Burshtyko',
				text: 'Sorry, you went camping for a second date?! I think there might be a clue to the cause of your problem there.',
				date: '2015.08.24',
				commentLikes:[
				'Luis Ving'
				]
			},
			{
				author: 'Anya Burshtyko',
				text: 'Sorry, you went camping for a second date?! I think there might be a clue to the cause of your problem there.',
				date: '2015.08.24',
				commentLikes:[
				'Luis Ving'
				]
			}]
		},
		{
		title: 'sandClub or open air?',
		body: 'If there is one message this blog supports it is the fact that Berlin has an awesome nightlife. In the monthly party-agenda you can find great parties in unique clubs and you have not been to Berlin if you did not visit a few of these famous places. But still there are a few obvious benefits for visiting an open-air instead of a club.' ,
		author: 'Taras Zinkiv',
		date: '2015.07.30',
		likes: [
			'Taras Zinkiv'
			],
		comments: []
		},
		{
			title: 'sandVacation in spain',
			body: 'A single visit to Spain can result in many different experiences. Culture lovers and history buffs can be awed at more than 40 UNESCO World Heritage sites and more than 1,000 museums. Outdoor enthusiasts can walk, hike and golf their way across stunning landscapes. And foodies can get their fill of delectable regional cuisine paired with incomparable wines.' ,
			author: 'Veronica Shvets',
			date: '2015.07.06',
			likes: [
				'John Smith',
				'Luis Ving',
				'Jase Carm'
				],
			comments: [{
					author: 'Anya Burshtyko',
					text: 'I spent my weekend here, great seaview, exellent staff.',
					date: '2015.07.07',
					commentLikes: []
				}]
		},
		{
			title: 'sandParty',
			body: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nam reiciendis odio id commodi nihil tenetur, iure mollitia assumenda eius asperiores laborum culpa accusamus accusantium debitis, rem, magni quo omnis porro. Temporibus minus commodi accusantium at maiores illo optio deserunt rerum ducimus laudantium accusamus iusto, quis perspiciatis officiis natus porro ratione! ' ,
			author: 'Anya Burshtyko',
			date: '2015.07.11',
			likes: [
				'John Smith',
				'Mark Pol'
				],
			comments: []
		}
	];


}