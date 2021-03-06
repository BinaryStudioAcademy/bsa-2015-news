var app = require('../app.js');
	app.factory('WeekliesService', WeekliesService);

	WeekliesService.$inject = ["$resource"];

	function WeekliesService($resource) {
		return {
			getPack: getPack,
			getPacks: getPacks,
			createPack: createPack,
			removePack: removePack,
			updatePack: updatePack,
			pushNewsToPack: pushNewsToPack,
			removeNewsFromPack: removeNewsFromPack
		};

		function getPack(id) {
			return $resource("api/packs/:id", {id: '@id'}).get({id: id}).$promise;
		}

		function getPacks(skip, limit, published, filter, maxDate) {
			var query = '';
			query = skip ? (query + '?skip=' + skip) : (query + '?skip=' + 0);
			query = limit ? (query + '&limit=' + limit) : query;
			query = published ? (query + '&published=yes') : query;
			query = filter ? (query + '&filter=' + filter) : query;
			query = maxDate ? (query + '&maxDate=' + maxDate) : query;
			return $resource('api/packs' + query).query().$promise;
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

		function updatePack(id, newPack) {
			var data = $resource("api/packs/:id", { id: "@id"}, {
				update: {method: "PUT"}
			});
			return data.update({id: id}, newPack).$promise;
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
