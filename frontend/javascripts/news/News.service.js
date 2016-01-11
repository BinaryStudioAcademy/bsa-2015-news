var app = require('../app.js');
	app.factory('NewsService', NewsService);

	NewsService.$inject = ["$resource"];

	function NewsService($resource) {
		return {
			getNews: getNews,
			getFullUsers: getFullUsers,
			getRoles: getRoles,
			update_Role_User: update_Role_User,
			createNews: createNews,
			editNews: editNews,
			editComment: editComment,
			deleteNews: deleteNews,
			addComment: addComment,
			deleteComment: deleteComment,
			getComments: getComments,
			newsLike: newsLike,
			toggleCommentLike: toggleCommentLike,
			deleteNewsLike: deleteNewsLike,
			getMe: getMe,
			getServices: getServices,
			getPacks: getPacks,
			createPack: createPack,
			removePack: removePack,
			pushNewsToPack: pushNewsToPack,
			removeNewsFromPack: removeNewsFromPack
		};

		function getMe() {
			return $resource("api/me").get().$promise;
		}

		function getRequest() {
			return $resource("api/news/:id", { id: "@id"});
		}

		function getNews() {
			return $resource("api/news").query().$promise;
		}

		function getFullUsers() {
			return $resource("profile/api/users").query().$promise;
			//return $resource("http://team.binary-studio.com/profile/api/users").query().$promise;
		}

		function getRoles() {
			return $resource("auth/api/roles").query().$promise;
			//return $resource("http://team.binary-studio.com/profile/api/users").query().$promise;
		}

		function getComments(newsId) {
			return $resource("/api/news/:id/comments", { id: "@id"}).get({id: newsId}).$promise;
		}

		function update_Role_User(newsId, roleId, userId) {
			var data = $resource("api/news/:id", { id: "@id" }, {
				update: {method: "PUT"}
			});
			return data.update({ id: newsId }, { $set:{access_roles: roleId, restrict_ids: userId }}).$promise;
		}

		function createNews(news) {
			return $resource("api/news", {}, {
						save: { method: 'POST', 
							headers: {'Content-Type': 'application/json'}
						}
					}).save(news).$promise;
		}

		function addComment(newsId, comment) {
			var data = $resource("api/news/:id", { id: "@id" }, {
				update: {method: "PUT"}
			});
			return data.update({ id: newsId }, {$push:{comments: comment}}).$promise;
		}

		function editNews(newsId, news) {
			var data = $resource("api/news/:id", { id: "@id" }, {
				update: {method: "PUT"}
			});
			return data.update({ id: newsId }, news).$promise;
		}

		function editComment(newsId, commentId, body) {
			var data = $resource("api/news/:newsId/comments/:commentId", { newsId: "@newsId", commentId: "@commentId" }, {
				update: {method: "PUT"}
			});
			return data.update({newsId: newsId, commentId: commentId}, {body: body}).$promise;
		}

		function deleteNews(newsId) {
			return getRequest().remove({ id: newsId }).$promise;
		}

		function deleteComment(newsId, commentId) {
			var data = $resource("api/news/:id", { id: "@id" }, {
				update: {method: "PUT"}
			});
			return data.update({ id: newsId }, { $pull:{comments: {_id: commentId} }}).$promise;
		}

		function newsLike(newsId, userId) {
			var data = $resource("api/news/:id", { id: "@id" }, {
				update: {method: "PUT"}
			});
			return data.update({ id: newsId }, { $addToSet:{likes: userId }}).$promise;
		}

		function deleteNewsLike(newsId, userId) {
			var data = $resource("api/news/:id", { id: "@id" }, {
				update: {method: "PUT"}
			});
			return data.update({ id: newsId }, { $pull:{likes: userId }}).$promise;

		}

		function toggleCommentLike(newsId, commentId) {
			var data = $resource("api/news/:newsId/comments/:commentId", { newsId: "@newsId", commentId: "@commentId" }, {
				update: {method: "PUT"}
			});
			//return data.update({newsId: newsId, commentId: commentId}, {like: true}).$promise;
			//return data.update({newsId: newsId, commentId: commentId}, {$addToSet:{likes: userId }}).$promise;
			return data.update({newsId: newsId, commentId: commentId}).$promise;
		}

		function getServices() {
			return $resource("http://team.binary-studio.com/app/api/notificationService").query().$promise;
		}

		function getPacks() {
			return $resource("api/packs").query().$promise;
		}

		function createPack(pack) {
			return $resource("api/packs", {}, {
						save: { method: 'POST', 
							headers: {'Content-Type': 'application/json'}
						}
					}).save(pack).$promise;
		}

		function removePack(id) {
			return $resource("api/packs/:id", {id: "@id"}).remove({id:id}).$promise;
		}

		function pushNewsToPack(id, newsArray) {
			return $resource("api/packs/:id/news/", {id: "@id"}, {
						save: { method: 'POST', 
							headers: {'Content-Type': 'application/json'}
						}
					}).save({ id: id }, {newsArray: newsArray}).$promise;
		}

		function removeNewsFromPack(packId, newsId) {
			return $resource("api/packs/:packId/news/:newsId", { packId: "@packId", newsId: "@newsId" }).remove({ packId: packId, newsId: newsId }).$promise;
		}
	}
