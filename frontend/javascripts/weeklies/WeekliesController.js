var app = require('../app');
var _ = require('lodash');

app.controller('WeekliesController', WeekliesController);

WeekliesController.$inject = [
	'NewsService',
	'WeekliesService',
	'AdministrationService',
	'ExpenseService',
	'$mdDialog',
	'$location',
	'$route',
	'$rootScope',
	'$filter',
	'socket',
	'$q',
	'$timeout',
	'$scope'
];

function WeekliesController(NewsService, WeekliesService, AdministrationService, ExpenseService, $mdDialog, $location, $route, $rootScope, $filter, socket, $q, $timeout, $scope) {
	var vm = this;

	NewsService.getMe().then(function(data) {
		vm.whyCouldntYouMadeThisVariableUser = data;
	});





	//weeklies

	vm.weekliesMode = 'view';

	vm.packs = [];
	vm.hiddenPacks = [];

	WeekliesService.getPacks().then(function(data) {
		vm.allPacks = data;
		vm.splitPacks();
		vm.hiddenPacks.forEach(function(pack) {
			pack.collapsed = true;
		});
	});

	vm.splitPacks = function() {
		vm.packs = _.filter(vm.allPacks, {published: true});
		vm.hiddenPacks = _.filter(vm.allPacks, {published: false});
	};

	vm.toPackEditMode = function(packId, published) {
		vm.clearCurrPackNewsEdit();
		if (!packId) {
			var date = new Date();
			var d = date.getDate().toString();
			var m = (date.getMonth() + 1).toString();
			d = (d.length === 1) ? ('0' + d) : d;
			m = (m.length === 1) ? ('0' + m) : m;

			var pack = {
				title: 'Weeklies #' + d + '.' + m,
				author: vm.whyCouldntYouMadeThisVariableUser.id,
				date: Date.now()
			};

			WeekliesService.createPack(pack).then(function(data) {
				socket.emit("new pack", data);
				vm.editingPack = _.find(vm.packs, {_id: data._id});
				vm.weekliesMode = 'edit';
			});
		} else {
			vm.editingPack = published ? _.find(vm.packs, {_id: packId}) : _.find(vm.hiddenPacks, {_id: packId});
			vm.weekliesMode = 'edit';
		}
	};

	vm.toViewMode = function() {
		vm.weekliesMode = 'view';
	};

	vm.insertNewsInPack = function(form) {
		NewsService.createNews({
			title: vm.currPackNewsEdit.title,
			body: vm.currPackNewsEdit.body,
			type: 'weeklies',
			date: Date.now(),
			author: vm.whyCouldntYouMadeThisVariableUser.id
		}).then(function(news) {
			//socket.emit("new post", news);
			WeekliesService.pushNewsToPack(vm.editingPack._id, [news._id]).then(function(data) {
				if (data.nModified) {
					socket.emit("edit pack", {
						packId: vm.editingPack._id,
						pushNews: news
					});
				}
			});
		});
		vm.clearCurrPackNewsEdit();
		$timeout(function() {
			form.$setPristine();
			form.$setUntouched();
		});
	};

	vm.editPack = function(id) {
		vm.togglePackEditing();
		vm.editingPack = _.find(vm.packs, {_id: id});
	};

	vm.deletePack = function(packId) {
		var confirm = $mdDialog.confirm()
			.title("Are you sure want to delete this pack of news?")
			.content("")
			.ariaLabel('Confirmation')
			.ok('Yes')
			.cancel('Cancel');
		$mdDialog.show(confirm).then(function() {
			WeekliesService.removePack(packId).then(function() {
				socket.emit("delete pack", packId);
			});
		}, function() {});
	};

	vm.removeFromPack = function(index, news) {
		var newsPromise = NewsService.deleteNews(news._id);
		var packPromise = WeekliesService.removeNewsFromPack(vm.editingPack._id, news._id);

		$q.all([newsPromise, packPromise]).then(function(data) {
			socket.emit("delete post", news._id, news.type);
		});
	};

	vm.clearCurrPackNewsEdit = function() {
		vm.currPackNewsEdit = {};
	};

	vm.showNewsSelector = function() {
		$mdDialog.show({
			controller: NewsSelectorController,
			templateUrl: './templates/news/SelectNewsModal.html',
			parent: angular.element(document.body),
			clickOutsideToClose: true
		});
		function NewsSelectorController($scope, $mdDialog) {
			$scope.avNews = vm.companyPosts;
			$scope.loadNewsPack = vm.loadNewsPack;
			$scope.closeDialog = function() {
				$mdDialog.hide();
			};
		}
	};

	vm.loadNewsPack = function(news) {
		vm.currPackNewsEdit = {
			title: news.title,
			body: news.body
		};
	};

	vm.updatePackTitle = function(packId, title) {
		WeekliesService.updatePack(packId, {title: title}).then(function(data) {
			if (data.nModified) {
				socket.emit("edit pack", {
					packId: packId,
					title: title
				});
			}
		});
	};

	vm.updatePackVisibility = function(packId, publish) {
		WeekliesService.updatePack(packId, {published: publish}).then(function(data) {
			if (data.nModified) {
				socket.emit("edit pack", {
					packId: packId,
					published: publish
				});
			}
		});
	};

	vm.saveNews = function(packId, news) {
		news.edit = false;

		NewsService.editNews(news._id, news).then(function(data) {
			if (!data.nModified) {
				news = JSON.parse(JSON.stringify(vm.editing));
			}
			else {
				socket.emit("edit post", news);
			}
			vm.resetEditing();
		});

	};

	socket.on("push pack", function(pack) {

		pack.fullNews = [];

		pack.news.forEach(function(newsId) {
			pack.fullNews.push(getNewsById(newsId));
		});

		if (pack.published) {
			vm.packs.push(pack);
		}else {
			vm.hiddenPacks.push(pack);
		}
	});

	socket.on("change pack", function(data) {
		var pack;
		if (data.pushNews) {
			pack = _.find(vm.allPacks, {_id: data.packId});
			pack.news.push(data.pushNews._id);
			pack.fullNews.push(data.pushNews);
			vm.splitPacks();
		}
		if (data.title) {
			pack = _.find(vm.allPacks, {_id: data.packId});
			pack.title = data.title;
			vm.splitPacks();
		}
		if (data.hasOwnProperty('published')) {
			pack = _.find(vm.allPacks, {_id: data.packId});
			if (!data.published) {
				pack.collapsed = true;
			}
			pack.published = data.published;
			vm.splitPacks();
		}
	});

	socket.on("splice pack", function(packId) {
		var index = vm.allPacks.map(function(x) {return x._id;}).indexOf(packId);
		if (index !== -1) {
			vm.allPacks.splice(index, 1);
			vm.splitPacks();
		}
	});






	// Socket logic

	socket.on("change post", function(newPost) {
		var pack = _.find(vm.allPacks, function(pack) {
			var newsId = _.find(pack.news, function(news) {
				return news === newPost._id;
			});
			return !!newsId;
		});
		if (pack) {
			var packIndex = vm.allPacks.map(function(x) {return x._id; }).indexOf(pack._id);
			if (packIndex !== -1) {
				var newsIndex = vm.allPacks[packIndex].news.indexOf(newPost._id);
				vm.allPacks[packIndex].fullNews[newsIndex] = newPost;
			}
			vm.splitPacks();
		}
	});

	socket.on("change comment", function(data) {
		var pack = _.find(vm.allPacks, function(pack) {
			var newsId = _.find(pack.news, function(news) {
				return news === data.newsId;
			});
			return !!newsId;
		});
		if (pack) {
			var packIndex = vm.allPacks.map(function(x) {return x._id; }).indexOf(pack._id);
			if (packIndex !== -1) {
				var newsIndex = vm.allPacks[packIndex].news.indexOf(data.newsId);
				var commentIndex = vm.allPacks[packIndex].fullNews[newsIndex].comments.map(function(x) {return x._id; }).indexOf(data.comment._id);
				vm.allPacks[packIndex].fullNews[newsIndex].comments[commentIndex].body = data.comment.body;
			}
			vm.splitPacks();
		}
	});

	socket.on("splice post", function(postId, type) {
		var pack = _.find(vm.allPacks, function(pack) {
			var newsId = _.find(pack.news, function(news) {
				return news === postId;
			});
			return !!newsId;
		});
		if (pack) {
			var packIndex = vm.allPacks.map(function(x) {return x._id; }).indexOf(pack._id);
			var newsIndex = vm.allPacks[packIndex].news.indexOf(postId);
			vm.allPacks[packIndex].news.splice(newsIndex, 1);
			vm.allPacks[packIndex].fullNews.splice(newsIndex, 1);
			vm.splitPacks();
		}
	});

	socket.on("change like post", function(newPost) {
		var pack = _.find(vm.allPacks, function(pack) {
			var newsId = _.find(pack.news, function(news) {
				return news === newPost.post;
			});
			return !!newsId;
		});
		if (pack) {
			var packIndex = vm.allPacks.map(function(x) {return x._id; }).indexOf(pack._id);
			var newsIndex = vm.allPacks[packIndex].news.indexOf(newPost.post);
			if (newPost.isLike) {
				vm.allPacks[packIndex].fullNews[newsIndex].likes.push(newPost.user);
			} else {
				var index = vm.allPacks[packIndex].fullNews[newsIndex].likes.indexOf(newPost.user);
				if(index !== -1) {
					vm.allPacks[packIndex].fullNews[newsIndex].likes.splice(index, 1);
				}
			}
			vm.splitPacks();
		}
	});

	socket.on("change like comment", function(data) {
		var pack = _.find(vm.allPacks, function(pack) {
			var newsId = _.find(pack.news, function(news) {
				return news === data.newsId;
			});
			return !!newsId;
		});
		if (pack) {
			var packIndex = vm.allPacks.map(function(x) {return x._id; }).indexOf(pack._id);
			var newsIndex = vm.allPacks[packIndex].news.indexOf(data.newsId);
			var commentIndex = vm.allPacks[packIndex].fullNews[newsIndex].comments.map(function(x) {return x._id; }).indexOf(data.commentId);
			if (data.like === "added") {
				vm.allPacks[packIndex].fullNews[newsIndex].comments[commentIndex].likes.push(vm.whyCouldntYouMadeThisVariableUser.id);
			} else if (data.like === "removed") {
				var index = vm.allPacks[packIndex].fullNews[newsIndex].comments[commentIndex].likes.indexOf(vm.whyCouldntYouMadeThisVariableUser.id);
				if(index !== -1) {
					vm.allPacks[packIndex].fullNews[newsIndex].comments[commentIndex].likes.splice(index, 1);
				}
			}
			vm.splitPacks();
		}
	});
	
	socket.on("push comment", function(data) {
		var pack = _.find(vm.allPacks, function(pack) {
			var newsId = _.find(pack.news, function(news) {
				return news === data.postId;
			});
			return !!newsId;
		});
		if (pack) {
			var packIndex = vm.allPacks.map(function(x) {return x._id; }).indexOf(pack._id);
			var newsIndex = vm.allPacks[packIndex].news.indexOf(data.postId);
			vm.allPacks[packIndex].fullNews[newsIndex].comments.push(data.comment);
			vm.splitPacks();
		}
	});

	socket.on("splice comment", function(commentDetails) {
		var pack = _.find(vm.allPacks, function(pack) {
			var newsId = _.find(pack.news, function(news) {
				return news === commentDetails.post;
			});
			return !!newsId;
		});
		if (pack) {
			var packIndex = vm.allPacks.map(function(x) {return x._id; }).indexOf(pack._id);
			var newsIndex = vm.allPacks[packIndex].news.indexOf(commentDetails.post);
			var index = vm.allPacks[packIndex].fullNews[newsIndex].comments.map(function(x) {return x._id; }).indexOf(commentDetails.comment);
			vm.allPacks[packIndex].fullNews[newsIndex].comments.splice(index, 1);
			vm.splitPacks();
		}
	});

	$scope.$on("$destroy", function() {
		socket.removeAllListeners("change post");
		socket.removeAllListeners("change comment");
		socket.removeAllListeners("splice post");
		socket.removeAllListeners("change like post");
		socket.removeAllListeners("change like comment");
		socket.removeAllListeners("push comment");
		socket.removeAllListeners("splice comment");




		socket.removeAllListeners("push pack");
		socket.removeAllListeners("change pack");
		socket.removeAllListeners("splice pack");
	});
}