var app = require('../app.js');
	app.factory('AdministrationService', AdministrationService);

	AdministrationService.$inject = ["$resource"];

	function AdministrationService($resource) {
		return {
			getLocalRoles: getLocalRoles,
			createLocalRole: createLocalRole,
			updateLocalRole: updateLocalRole,
			getLocalUsers: getLocalUsers,
			createLocalUser: createLocalUser,
			updateLocalUser: updateLocalUser
		};

		function getLocalRoles() {
			return $resource("api/roles").query().$promise;
		}

		function createLocalRole(role) {
			var data = $resource("api/roles", {}, {
				save: { 
					method: 'POST', 
					headers: {'Content-Type': 'application/json'}
				}
			});
			return data.save({ local_role: role.local_role, global_role: role.role }).$promise;
		}

		function updateLocalRole(role) {
			var data = $resource("api/roles/:id", { id: "@id" }, {
				update: {method: "PUT"}
			});
			return data.update({ id: role.local_role_id }, { local_role: role.local_role }).$promise;
		}

		function getLocalUsers() {
			return $resource("api/users").query().$promise;
		}

		function createLocalUser(user) {
			var data = $resource("api/users", {}, {
				save: { 
					method: 'POST', 
					headers: {'Content-Type': 'application/json'}
				}
			});
			return data.save({ global_id: user.serverUserId, local_role: user.local_role }).$promise;
		}

		function updateLocalUser(user) {
			var data = $resource("api/users/:id", { id: "@id" }, {
				update: {method: "PUT"}
			});
			return data.update({ id: user.local_user_id }, { local_role: user.local_role }).$promise;
		}
	}
