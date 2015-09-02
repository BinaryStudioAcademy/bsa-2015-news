var app = require('../app.js');

app.factory('StackService', stackService);

stackService.$inject = ['$resource'];

function stackService(resource) {
	return {
		getQuestions: getQuestions
	};

	function getQuestions(type) {
		console.log('=>', type);
		var data = resource('http://team.binary-studio.com/asciit/api/v1/widget/questions/:type', {type: type});
		return data.get(type).$promise;
	}
}

// var mock = [{
// 	"id": "1",
// 	"title": "How many PHP programmers does it take to change a light bulb?",
// 	"description": "Don't be all day to such stuff? Be off, or I'll kick you down stairs!' 'That is not said right,' said the voice. 'Fetch me my gloves this moment!' Then came a rumbling of little Alice and all would change (she knew) to the jury, of course--\"I GAVE HER ONE, THEY GAVE HIM TWO--\" why, that must be kind to them,' thought Alice, and, after folding his arms and legs in all my life!' Just as she could, and soon found herself in a moment. 'Let's go on with the distant sobs of the court,\" and I don't care which happens!' She ate a little bird as soon as look at me like a frog; and both the hedgehogs were out of a well?' The Dormouse had closed its eyes by this very sudden change, but very politely: 'Did you say pig, or fig?' said the King very decidedly, and he went on, taking first one side and then said, 'It was a large cauldron which seemed to think that there was not a moment that it led into the book her sister was reading, but it all came different!' Alice replied in an encouraging opening for a minute or two, she made out that one of the day; and this time the Queen had only one who had got its head impatiently, and said, 'So you think I could, if I can do without lobsters, you know. Come on!' So they went on growing, and she swam about, trying to find herself talking familiarly with them, as if he were trying to fix on one, the cook till his eyes very wide on hearing this; but all he SAID was, 'Why is a raven like a star-fish,' thought Alice. One of the house before she.",
// 	"created_at": "2015-08-28 09:27:36",
// 	"updated_at": "2015-08-28 09:27:36",
// 	"user_id": "8",
// 	"folder_id": "1",
// 	"slug": "sapiente-omnis-consequuntur-qui-ex-vero-expedita-asperiores",
// 	"answers_count": 0,
// 	"vote_value": "1",
// 	"vote_likes": "1",
// 	"vote_dislikes": 0,
// 	"comment_count": 0,
// 	"url": "http:\/\/team.binary-studio.com\/asciit\/#questions\/sapiente-omnis-consequuntur-qui-ex-vero-expedita-asperiores",
// 	"user": {
// 		"id": "8",
// 		"first_name": "Wyman",
// 		"last_name": "O'Kon",
// 		"email": "Gregorio00@Hodkiewicz.com",
// 		"avatar": "http:\/\/www.gravatar.com\/avatar\/8e64bd7b5617976d8805ad4d3ee06919.jpg?s=80&d=identicon&r=g",
// 		"created_at": "2015-08-28 09:27:36",
// 		"updated_at": "2015-08-28 09:27:36",
// 		"binary_id": null,
// 		"country": null,
// 		"city": null,
// 		"gender": null,
// 		"birthday": null,
// 		"role_id": "2"
// 	},
// 	"folder": {
// 		"id": "1",
// 		"title": "PHP"
// 	},
// 	"tags": []
// }, {
// 	"id": "2",
// 	"title": "How to close vim?",
// 	"description": "Queen, and Alice, were in custody and under sentence of execution.' 'What for?' said Alice. 'That's the first to break the silence. 'What day of the reeds--the rattling teacups would change (she knew) to the three gardeners instantly threw themselves flat upon their faces, so that her idea of the garden: the roses growing on it but tea. 'I don't know one,' said Alice. 'I've read that in some book, but I grow up, I'll write one--but I'm grown up now,' she said, 'for her hair goes in such confusion that she had nothing yet,' Alice replied thoughtfully. 'They have their tails fast in their proper places--ALL,' he repeated with great emphasis, looking hard at Alice as he spoke, and then all the same, the next verse.' 'But about his toes?' the Mock Turtle's heavy sobs. Lastly, she pictured to herself that perhaps it was addressed to the porpoise, \"Keep back, please: we don't want YOU with us!\"' 'They were learning to draw, you know--' (pointing with his tea spoon at the flowers and those cool fountains, but she added, to herself, being rather proud of it: for she was quite silent for a little irritated at the other queer noises, would change to dull reality--the grass would be offended again. 'Mine is a long way back, and barking hoarsely all the jurymen on to himself as he came, 'Oh! the Duchess, the Duchess! Oh! won't she be savage if I've been changed in the sea, some children digging in the pool, 'and she sits purring so nicely by the officers of the sea.' 'I couldn't help.",
// 	"created_at": "2015-08-28 09:27:36",
// 	"updated_at": "2015-08-28 09:27:36",
// 	"user_id": "19",
// 	"folder_id": "2",
// 	"slug": "reprehenderit-necessitatibus-sed-quisquam-consequuntur-fugit-minus-incidunt",
// 	"answers_count": 0,
// 	"vote_value": "2",
// 	"vote_likes": "7",
// 	"vote_dislikes": "5",
// 	"comment_count": 0,
// 	"url": "http:\/\/team.binary-studio.com\/asciit\/#questions\/reprehenderit-necessitatibus-sed-quisquam-consequuntur-fugit-minus-incidunt",
// 	"user": {
// 		"id": "19",
// 		"first_name": "Mack",
// 		"last_name": "Bins",
// 		"email": "Margot.Schamberger@gmail.com",
// 		"avatar": "http:\/\/www.gravatar.com\/avatar\/af1e23b289993ce3f61f86e44c8b8511.jpg?s=80&d=identicon&r=g",
// 		"created_at": "2015-08-28 09:27:36",
// 		"updated_at": "2015-08-28 09:27:36",
// 		"binary_id": null,
// 		"country": null,
// 		"city": null,
// 		"gender": null,
// 		"birthday": null,
// 		"role_id": "2"
// 	},
// 	"folder": {
// 		"id": "2",
// 		"title": "JS"
// 	},
// 	"tags": []
// },
// {
// 	"id": "3",
// 	"title": "Most efficient way to turn (x=y) into true?",
// 	"description": "Queen, and Alice, were in custody and under sentence of execution.' 'What for?' said Alice. 'That's the first to break the silence. 'What day of the reeds--the rattling teacups would change (she knew) to the three gardeners instantly threw themselves flat upon their faces, so that her idea of the garden: the roses growing on it but tea. 'I don't know one,' said Alice. 'I've read that in some book, but I grow up, I'll write one--but I'm grown up now,' she said, 'for her hair goes in such confusion that she had nothing yet,' Alice replied thoughtfully. 'They have their tails fast in their proper places--ALL,' he repeated with great emphasis, looking hard at Alice as he spoke, and then all the same, the next verse.' 'But about his toes?' the Mock Turtle's heavy sobs. Lastly, she pictured to herself that perhaps it was addressed to the porpoise, \"Keep back, please: we don't want YOU with us!\"' 'They were learning to draw, you know--' (pointing with his tea spoon at the flowers and those cool fountains, but she added, to herself, being rather proud of it: for she was quite silent for a little irritated at the other queer noises, would change to dull reality--the grass would be offended again. 'Mine is a long way back, and barking hoarsely all the jurymen on to himself as he came, 'Oh! the Duchess, the Duchess! Oh! won't she be savage if I've been changed in the sea, some children digging in the pool, 'and she sits purring so nicely by the officers of the sea.' 'I couldn't help.",
// 	"created_at": "2015-08-28 09:27:36",
// 	"updated_at": "2015-08-28 09:27:36",
// 	"user_id": "19",
// 	"folder_id": "2",
// 	"slug": "reprehenderit-necessitatibus-sed-quisquam-consequuntur-fugit-minus-incidunt",
// 	"answers_count": 0,
// 	"vote_value": "-4",
// 	"vote_likes": "1",
// 	"vote_dislikes": "5",
// 	"comment_count": 0,
// 	"url": "http:\/\/team.binary-studio.com\/asciit\/#questions\/reprehenderit-necessitatibus-sed-quisquam-consequuntur-fugit-minus-incidunt",
// 	"user": {
// 		"id": "19",
// 		"first_name": "Mack",
// 		"last_name": "Bins",
// 		"email": "Margot.Schamberger@gmail.com",
// 		"avatar": "http:\/\/www.gravatar.com\/avatar\/e49ff6fb915ba612a1e7424b1a3740db.jpg?s=80&d=identicon&r=g",
// 		"created_at": "2015-08-28 09:27:36",
// 		"updated_at": "2015-08-28 09:27:36",
// 		"binary_id": null,
// 		"country": null,
// 		"city": null,
// 		"gender": null,
// 		"birthday": null,
// 		"role_id": "2"
// 	},
// 	"folder": {
// 		"id": "2",
// 		"title": "JS"
// 	},
// 	"tags": []
// }];

// function getQuestions(type) {
// 	return mock;
// }

