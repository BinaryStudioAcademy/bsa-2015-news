module.exports = angular.module('news', ['ngRoute', 'ngResource', 'ui.tinymce'])
	.config(['$routeProvider', '$resourceProvider', '$httpProvider', '$locationProvider',
		function($routeProvider, $resourceProvider, $httpProvider, $locationProvider) {
			$routeProvider
				.when('/', {
					templateUrl: './templates/news/news.html',
					controller: 'NewsController',
					controllerAs: 'newsCtrl'
				})
				.otherwise({
					redirectTo: '/'
				});
			$resourceProvider.defaults.stripTrailingSlashes = false;
		}
	]);