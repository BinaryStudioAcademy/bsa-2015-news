var app = require('../app.js');
	app.factory('NewsService', NewsService);

	NewsService.$inject = ["$resource"];

	function NewsService($resource) {
		return {
			getMe: getMe,
			getPost: getPost,
			getNews: getNews,
			getFullUsers: getFullUsers,
			getRoles: getRoles,
			createNews: createNews,
			editNews: editNews,
			editComment: editComment,
			deleteNews: deleteNews,
			addComment: addComment,
			deleteComment: deleteComment,
			getComments: getComments,
			newsLike: newsLike,
			deleteNewsLike: deleteNewsLike,
			commentLike: commentLike,
			deleteCommentLike: deleteCommentLike,
			getServices: getServices
		};

		function getMe() {
			return $resource("api/me").get().$promise;
		}

		function getRequest() {
			return $resource("api/news/:id", { id: "@id"});
		}

		function getPost(id) {
			return $resource("api/news/:id", { id: "@id"}).get({id: id}).$promise;
		}

		function getNews(type, skip, limit, filter, dateSort, maxDate) {
			var query = '';
			query = skip ? (query + '&skip=' + skip) : query;
			query = limit ? (query + '&limit=' + limit) : query;
			query = filter ? (query + '&filter=' + filter) : query;
			query = dateSort ? (query + '&dateSort=' + dateSort) : query;
			query = maxDate ? (query + '&maxDate=' + maxDate) : query;
			return $resource("api/news?type=" + type + query).query().$promise;
		}

		function getFullUsers() {
			return $resource("profile/api/users").query().$promise;
		}

		function getRoles() {
			return $resource("auth/api/roles").query().$promise;
		}

		function getComments(newsId) {
			return $resource("api/news/:id/comments", { id: "@id"}).get({id: newsId}).$promise;
		}

		function createNews(news) {
			return $resource("api/news", {}, {
						save: { method: 'POST', 
							headers: {'Content-Type': 'application/json'}
						}
					}).save(news).$promise;
		}

		function addComment(newsId, comment) {
			var data = $resource("api/news/:id/comments", { id: "@id" }, {
				update: {method: "POST"}
			});
			return data.update({ id: newsId }, {$push:{comments: comment}}).$promise;
		}

		function editNews(newsId, news) {
			var data = $resource("api/news/:id", { id: "@id" }, {
				update: {method: "PUT"}
			});
			return data.update({ id: newsId }, news).$promise;
		}

		function editComment(newsId, commentId, comment) {
			var data = $resource("api/news/:newsId/comments/:commentId", { newsId: "@newsId", commentId: "@commentId" }, {
				update: {method: "PUT"}
			});
			return data.update({newsId: newsId, commentId: commentId}, {body: comment.body, edited_at: comment.edited_at}).$promise;
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
			var data = $resource("api/news/:id/likes", { id: "@id" }, {
				update: {method: "POST"}
			});
			return data.update({ id: newsId }).$promise;
		}

		function deleteNewsLike(newsId, userId) {
			return $resource("api/news/:id/likes", { id: "@id"}).remove({ id: newsId }).$promise;
		}

		function commentLike(newsId, commentId, userId) {
			var data = $resource("api/news/:newsId/comments/:commentId/likes", { newsId: "@newsId", commentId: "@commentId" }, {
				update: {method: "POST"}
			});
			return data.update({ newsId: newsId, commentId: commentId }).$promise;
		}

		function deleteCommentLike(newsId, commentId, userId) {
			return $resource("api/news/:newsId/comments/:commentId/likes", { newsId: "@newsId", commentId: "@commentId"}).remove({ newsId: newsId, commentId: commentId }).$promise;
		}

		/*function toggleCommentLike(newsId, commentId) {
			var data = $resource("api/news/:newsId/comments/:commentId", { newsId: "@newsId", commentId: "@commentId" }, {
				update: {method: "PUT"}
			});
			return data.update({newsId: newsId, commentId: commentId}).$promise;
		}*/

		function getServices() {
			return $resource("app/api/notificationService").query().$promise;
		}
	}
