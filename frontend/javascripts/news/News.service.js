var app = require('../app.js');
	app.factory('NewsService', NewsService);

	NewsService.$inject = ["$resource"];

	function NewsService($resource) {
		return {
			getNews: getNews,
			createNews: createNews,
			editNews: editNews,
			deleteNews: deleteNews
		};

		function getRequest() {
			return $resource("/api/news/:id", { id: "@id"});
		}

		function getNews() {
			return $resource("/api/news").query().$promise;
		}

		function createNews(news) {
			//return  $resource().query().$promise.save(news).$promise;
			return $resource("/api/news", {}, {
						save: { method: 'POST', 
							headers: {'Content-Type': 'application/json'}
						}
					}).save(news).$promise;
		}

		function editNews(newsId, news) {
			var data = $resource("/api/news/:id", { id: "@id" }, {
				update: {
					method: "PUT"
				}
			});
			return data.update({ id: newsId }, news).$promise;
		}

		function deleteNews(newsId) {
			return getRequest().remove({ id: newsId }).$promise;
		}
	}
