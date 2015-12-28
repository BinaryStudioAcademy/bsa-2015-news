var app = require('../app.js');
	app.factory('AdministrationService', AdministrationService);

	AdministrationService.$inject = ["$resource"];

	function AdministrationService($resource) {
		return {
			getLocalRoles: getLocalRoles,
			getLocalUsers: getLocalUsers
		};

		function getLocalRoles() {
			return $resource("api/roles").query().$promise;
		}

		function getLocalUsers() {
			return $resource("api/users").query().$promise;
		}
	}
