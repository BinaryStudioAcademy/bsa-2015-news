var app = require('../app');
var _ = require('lodash');

app.controller('WeekliesController', WeekliesController);

WeekliesController.$inject = [
	'NewsService',
	'WeekliesService',
	'AdministrationService',
	'NotificationService',
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

function WeekliesController(NewsService, WeekliesService, AdministrationService, NotificationService, $mdDialog, $location, $route, $rootScope, $filter, socket, $q, $timeout, $scope) {
	var vm = this;

	$scope.newsCtrl.loadMore = function() {
		WeekliesService.getPacks(vm.packs.length, 3, 'yes', $scope.newsCtrl.newsFilter).then(function(data) {
			Array.prototype.push.apply(vm.packs, data);
			vm.noData = (vm.packs.length === 0);
		}, function() {});
	};


	$scope.newsCtrl.selectedIndex = 2;

	NewsService.getMe().then(function(data) {
		vm.whyCouldntYouMadeThisVariableUser = data;
		if ($scope.newsCtrl.showModalPost.type === 'weeklies') {
			console.log('show weeklies');
		}
	});

	vm.filterPacks = function() {
		var maxDate = $scope.newsCtrl.getFilterDate();
		WeekliesService.getPacks(0, 3, 'yes', $scope.newsCtrl.newsFilter, maxDate).then(function(data) {
			vm.packs = data;
			vm.noData = (vm.packs.length === 0);
		}, function() {
			vm.packs = [];
			vm.noData = true;
		});
	};




	//weeklies

	vm.weekliesMode = 'view';

	vm.packs = [];
	vm.hiddenPacks = [];

	WeekliesService.getPacks(0, 3, 'yes', $scope.newsCtrl.newsFilter).then(function(data) {
		vm.packs = data;
		checkModal();
		vm.noData = (vm.packs.length === 0);
	}, function() {
		vm.packs = [];
		checkModal();
		vm.noData = true;
	});

	WeekliesService.getPacks().then(function(data) {
		vm.hiddenPacks = data;
		vm.hiddenPacks.forEach(function(pack) {
			pack.collapsed = true;
		});
	}, function() {
		vm.hiddenPacks = [];
	});

	function checkModal() {
		var params = $location.search();
		if (params.pack) {
			var id = params.pack;
			var modalPost = _.find(vm.packs, {_id: id});
			if (modalPost) {
				vm.showModal(id);
			} else {
				WeekliesService.getPack(id).then(function(pack) {
					vm.packs.unshift(pack);
					vm.oddPack = id;
					vm.showModal(id);
				}, function() {
					vm.hideModal();
				});
			}
		}
	}

	$scope.$on('$routeUpdate', function() {
		checkModal();
	});

	vm.showModal = function(id, event) {
		packIndex = vm.packs.map(function(x) {return x._id; }).indexOf(id);
		vm.packs[packIndex].showInModal = true;
		if (event) {
			$location.search('pack', id );
			event.stopPropagation();
		}
	};

	vm.hideModal = function(id) {
		if (!id) {
			vm.packs.forEach(function(pack) {
				pack.showInModal = false;
				vm.restoreData("news");
				vm.restoreData("comment");
				$location.search('pack', null );
			});
		} else {
			packIndex = vm.packs.map(function(x) {return x._id; }).indexOf(id);
			if (vm.packs[packIndex].showInModal === true) {
				vm.packs[packIndex].showInModal = false;
				vm.restoreData("news");
				vm.restoreData("comment");
				if (vm.oddPack) {
					var index = vm.packs.map(function(x) {return x._id; }).indexOf(vm.oddPack);
					if (index !== -1) {
						vm.packs.splice(index, 1);
					}
				}
				$location.search('pack', null );
			}
		}
	};

/*	vm.splitPacks = function() {
		vm.packs = _.filter(vm.allPacks, {published: true});
		vm.packs.sort(function(a, b) {
			return a.date - b.date;
		});
		vm.hiddenPacks = _.filter(vm.allPacks, {published: false});
		vm.hiddenPacks.sort(function(a, b) {
			return a.date - b.date;
		});
	};*/

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
			});
		} else {
			vm.editingPack = published ? _.find(vm.packs, {_id: packId}) : _.find(vm.hiddenPacks, {_id: packId});
			vm.weekliesMode = 'edit';
		}
	};

	vm.toViewMode = function() {
		if (!vm.editingPack.news.length) {
			WeekliesService.removePack(vm.editingPack._id).then(function() {
				socket.emit("delete pack", vm.editingPack._id);
			});
		}
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
		NewsService.getNews('company', 0, 50).then(function(data) {
			vm.recentCompanyNews = data;
			$mdDialog.show({
				controller: NewsSelectorController,
				templateUrl: './templates/news/SelectNewsModal.html',
				parent: angular.element(document.body),
				clickOutsideToClose: true
			});
		});

		function NewsSelectorController($scope, $mdDialog) {
			$scope.avNews = vm.recentCompanyNews;
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
		var date = Date.now();
		WeekliesService.updatePack(packId, {
				published: publish,
				author: vm.whyCouldntYouMadeThisVariableUser.id,
				date: date
			}).then(function(data) {
			if (data.nModified) {
				if (publish) {
					NotificationService.packPublished(_.find(vm.hiddenPacks, {_id: packId}), $scope.newsCtrl.fullUsers);
				}
				socket.emit("edit pack", {
					packId: packId,
					date: date,
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

	function findPackByNews(postId) {
		var pack;
		pack = _.find(vm.packs, function(pack) {
			var newsId = _.find(pack.news, function(news) {
				return news === postId;
			});
			return !!newsId;
		});
		if (!pack) {
			pack = _.find(vm.hiddenPacks, function(pack) {
				var newsId = _.find(pack.news, function(news) {
					return news === postId;
				});
				return !!newsId;
			});
			if (!pack) {
				return false;
			} else {
				return {id: pack._id, type: 'hiddenPacks'};
			}
		} else {
			return {id: pack._id, type: 'packs'};
		}
	}

	function findPackType(packId) {
		var pack;
		var packIndex;
		pack = _.find(vm.packs, {_id: packId});
		if (!pack) {
			pack = _.find(vm.hiddenPacks, {_id: packId});
			if (!pack) {
				return false;
			} else {
				packIndex = vm.hiddenPacks.map(function(x) {return x._id; }).indexOf(packId);
				return {packIndex: packIndex, type: 'hiddenPacks'};
			}
		} else {
			packIndex = vm.packs.map(function(x) {return x._id; }).indexOf(packId);
			return {packIndex: packIndex, type: 'packs'};
		}
	}

	function findIndexes(newsId, commentId) {
		var packData = findPackByNews(newsId);
		var packIndex;
		var newsIndex;
		var commentIndex;
		if (packData) {
			packIndex = vm[packData.type].map(function(x) {return x._id; }).indexOf(packData.id);
			newsIndex = vm[packData.type][packIndex].news.indexOf(newsId);
			if (commentId) {
				commentIndex = vm[packData.type][packIndex].fullNews[newsIndex].comments.map(function(x) {return x._id; }).indexOf(commentId);
			}
			return {
				packIndex: packIndex,
				type: packData.type,
				newsIndex: newsIndex,
				commentIndex: commentIndex
			};
		} else {
			return false;
		}
	}

	vm.restoreData = function(type) {
		var postId;
		var indexes;
		if (type === 'news') {
			postId = $scope.newsCtrl.editing._id;
			indexes = findIndexes(postId);
			if (indexes) {
				vm[indexes.type][indexes.packIndex].fullNews[indexes.newsIndex] = $scope.newsCtrl.editing;
			}
		} else if (type === 'comment') {
			postId = $scope.newsCtrl.editing.news_id;
			indexes = findIndexes(postId, $scope.newsCtrl.editing._id);
			if (indexes) {
				vm[indexes.type][indexes.packIndex].fullNews[indexes.newsIndex].comments[indexes.commentIndex].body = $scope.newsCtrl.editing.body;
			}
		}
		$scope.newsCtrl.editing = {};
	};

	vm.packsSearch = function(pack) {
		if ( (pack.title.toLowerCase().indexOf(vm.packsFilter.toLowerCase()) > -1) ){
			return true;
		}
		return false;
	};

	socket.on("push pack", function(pack) {
		pack.fullNews = [];
		pack.collapsed = true;
		vm.hiddenPacks.push(pack);
		vm.editingPack = _.find(vm.hiddenPacks, {_id: pack._id});
		vm.weekliesMode = 'edit';
	});

	socket.on("change pack", function(data) {
		var packData;
		if (data.pushNews) {
			packData = findPackType(data.packId);
			if (packData) {
				vm[packData.type][packData.packIndex].news.push(data.pushNews._id);
				vm[packData.type][packData.packIndex].fullNews.push(data.pushNews);
			}
		}
		if (data.title) {
			packData = findPackType(data.packId);
			if (packData) {
				vm[packData.type][packData.packIndex].title = data.title;
			}
		}
		if (data.hasOwnProperty('published')) {
			packData = findPackType(data.packId);
			if (packData) {
				if (!data.published) {
					vm[packData.type][packData.packIndex].collapsed = true;
				} else {
					vm[packData.type][packData.packIndex].collapsed = false;
				}
				vm[packData.type][packData.packIndex].published = data.published;
				vm[packData.type][packData.packIndex].date = data.date;

				var pack = vm[packData.type].splice(packData.packIndex, 1)[0];
				if (packData.type === 'packs') {
					vm.hiddenPacks.unshift(pack);
					vm.hiddenPacks.sort(function(a, b) {
					return b.date - a.date;
				});
				} else {
					vm.packs.unshift(pack);
					vm.packs.sort(function(a, b) {
						return b.date - a.date;
					});
				}
			}
		}
	});

	socket.on("splice pack", function(packId) {
		var packData = findPackType(packId);
		if (packData) {
			vm[packData.type].splice(packData.packIndex, 1);
		}
	});






	// Socket logic

	socket.on("change post", function(newPost) {
		var indexes = findIndexes(newPost._id);
		if (indexes) {
			vm[indexes.type][indexes.packIndex].fullNews[indexes.newsIndex] = newPost;
		}
	});

	socket.on("change comment", function(data) {
		var indexes = findIndexes(data.newsId, data.comment._id);
		if (indexes) {
			vm[indexes.type][indexes.packIndex].fullNews[indexes.newsIndex].comments[indexes.commentIndex] = data.comment;
		}
	});

	socket.on("splice post", function(postId, type) {
		var indexes = findIndexes(postId);
		if (indexes) {
			vm[indexes.type][indexes.packIndex].news.splice(indexes.newsIndex, 1);
			vm[indexes.type][indexes.packIndex].fullNews.splice(indexes.newsIndex, 1);
		}
	});

	socket.on("change like post", function(newPost) {
		var indexes = findIndexes(newPost.post);
		if (indexes) {
			var index = vm[indexes.type][indexes.packIndex].fullNews[indexes.newsIndex].likes.indexOf(newPost.user);
			if (newPost.isLike) {
				if(index === -1) {
					vm[indexes.type][indexes.packIndex].fullNews[indexes.newsIndex].likes.push(newPost.user);
					NotificationService.newPostLike(vm[indexes.type][indexes.packIndex].fullNews[indexes.newsIndex], _.find($scope.newsCtrl.fullUsers, {serverUserId: newPost.user}), vm[indexes.type][indexes.packIndex]);
				}
			} else {
				if(index !== -1) {
					vm[indexes.type][indexes.packIndex].fullNews[indexes.newsIndex].likes.splice(index, 1);
				}
			}
		}
	});

	socket.on("change like comment", function(data) {
		var indexes = findIndexes(data.newsId, data.commentId);
		if (indexes) {
			var index = vm[indexes.type][indexes.packIndex].fullNews[indexes.newsIndex].comments[indexes.commentIndex].likes.indexOf(vm.whyCouldntYouMadeThisVariableUser.id);

			if (data.like === "added") {
				if (index === -1) {
					vm[indexes.type][indexes.packIndex].fullNews[indexes.newsIndex].comments[indexes.commentIndex].likes.push(vm.whyCouldntYouMadeThisVariableUser.id);
					NotificationService.newCommentLike(vm[indexes.type][indexes.packIndex].fullNews[indexes.newsIndex], _.find($scope.newsCtrl.fullUsers, {serverUserId: data.userId}), vm[indexes.type][indexes.packIndex].fullNews[indexes.newsIndex].comments[indexes.commentIndex], vm[indexes.type][indexes.packIndex]);
				}
			} else if (data.like === "removed") {
				if(index !== -1) {
					vm[indexes.type][indexes.packIndex].fullNews[indexes.newsIndex].comments[indexes.commentIndex].likes.splice(index, 1);
				}
			}
		}
	});
	
	socket.on("push comment", function(data) {
		var indexes = findIndexes(data.postId);
		if (indexes) {
			vm[indexes.type][indexes.packIndex].fullNews[indexes.newsIndex].comments.push(data.comment);
			NotificationService.newComment(vm[indexes.type][indexes.packIndex].fullNews[indexes.newsIndex], _.find($scope.newsCtrl.fullUsers, {serverUserId: data.comment.author}), vm[indexes.type][indexes.packIndex]);
		}
	});

	socket.on("splice comment", function(commentDetails) {
		var indexes = findIndexes(commentDetails.post, commentDetails.comment);
		if (indexes) {
			vm[indexes.type][indexes.packIndex].fullNews[indexes.newsIndex].comments.splice(indexes.commentIndex, 1);
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