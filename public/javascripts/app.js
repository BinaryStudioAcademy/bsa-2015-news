module.exports = angular.module('notifications', ['ngRoute', 'ngResource'])
	.config(['$routeProvider', '$resourceProvider', '$httpProvider', '$locationProvider',
		function($routeProvider, $resourceProvider, $httpProvider, $locationProvider) {
			$routeProvider
				.when('/', {
					templateUrl: './templates/notification/notification.html',
					controller: 'NotificationController',
					controllerAs: 'notificationCtrl'
				})
				.otherwise({
					redirectTo: '/'
				});
			$resourceProvider.defaults.stripTrailingSlashes = false;
		}
	]);