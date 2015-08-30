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
