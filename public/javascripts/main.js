(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = angular.module('news', ['ngRoute', 'ngResource', 'ui.tinymce'])
	.config(['$routeProvider', '$resourceProvider', '$httpProvider', '$locationProvider',
		function($routeProvider, $resourceProvider, $httpProvider, $locationProvider) {
			$routeProvider
				.when('/', {
					templateUrl: './templates/news/news.html',
					controller: 'NewsController',
					controllerAs: 'newsCtrl'
				})
				.otherwise({
					redirectTo: '/'
				});
			$resourceProvider.defaults.stripTrailingSlashes = false;
		}
	]);
},{}],2:[function(require,module,exports){
var app = require('../app');
app.controller("HRController", HRController);

HRController.$inject = ["HRService"];

function HRController(HRService) {
	var vm = this;

	vm.activities = HRService.getActivities();
}
},{"../app":1}],3:[function(require,module,exports){
var app = require('../app');
app.directive("hrWidget", HRDirective);

function HRDirective() {
	return {
		restrict: "E",
		templateUrl: "./templates/hr-activity/HR.html",
		replace: true
	};
}
},{"../app":1}],4:[function(require,module,exports){
var app = require('../app');
app.factory("HRService", HRService);

function HRService() {
	return {
		getActivities: getActivities
	};

	function getActivities() {
		var activities = [
		{
			id: 1,
			message: "recruiter@local.com has joined Hunter",
			tag: 0,
			time: new Date("2015-08-10T00:00:00").toLocaleString(),
			url: "#/user/edit/1",
			userAlias: "HR3",
			userLogin: "recruiter2@local.com"
		},
		{
			id: 2,
			message: "someoneOther@global.net has left Hunter",
			tag: 0,
			time: new Date("2015-08-09T05:13:00").toLocaleString(),
			url: "#/user/edit/2",
			userAlias: "HR333",
			userLogin: "recruiter2@local.com"
		},
		{
			id: 3,
			message: "yetSomeOneNew@super.site has done something nice to everybody",
			tag: 0,
			time: new Date("2015-08-09T00:15:00").toLocaleString(),
			url: "#/user/edit/3",
			userAlias: "HR9000",
			userLogin: "recruiter2@local.com"
		}
		];
		return activities;
	}
}
},{"../app":1}],5:[function(require,module,exports){
var app = require('../app');

app.controller('NewsController', NewsController);

/*app.filter("sanitize", ['$sce', function($sce) {
	return function(htmlCode){
		return $sce.trustAsHtml(htmlCode);
	}
}]);*/
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

	vm.posts=[{
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

}
},{"../app":1}],6:[function(require,module,exports){
var app = require('../app');
app.controller("PollController", PollController);

PollController.$inject = ["PollService"];

function PollController(PollService) {
    var vm = this;

    vm.sections = [];
    vm.questions = [];
    vm.currentQuestion = {};
    vm.currentSection = {};
    var currentQuestionCounter = 0;
    var currentSectionCounter = 0;

    getQuestions();

    function getQuestions() {
        vm.sections = PollService.getQuestionnaire().template.sections;
        vm.currentSection = vm.sections[currentSectionCounter];
        vm.questions = vm.currentSection.questions;
        vm.currentQuestion = vm.questions[currentQuestionCounter];
    }

    vm.showResults = showResults;
    function showResults() {
        currentQuestionCounter++;
        if(currentQuestionCounter == vm.questions.length) {
            currentQuestionCounter = 0;
            currentSectionCounter++;
            if(currentSectionCounter == vm.sections.length) {
                currentSectionCounter = 0;
            }
            getQuestions();
        } else {
            vm.currentQuestion = vm.questions[currentQuestionCounter];
        }
    }
}
},{"../app":1}],7:[function(require,module,exports){
var app = require('../app');
app.directive("pollWidget", PollDirective);

function PollDirective() {
    return {
        restrict: "E",
        templateUrl: "./templates/poll/poll.html"
    };
}
},{"../app":1}],8:[function(require,module,exports){
var app = require('../app');
app.factory("PollService", PollService);

function PollService() {
    return {
        getQuestionnaire: getQuestionnaire
    };

    function getQuestionnaire() {
        var questionnaire = {
            dispatch: {
                _id: "55d5711c8d01336030c3703a",
                text: "Dear User,<br /><br />I've invited you to provide your feedback about User as part of a 360 degree feedback assessment. We are conducting the assessment online.<br /><br /><br />You can provide your feedback here: link<br /><br /><br />If you have any questions or concerns, please don't hesitate to contact me.<br /><br /><br />Thanks in advance,<br />HR<br />",
                link: "http://localhost:4099/#/shared/questionnaire/",
                templateId: "55c098338590f0743c1c95a4",
                type: "questionnaire",
                sendDate: "20/08/2015",
                isViewed: false,
                isAcceptance: false,
                __v: 0,
                sender: {
                    name: "HR",
                    email: "hr",
                    role: "HR"
                },
                user: {
                    email: "goncharuk.m.n@gmail.com"
                }
            },
            template: {
                _id: "55c098338590f0743c1c95a4",
                date: "04/08/2015",
                userEmail: "hr",
                name: "This is a title",
                __v: 0,
                sections: [{
                    name: "Planning",
                    _id: "55c5b35605f3a7d8543cb45e",
                    questions: [{
                        own: "",
                        name: "Have you ever seen this person communicating the task/problem with his/her team members to ensure understanding and agreement?",
                        type: "radio",
                        _id: "55c5b35605f3a7d8543cb467",
                        options: [{
                            text: "Yes",
                            _id: "55c5b35605f3a7d8543cb469"
                        }, {
                            text: "No",
                            _id: "55c5b35605f3a7d8543cb468"
                        }]
                    }, {
                        own: "",
                        name: "Breaks down tasks into manageable units",
                        type: "radio",
                        _id: "55c5b35605f3a7d8543cb462",
                        options: [{
                            text: "Sometimes",
                            _id: "55c5b35605f3a7d8543cb466"
                        }, {
                            text: "Often",
                            _id: "55c5b35605f3a7d8543cb465"
                        }, {
                            text: "Very rarely",
                            _id: "55c5b35605f3a7d8543cb464"
                        }, {
                            text: "Never",
                            _id: "55c5b35605f3a7d8543cb463"
                        }]
                    }, {
                        own: "",
                        name: "Effective at managing their time, taking on an appropriate workload and providing sensible estimates.",
                        type: "radio",
                        _id: "55c5b35605f3a7d8543cb45f",
                        options: [{
                            text: "Yes",
                            _id: "55c5b35605f3a7d8543cb461"
                        }, {
                            text: "No",
                            _id: "55c5b35605f3a7d8543cb460"
                        }]
                    }]
                }, {
                    name: "Delivering",
                    _id: "55c5b35605f3a7d8543cb45c",
                    questions: [{
                        own: "",
                        name: "Productive both when working alone and in groups?",
                        type: "text",
                        _id: "55c5b35605f3a7d8543cb45d",
                        options: []
                    }]
                }],
                testee: {
                    name: "User",
                    email: "user@mail.com",
                    userId: "558d3689d5d7f18c1185d9a3",
                    role: "User"
                }
            }
        };
        return questionnaire;
    }
}
},{"../app":1}],9:[function(require,module,exports){
var app = require('../app');
app.controller("VoteFormController", VoteFormController);

function VoteFormController() {
    var vm = this;
    vm.vote = {};
    vm.sendVote = sendVote;

    function sendVote() {

    }
}
},{"../app":1}]},{},[1,2,3,4,5,6,7,8,9]);
