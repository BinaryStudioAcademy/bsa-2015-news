(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = angular.module('news', ['ngRoute', 'ngResource', 'ui.tinymce','ngMaterial'])
	.config(['$routeProvider', '$resourceProvider', '$httpProvider', '$locationProvider', '$mdThemingProvider',
		function($routeProvider, $resourceProvider, $httpProvider, $locationProvider, $mdThemingProvider) {
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
			$mdThemingProvider.theme('reviewWidget')
				.primaryPalette('orange', {
					'default': '800'
				});
			$mdThemingProvider.theme('hrWidget')
				.primaryPalette('teal', {
					'default': '800'
				});
			$mdThemingProvider.theme('addExpenseWidget')
				.primaryPalette('green', {
					'default': '800'
				});
			$mdThemingProvider.theme('pollWidget')
				.primaryPalette('indigo', {
					'default': '800'
				});
			// Приклад теми:
			//$mdThemingProvider.theme('default')
			//	.primaryPalette('blue')
			//	.accentPalette('indigo')
			//	.warnPalette('red')
			//	.backgroundPalette('grey');
		}
	]);
},{}],2:[function(require,module,exports){
var app = require('../app');
app.controller("ReviewController", ReviewController);

ReviewController.$inject = ["ReviewService"];

function ReviewController(ReviewService) {
	var vm = this;

	//ReviewService.getPopular().then(function(data) {
	//	vm.popular = data;
	//});
	vm.periods = [
	{
		value: 'today',
		text: 'Upcoming today'
	},
	{
		value: 'week',
		text: 'Upcoming this week'
	},
	{
		value: 'month',
		text: 'Upcoming this month'
	}
	];
	vm.period = vm.periods[0];

	vm.upcoming = ReviewService.getPopular();
	vm.upcoming.week = vm.upcoming.month.slice(0, 5);
	vm.upcoming.today = vm.upcoming.month.slice(0, 2);
}
},{"../app":1}],3:[function(require,module,exports){
var app = require('../app');
app.directive("codeReviewWidget", ReviewDirective);

function ReviewDirective() {
	return {
		restrict: "E",
		templateUrl: "./templates/code-review/Review.html",
		replace: true
	};
}
},{"../app":1}],4:[function(require,module,exports){
var app = require('../app');
app.factory("ReviewService", ReviewService);

ReviewService.$inject = ["$resource"];

function ReviewService($resource) {
	return {
		getPopular: getPopular
	};

	function getPopular() {
		//return $resource("http://team.binary-studio.com/reviewr/api/v1/reviewrequest/popular").query().$promise;
		return {month: [{"id":"1","title":"Animi et et sed.","details":"I beat him when he sneezes; For he can EVEN finish, if he doesn't begin.' But she waited for a great letter, nearly as large as the jury eagerly wrote down on one side, to look over their heads. She felt that she began looking at it uneasily, shaking it every now and then; such as, 'Sure, I don't like the Queen?' said the Footman, and began picking them up again as she could, 'If you please, sir--' The Rabbit started violently, dropped the white kid gloves: she took up the other, looking uneasily at the thought that it was all dark overhead; before her was another puzzling question; and as the door as you are; secondly, because they're making such a dreadful time.' So Alice began to say 'I once tasted--' but checked herself hastily. 'I don't see,' said the Mock Turtle is.' 'It's the thing at all. However, 'jury-men' would have this cat removed!' The Queen turned angrily away from her as she did not venture to go down the middle, being held up by wild beasts and other unpleasant.","reputation":"4","date_review":"2015-08-28 08:31:36","created_at":"2015-08-27 09:37:34","user_id":"15","group_id":"1","offers_count":5,"user":{"id":"15","first_name":"Manley","last_name":"Daniel","email":"Jerald.Padberg@gmail.com","phone":"1-214-141-2119x6695","avatar":"http:\/\/www.gravatar.com\/avatar\/9ee0025dd1004d2c056f4d062c3da206?d=identicon","address":"79903 Trantow Radial Suite 284\nHaleyport, MI 23822","reputation":"5","job_id":"9","department_id":"3"},"group":{"id":"1","title":"PHP"}},{"id":"2","title":"Id dicta non qui id.","details":"Dinah, and saying \"Come up again, dear!\" I shall have to turn round on its axis--' 'Talking of axes,' said the Mock Turtle replied; 'and then the Rabbit's voice; and Alice heard the Queen merely remarking as it can talk: at any rate he might answer questions.--How am I to do so. 'Shall we try another figure of the doors of the Queen's ears--' the Rabbit was no 'One, two, three, and away,' but they were nice grand words to say.) Presently she began thinking over other children she knew, who might do something better with the Duchess, 'chop off her unfortunate guests to execution--once more the pig-baby was sneezing and howling alternately without a porpoise.' 'Wouldn't it really?' said Alice in a natural way again. 'I wonder what CAN have happened to me! When I used to come out among the leaves, which she found to be a person of authority among them, called out, 'First witness!' The first witness was the matter worse. You MUST have meant some mischief, or else you'd have signed your.","reputation":"4","date_review":"2015-08-30 11:56:43","created_at":"2015-08-27 09:37:34","user_id":"15","group_id":"1","offers_count":5,"user":{"id":"15","first_name":"Manley","last_name":"Daniel","email":"Jerald.Padberg@gmail.com","phone":"1-214-141-2119x6695","avatar":"http:\/\/www.gravatar.com\/avatar\/9ee0025dd1004d2c056f4d062c3da206?d=identicon","address":"79903 Trantow Radial Suite 284\nHaleyport, MI 23822","reputation":"5","job_id":"9","department_id":"3"},"group":{"id":"1","title":"PHP"}},{"id":"3","title":"Qui eligendi ut in cum.","details":"Lory. Alice replied in an offended tone, 'so I can't get out again. That's all.' 'Thank you,' said the March Hare. 'Sixteenth,' added the March Hare will be the right height to rest herself, and once again the tiny hands were clasped upon her knee, and looking at the Gryphon went on, spreading out the words: 'Where's the other birds tittered audibly. 'What I was sent for.' 'You ought to be managed? I suppose you'll be asleep again before it's done.' 'Once upon a little quicker. 'What a curious croquet-ground in her French lesson-book. The Mouse only shook its head impatiently, and said, 'It was the BEST butter, you know.' Alice had no idea what a long sleep you've had!' 'Oh, I've had such a thing before, and behind them a railway station.) However, she got up, and there was a queer-shaped little creature, and held out its arms and frowning at the picture.) 'Up, lazy thing!' said the Hatter. 'I deny it!' said the Duck: 'it's generally a ridge or furrow in the middle of one! There.","reputation":"4","date_review":"2015-09-02 22:26:44","created_at":"2015-08-27 09:37:34","user_id":"3","group_id":"2","offers_count":5,"user":{"id":"3","first_name":"Alexey","last_name":"Tsinya","email":"tsinya.alexey@gmail.com","phone":"1-743-660-6778","avatar":"http:\/\/www.gravatar.com\/avatar\/96a98b10bcb7b48d62def0ff8b424a96?d=identicon","address":"06841 Eudora Extensions\nGrimesport, ME 89049","reputation":"4","job_id":"2","department_id":"3"},"group":{"id":"2","title":"JS"}},{"id":"4","title":"Et qui ut et.","details":"I hadn't cried so much!' Alas! it was just saying to herself 'This is Bill,' she gave one sharp kick, and waited till she got into it), and sometimes she scolded herself so severely as to the waving of the sort,' said the Dormouse shook its head impatiently, and walked two and two, as the jury wrote it down into a cucumber-frame, or something of the leaves: 'I should have liked teaching it tricks very much, if--if I'd only been the whiting,' said Alice, (she had kept a piece of it now in sight, and no room at all a pity. I said \"What for?\"' 'She boxed the Queen's shrill cries to the shore. CHAPTER III. A Caucus-Race and a bright brass plate with the game,' the Queen had ordered. They very soon had to ask help of any one; so, when the tide rises and sharks are around, His voice has a timid and tremulous sound.] 'That's different from what I could shut up like a steam-engine when she had never seen such a thing before, and behind it, it occurred to her usual height. It was opened by.","reputation":"9","date_review":"2015-09-04 00:31:14","created_at":"2015-08-27 09:37:34","user_id":"14","group_id":"2","offers_count":5,"user":{"id":"14","first_name":"Terrence","last_name":"Muller","email":"jSchuster@yahoo.com","phone":"(529)976-6796","avatar":"http:\/\/www.gravatar.com\/avatar\/c3b6bb032baa6b93c319e6ae5d797afb?d=identicon","address":"11789 Labadie Walks\nAnastasiastad, NC 60245-2197","reputation":"3","job_id":"11","department_id":"2"},"group":{"id":"2","title":"JS"}},{"id":"5","title":"Et quae dolor eos aut.","details":"And she kept tossing the baby at her for a rabbit! I suppose I ought to have him with them,' the Mock Turtle, 'they--you've seen them, of course?' 'Yes,' said Alice angrily. 'It wasn't very civil of you to offer it,' said Alice, very much pleased at having found out that the poor little thing grunted in reply (it had left off quarrelling with the other: the only difficulty was, that anything that looked like the Mock Turtle Soup is made from,' said the Duchess; 'and the moral of that is, but I THINK I can do without lobsters, you know. Come on!' So they sat down a large mushroom growing near her, about four feet high. 'I wish the creatures argue. It's enough to get very tired of swimming about here, O Mouse!' (Alice thought this must ever be A secret, kept from all the rats and--oh dear!' cried Alice (she was rather glad there WAS no one could possibly hear you.' And certainly there was generally a frog or a watch to take the place of the bread-and-butter. Just at this corner--No,.","reputation":"3","date_review":"2015-09-02 01:22:00","created_at":"2015-08-27 09:37:34","user_id":"8","group_id":"1","offers_count":5,"user":{"id":"8","first_name":"Gia","last_name":"Macejkovic","email":"Delaney67@gmail.com","phone":"(839)464-5945x801","avatar":"http:\/\/www.gravatar.com\/avatar\/b14f61a7d98fdc25b8b3db788f5dece6?d=identicon","address":"040 O'Kon Via Suite 725\nZellafort, WA 26765","reputation":"1","job_id":"15","department_id":"4"},"group":{"id":"1","title":"PHP"}},{"id":"6","title":"Aspernatur nihil cum ut.","details":"I to do such a fall as this, I shall have some fun now!' thought Alice. 'I don't believe it,' said the Caterpillar. 'Well, I can't put it more clearly,' Alice replied very politely, 'if I had it written down: but I THINK I can reach the key; and if it had come back in a hot tureen! Who for such a subject! Our family always HATED cats: nasty, low, vulgar things! Don't let him know she liked them best, For this must ever be A secret, kept from all the creatures argue. It's enough to look at the Mouse's tail; 'but why do you mean \"purpose\"?' said Alice. 'What IS the use of a globe of goldfish she had quite forgotten the little golden key in the pictures of him), while the Mock Turtle. 'Hold your tongue!' said the Mock Turtle in a few yards off. The Cat seemed to be in before the trial's over!' thought Alice. 'I've read that in the trial one way of expecting nothing but out-of-the-way things to happen, that it had VERY long claws and a large plate came skimming out, straight at the other.","reputation":"3","date_review":"2015-09-07 14:23:17","created_at":"2015-08-27 09:37:34","user_id":"16","group_id":"1","offers_count":5,"user":{"id":"16","first_name":"Clemmie","last_name":"Steuber","email":"Elliott.Boyer@Hermann.biz","phone":"1-706-786-1501","avatar":"http:\/\/www.gravatar.com\/avatar\/c126352a418065d49740bfdfcc1e36c1?d=identicon","address":"7089 Gabrielle Neck Suite 631\nKundeberg, MN 56900-3995","reputation":"8","job_id":"15","department_id":"10"},"group":{"id":"1","title":"PHP"}},{"id":"7","title":"Provident ut et ducimus.","details":"Hatter began, in rather a complaining tone, 'and they all crowded round it, panting, and asking, 'But who has won?' This question the Dodo replied very solemnly. Alice was rather glad there WAS no one to listen to me! When I used to do:-- 'How doth the little thing sat down a very deep well. Either the well was very nearly getting up and leave the court; but on the bank--the birds with draggled feathers, the animals with their fur clinging close to her, so she took courage, and went on at last, and they sat down at once, and ran off, thinking while she ran, as well go back, and see how he can EVEN finish, if he thought it had VERY long claws and a fall, and a sad tale!' said the Hatter, and, just as well wait, as she was playing against herself, for this curious child was very nearly in the house, and wondering what to do it.' (And, as you might knock, and I could show you our cat Dinah: I think that will be the right word) '--but I shall have to go with the bread-knife.' The March.","reputation":"8","date_review":"2015-09-02 15:46:58","created_at":"2015-08-27 09:37:34","user_id":"5","group_id":"2","offers_count":5,"user":{"id":"5","first_name":"Vladimir","last_name":"Cherniuk","email":"reegerye@gmail.com","phone":"922.341.3668","avatar":"http:\/\/www.gravatar.com\/avatar\/47ac9869f76270a4e8571a8af420b8d5?d=identicon","address":"563 Harvey Islands Suite 434\nGradychester, IA 38173-4839","reputation":"1","job_id":"10","department_id":"4"},"group":{"id":"2","title":"JS"}},{"id":"8","title":"Non nulla cum vel.","details":"Alice cautiously replied, not feeling at all a proper way of escape, and wondering whether she could do, lying down with one elbow against the ceiling, and had to kneel down on one side, to look at them--'I wish they'd get the trial done,' she thought, 'it's sure to happen,' she said to herself 'It's the oldest rule in the night? Let me see: four times seven is--oh dear! I wish you would have called him Tortoise because he was gone, and the March Hare had just begun 'Well, of all her fancy, that: they never executes nobody, you know. So you see, Miss, we're doing our best, afore she comes, to--' At this moment Five, who had followed him into the roof off.' After a minute or two, and the little golden key was too much pepper in that case I can guess that,' she added in an offended tone, 'Hm! No accounting for tastes! Sing her \"Turtle Soup,\" will you, old fellow?' The Mock Turtle with a sigh. 'I only took the least notice of her own mind (as well as if she was peering about anxiously.","reputation":"4","date_review":"2015-08-30 11:46:24","created_at":"2015-08-27 09:37:34","user_id":"10","group_id":"3","offers_count":5,"user":{"id":"10","first_name":"Dallas","last_name":"Feil","email":"dKemmer@Sanford.biz","phone":"426-304-2652","avatar":"http:\/\/www.gravatar.com\/avatar\/25ac0b530eb08f40a489de55568a1def?d=identicon","address":"1199 Willis Estates\nSouth Kamrynhaven, MN 19886","reputation":"2","job_id":"11","department_id":"7"},"group":{"id":"3","title":".Net"}},{"id":"9","title":"Magnam in neque quia.","details":"Alice, 'and if it makes me grow larger, I can kick a little!' She drew her foot slipped, and in despair she put it. She stretched herself up and down looking for them, but they began running when they met in the last words out loud, and the Dormouse indignantly. However, he consented to go among mad people,' Alice remarked. 'Oh, you foolish Alice!' she answered herself. 'How can you learn lessons in the act of crawling away: besides all this, there was no time to go, for the end of the court, without even waiting to put the Dormouse shook itself, and began by producing from under his arm a great thistle, to keep back the wandering hair that curled all over with William the Conqueror.' (For, with all speed back to the Hatter. 'Nor I,' said the Mouse. '--I proceed. \"Edwin and Morcar, the earls of Mercia and Northumbria--\"' 'Ugh!' said the Lory hastily. 'I thought you did,' said the Mock Turtle: 'crumbs would all come wrong, and she very soon finished off the cake. * * * 'What a number.","reputation":"3","date_review":"2015-09-04 21:12:31","created_at":"2015-08-27 09:37:34","user_id":"8","group_id":"2","offers_count":5,"user":{"id":"8","first_name":"Gia","last_name":"Macejkovic","email":"Delaney67@gmail.com","phone":"(839)464-5945x801","avatar":"http:\/\/www.gravatar.com\/avatar\/b14f61a7d98fdc25b8b3db788f5dece6?d=identicon","address":"040 O'Kon Via Suite 725\nZellafort, WA 26765","reputation":"1","job_id":"15","department_id":"4"},"group":{"id":"2","title":"JS"}},{"id":"10","title":"Qui ad ut ut.","details":"Hatter were having tea at it: a Dormouse was sitting between them, fast asleep, and the moon, and memory, and muchness--you know you say things are worse than ever,' thought the poor child, 'for I can't show it you myself,' the Mock Turtle. Alice was silent. The Dormouse again took a minute or two, they began running about in all my limbs very supple By the time she saw them, they were all talking at once, while all the rest, Between yourself and me.' 'That's the reason so many different sizes in a whisper, half afraid that she did not venture to say it over) '--yes, that's about the games now.' CHAPTER X. The Lobster Quadrille is!' 'No, indeed,' said Alice. 'Anything you like,' said the Pigeon; 'but I must have a prize herself, you know,' said the Queen, pointing to Alice with one of the Mock Turtle sang this, very slowly and sadly:-- '\"Will you walk a little way out of a sea of green leaves that lay far below her. 'What CAN all that stuff,' the Mock Turtle persisted. 'How COULD he.","reputation":"7","date_review":"2015-08-30 11:16:58","created_at":"2015-08-27 09:37:34","user_id":"10","group_id":"2","offers_count":5,"user":{"id":"10","first_name":"Dallas","last_name":"Feil","email":"dKemmer@Sanford.biz","phone":"426-304-2652","avatar":"http:\/\/www.gravatar.com\/avatar\/25ac0b530eb08f40a489de55568a1def?d=identicon","address":"1199 Willis Estates\nSouth Kamrynhaven, MN 19886","reputation":"2","job_id":"11","department_id":"7"},"group":{"id":"2","title":"JS"}},{"id":"12","title":"Eius qui illo enim.","details":"Queen. 'Never!' said the Duchess, 'and that's the jury-box,' thought Alice, as she spoke. 'I must go and get ready to sink into the court, she said to live. 'I've seen hatters before,' she said to herself, 'Which way? Which way?', holding her hand again, and looking anxiously about as curious as it turned a corner, 'Oh my ears and whiskers, how late it's getting!' She was moving them about as it went, as if she could see this, as she swam lazily about in all directions, 'just like a Jack-in-the-box, and up the fan and two or three times over to the Gryphon. 'Of course,' the Gryphon went on. 'Or would you tell me,' said Alice, who had meanwhile been examining the roses. 'Off with his tea spoon at the stick, running a very little use, as it spoke. 'As wet as ever,' said Alice doubtfully: 'it means--to--make--anything--prettier.' 'Well, then,' the Gryphon in an offended tone. And the Eaglet bent down its head to feel a little of the house till she was coming back to them, and the moon,.","reputation":"6","date_review":"2015-08-29 05:45:47","created_at":"2015-08-27 09:37:34","user_id":"1","group_id":"2","offers_count":0,"user":{"id":"1","first_name":"Alex","last_name":"Adminov","email":"admin@email.com","phone":"(890)981-4737x1713","avatar":"http:\/\/www.gravatar.com\/avatar\/2e87afc649ae03f501db282096504cf2?d=identicon","address":"09510 Lind Forks\nNorth Elmore, CA 37921","reputation":"5","job_id":"10","department_id":"2"},"group":{"id":"2","title":"JS"}},{"id":"13","title":"Debitis sit sunt et.","details":"There was a general chorus of 'There goes Bill!' then the different branches of Arithmetic--Ambition, Distraction, Uglification, and Derision.' 'I never went to him,' the Mock Turtle. Alice was rather doubtful whether she could not join the dance?\"' 'Thank you, it's a set of verses.' 'Are they in the court!' and the second time round, she came upon a heap of sticks and dry leaves, and the Mock Turtle said with some severity; 'it's very easy to know your history, you know,' Alice gently remarked; 'they'd have been a holiday?' 'Of course it is,' said the Hatter; 'so I should like to be treated with respect. 'Cheshire Puss,' she began, in a thick wood. 'The first thing I've got to come before that!' 'Call the next moment she appeared; but she added, 'and the moral of THAT is--\"Take care of themselves.\"' 'How fond she is such a subject! Our family always HATED cats: nasty, low, vulgar things! Don't let him know she liked them best, For this must ever be A secret, kept from all the jurors.","reputation":"9","date_review":"2015-09-05 18:12:32","created_at":"2015-08-27 09:37:34","user_id":"12","group_id":"1","offers_count":0,"user":{"id":"12","first_name":"Imelda","last_name":"Collier","email":"Metz.Iva@Hettinger.com","phone":"(808)887-6093x9788","avatar":"http:\/\/www.gravatar.com\/avatar\/44c7731097b304064b4336dce6e2e9ea?d=identicon","address":"5617 Dayna Trail\nSouth Ivah, CA 38060","reputation":"7","job_id":"19","department_id":"7"},"group":{"id":"1","title":"PHP"}},{"id":"14","title":"Quia nam officiis aut.","details":"This sounded promising, certainly: Alice turned and came flying down upon her: she gave her answer. 'They're done with a sigh: 'it's always tea-time, and we've no time she'd have everybody executed, all round. (It was this last remark, 'it's a vegetable. It doesn't look like one, but the Hatter grumbled: 'you shouldn't have put it into one of the door of the ground--and I should frighten them out again. The rabbit-hole went straight on like a steam-engine when she went on: '--that begins with a trumpet in one hand and a Dodo, a Lory and an old conger-eel, that used to say it out to sea as you are; secondly, because they're making such VERY short remarks, and she went on muttering over the verses to himself: '\"WE KNOW IT TO BE TRUE--\" that's the jury-box,' thought Alice, 'to pretend to be ashamed of yourself for asking such a new idea to Alice, 'Have you seen the Mock Turtle; 'but it doesn't matter which way she put her hand again, and she had looked under it, and behind it when she.","reputation":"3","date_review":"2015-09-04 05:07:34","created_at":"2015-08-27 09:37:34","user_id":"6","group_id":"1","offers_count":0,"user":{"id":"6","first_name":"Alexey","last_name":"Vdovichenko","email":"alexey.vdovichenko@binary-studio.com","phone":"362.672.6676","avatar":"http:\/\/www.gravatar.com\/avatar\/410f8c0a16485fa77ff9369039454fe8?d=identicon","address":"223 Turcotte River Apt. 043\nLake Graycestad, ND 65284","reputation":"2","job_id":"18","department_id":"1"},"group":{"id":"1","title":"PHP"}},{"id":"15","title":"Eum earum totam minus.","details":"The Gryphon lifted up both its paws in surprise. 'What! Never heard of \"Uglification,\"' Alice ventured to taste it, and then turned to the heads of the trial.' 'Stupid things!' Alice thought the poor little thing howled so, that Alice had begun to think that will be much the same thing as \"I get what I get\" is the reason and all that,' he said in a sulky tone, as it was sneezing on the ground near the King say in a long, low hall, which was a large mushroom growing near her, about four feet high. 'I wish I hadn't cried so much!' Alas! it was a most extraordinary noise going on shrinking rapidly: she soon found herself in a very deep well. Either the well was very uncomfortable, and, as they came nearer, Alice could only see her. She is such a nice soft thing to get out at all comfortable, and it set to partners--' '--change lobsters, and retire in same order,' continued the Gryphon. 'Turn a somersault in the distance. 'And yet what a delightful thing a Lobster Quadrille The Mock.","reputation":"7","date_review":"2015-09-04 07:21:02","created_at":"2015-08-27 09:37:34","user_id":"12","group_id":"2","offers_count":0,"user":{"id":"12","first_name":"Imelda","last_name":"Collier","email":"Metz.Iva@Hettinger.com","phone":"(808)887-6093x9788","avatar":"http:\/\/www.gravatar.com\/avatar\/44c7731097b304064b4336dce6e2e9ea?d=identicon","address":"5617 Dayna Trail\nSouth Ivah, CA 38060","reputation":"7","job_id":"19","department_id":"7"},"group":{"id":"2","title":"JS"}},{"id":"16","title":"Enim qui mollitia nam.","details":"By the time he was in the air. Even the Duchess was VERY ugly; and secondly, because she was to get in?' 'There might be some sense in your pocket?' he went on, looking anxiously about as it went, as if she were saying lessons, and began by producing from under his arm a great many more than nine feet high, and her face brightened up at the corners: next the ten courtiers; these were ornamented all over crumbs.' 'You're wrong about the games now.' CHAPTER X. The Lobster Quadrille The Mock Turtle would be QUITE as much as she stood still where she was, and waited. When the sands are all dry, he is gay as a drawing of a tree a few minutes it puffed away without being seen, when she looked up, and reduced the answer to it?' said the Hatter. He came in sight of the Lobster Quadrille?' the Gryphon only answered 'Come on!' and ran till she fancied she heard the Queen till she fancied she heard it say to itself, half to itself, 'Oh dear! Oh dear! I shall have some fun now!' thought Alice..","reputation":"8","date_review":"2015-09-03 18:20:17","created_at":"2015-08-27 09:37:34","user_id":"15","group_id":"3","offers_count":0,"user":{"id":"15","first_name":"Manley","last_name":"Daniel","email":"Jerald.Padberg@gmail.com","phone":"1-214-141-2119x6695","avatar":"http:\/\/www.gravatar.com\/avatar\/9ee0025dd1004d2c056f4d062c3da206?d=identicon","address":"79903 Trantow Radial Suite 284\nHaleyport, MI 23822","reputation":"5","job_id":"9","department_id":"3"},"group":{"id":"3","title":".Net"}},{"id":"17","title":"Animi totam sed maiores.","details":"Fainting in Coils.' 'What was THAT like?' said Alice. 'I've read that in the pool of tears which she had accidentally upset the milk-jug into his plate. Alice did not quite know what \"it\" means well enough, when I learn music.' 'Ah! that accounts for it,' said Alice. 'I've tried the effect of lying down with one eye, How the Owl and the turtles all advance! They are waiting on the bank--the birds with draggled feathers, the animals with their fur clinging close to them, and all that,' he said do. Alice looked up, but it was in confusion, getting the Dormouse crossed the court, she said to herself, in a helpless sort of people live about here?' 'In THAT direction,' the Cat remarked. 'Don't be impertinent,' said the Hatter, 'or you'll be asleep again before it's done.' 'Once upon a low voice, 'Why the fact is, you know. Which shall sing?' 'Oh, YOU sing,' said the Hatter. 'Nor I,' said the Gryphon: and it was as much as she could get away without speaking, but at any rate I'll never go.","reputation":"3","date_review":"2015-09-09 18:49:59","created_at":"2015-08-27 09:37:34","user_id":"12","group_id":"3","offers_count":0,"user":{"id":"12","first_name":"Imelda","last_name":"Collier","email":"Metz.Iva@Hettinger.com","phone":"(808)887-6093x9788","avatar":"http:\/\/www.gravatar.com\/avatar\/44c7731097b304064b4336dce6e2e9ea?d=identicon","address":"5617 Dayna Trail\nSouth Ivah, CA 38060","reputation":"7","job_id":"19","department_id":"7"},"group":{"id":"3","title":".Net"}},{"id":"18","title":"Pariatur et vel et esse.","details":"Alice like the tone of great curiosity. 'It's a friend of mine--a Cheshire Cat,' said Alice: 'I don't know the song, she kept fanning herself all the children she knew the meaning of it at all. However, 'jury-men' would have appeared to them she heard the King triumphantly, pointing to the croquet-ground. The other guests had taken advantage of the Gryphon, and the great puzzle!' And she tried another question. 'What sort of life! I do it again and again.' 'You are all pardoned.' 'Come, THAT'S a good many voices all talking together: she made some tarts, All on a summer day: The Knave did so, very carefully, nibbling first at one and then unrolled the parchment scroll, and read out from his book, 'Rule Forty-two. ALL PERSONS MORE THAN A MILE HIGH TO LEAVE THE COURT.' Everybody looked at the Caterpillar's making such a capital one for catching mice--oh, I beg your pardon!' said the King. 'When did you manage to do this, so that her shoulders were nowhere to be rude, so she went on. 'I.","reputation":"6","date_review":"2015-08-29 13:02:19","created_at":"2015-08-27 09:37:34","user_id":"8","group_id":"3","offers_count":0,"user":{"id":"8","first_name":"Gia","last_name":"Macejkovic","email":"Delaney67@gmail.com","phone":"(839)464-5945x801","avatar":"http:\/\/www.gravatar.com\/avatar\/b14f61a7d98fdc25b8b3db788f5dece6?d=identicon","address":"040 O'Kon Via Suite 725\nZellafort, WA 26765","reputation":"1","job_id":"15","department_id":"4"},"group":{"id":"3","title":".Net"}},{"id":"19","title":"Esse animi quisquam non.","details":"Alice; not that she looked up and throw us, with the words all coming different, and then another confusion of voices--'Hold up his head--Brandy now--Don't choke him--How was it, old fellow? What happened to me! I'LL soon make you grow shorter.' 'One side will make you grow shorter.' 'One side will make you grow taller, and the soldiers shouted in reply. 'Please come back again, and put it in a large ring, with the other bit. Her chin was pressed hard against it, that attempt proved a failure. Alice heard the Queen jumped up in a few minutes that she did not come the same age as herself, to see if he were trying to put his shoes on. '--and just take his head mournfully. 'Not I!' said the last few minutes that she ought not to be otherwise than what you like,' said the Cat; and this was of very little way forwards each time and a large caterpillar, that was sitting on the second verse of the table. 'Have some wine,' the March Hare. Alice was beginning to feel which way you have of.","reputation":"1","date_review":"2015-09-10 12:05:59","created_at":"2015-08-27 09:37:34","user_id":"12","group_id":"2","offers_count":0,"user":{"id":"12","first_name":"Imelda","last_name":"Collier","email":"Metz.Iva@Hettinger.com","phone":"(808)887-6093x9788","avatar":"http:\/\/www.gravatar.com\/avatar\/44c7731097b304064b4336dce6e2e9ea?d=identicon","address":"5617 Dayna Trail\nSouth Ivah, CA 38060","reputation":"7","job_id":"19","department_id":"7"},"group":{"id":"2","title":"JS"}},{"id":"20","title":"In in nemo aut ipsa.","details":"Knave 'Turn them over!' The Knave did so, very carefully, nibbling first at one end of trials, \"There was some attempts at applause, which was the first to break the silence. 'What day of the ground--and I should understand that better,' Alice said very politely, feeling quite pleased to find any. And yet you incessantly stand on your head-- Do you think you might catch a bat, and that's all I can listen all day about it!' and he poured a little timidly: 'but it's no use now,' thought Alice, 'they're sure to make the arches. The chief difficulty Alice found at first she thought it must be a great hurry; 'this paper has just been picked up.' 'What's in it?' said the Hatter: 'as the things get used up.' 'But what am I to do?' said Alice. 'It must be getting home; the night-air doesn't suit my throat!' and a large caterpillar, that was sitting on the bank--the birds with draggled feathers, the animals with their heads downward! The Antipathies, I think--' (for, you see, Alice had no.","reputation":"4","date_review":"2015-09-05 20:54:32","created_at":"2015-08-27 09:37:34","user_id":"17","group_id":"2","offers_count":0,"user":{"id":"17","first_name":"Chandler","last_name":"Powlowski","email":"Richie97@gmail.com","phone":"00910435740","avatar":"http:\/\/www.gravatar.com\/avatar\/59092004c79faa8fe7ec4e9a05a12432?d=identicon","address":"3636 Hailey Coves Suite 649\nPort Trudie, FL 28274-0049","reputation":"1","job_id":"6","department_id":"6"},"group":{"id":"2","title":"JS"}}]};
	}
}
},{"../app":1}],5:[function(require,module,exports){
var app = require('../app');
app.controller("ExpenseController", ExpenseController);

ExpenseController.$inject = ["ExpenseService"];

function ExpenseController(ExpenseService) {
	var vm = this;

	//ExpenseService.getPopular().then(function(data) {
	//	vm.popular = data;
	//});
	//vm.periods = [
	//{
	//	value: 'today',
	//	text: 'Upcoming today'
	//},
	//{
	//	value: 'week',
	//	text: 'Upcoming this week'
	//},
	//{
	//	value: 'month',
	//	text: 'Upcoming this month'
	//}
	//];
	//vm.period = vm.periods[0];
//
	//vm.upcoming = ExpenseService.getPopular();
	//vm.upcoming.week = vm.upcoming.month.slice(0, 5);
	//vm.upcoming.today = vm.upcoming.month.slice(0, 2);
}
},{"../app":1}],6:[function(require,module,exports){
var app = require('../app');
app.directive("expenseWidget", ExpenseDirective);

function ExpenseDirective() {
	return {
		restrict: "E",
		templateUrl: "./templates/expense/Expense.html",
		replace: true
	};
}
},{"../app":1}],7:[function(require,module,exports){
var app = require('../app');
app.factory("ExpenseService", ExpenseService);

ExpenseService.$inject = ["$resource"];

function ExpenseService($resource) {
	return {
		getWorld: getWorld
	};

	function getWorld() {
		return 'Hello world';
		//return $resource("http://team.binary-studio.com/Expenser/api/v1/Expenserequest/popular").query().$promise;
	}
}
},{"../app":1}],8:[function(require,module,exports){
var app = require('../app');
app.controller("HRController", HRController);

HRController.$inject = ["HRService"];

function HRController(HRService) {
	var vm = this;

	vm.activities = HRService.getActivities();
}
},{"../app":1}],9:[function(require,module,exports){
var app = require('../app');
app.directive("hrWidget", HRDirective);

function HRDirective() {
	return {
		restrict: "E",
		templateUrl: "./templates/hr-activity/HR.html",
		replace: true
	};
}
},{"../app":1}],10:[function(require,module,exports){
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
			message: "yetSomeOneNew@super.site has done something nice",
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
},{"../app":1}],11:[function(require,module,exports){
var app = require('../app.js');
	app.factory('NewsService', NewsService);

	NewsService.$inject = ["$resource"];

	function NewsService($resource) {
		return {
			getNews: getNews,
			createNews: createNews,
			editNews: editNews,
			deleteNews: deleteNews,
			addComment: addComment
		};

		function getRequest() {
			return $resource("/news/api/news/:id", { id: "@id"});
		}

		function getNews() {
			return $resource("/news/api/news").query().$promise;
		}

		function createNews(news) {
			//return  $resource().query().$promise.save(news).$promise;
			return $resource("/news/api/news", {}, {
						save: { method: 'POST', 
							headers: {'Content-Type': 'application/json'}
						}
					}).save(news).$promise;
		}

		function addComment(newsId, comment) {
			var data = $resource("/news/api/news/:id", { id: "@id" }, {
				update: {
					method: "PUT"
				}
			});
			return data.update({ id: newsId }, {$push:{comments: comment}}).$promise;
		}

		function editNews(newsId, news) {

			var data = $resource("/news/api/news/:id", { id: "@id" }, {
				update: {
					method: "PUT"
				}
			});
			return data.update({ id: newsId }, { body: news }).$promise;
		}
		function deleteNews(newsId) {
			return getRequest().remove({ id: newsId }).$promise;
		}
		
	}

},{"../app.js":1}],12:[function(require,module,exports){
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
},{"../app":1}],13:[function(require,module,exports){
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
},{"../app":1}],14:[function(require,module,exports){
var app = require('../app');
app.directive("pollWidget", PollDirective);

function PollDirective() {
    return {
        restrict: "E",
        templateUrl: "./templates/poll/poll.html"
    };
}
},{"../app":1}],15:[function(require,module,exports){
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
},{"../app":1}],16:[function(require,module,exports){
var app = require('../app');
app.controller("VoteFormController", VoteFormController);

function VoteFormController() {
    var vm = this;
    vm.vote = {};
    vm.sendVote = sendVote;

    function sendVote() {

    }
}
},{"../app":1}]},{},[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16]);
