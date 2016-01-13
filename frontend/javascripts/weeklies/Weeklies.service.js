var app = require('../app.js');
	app.factory('WeekliesService', WeekliesService);

	WeekliesService.$inject = ["$resource"];

	function WeekliesService($resource) {
		return {
			getPacks: getPacks,
			createPack: createPack,
			removePack: removePack,
			updatePack: updatePack,
			pushNewsToPack: pushNewsToPack,
			removeNewsFromPack: removeNewsFromPack
		};

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
