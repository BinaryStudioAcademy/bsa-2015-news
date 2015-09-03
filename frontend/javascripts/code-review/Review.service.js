var app = require('../app');
app.factory("ReviewService", ReviewService);

ReviewService.$inject = ["$resource"];

function ReviewService($resource) {
	return {
		getRequests: getRequests,
		getUser: getUser,
		sendOffer: sendOffer,
		cancelOffer: cancelOffer
	};

	function getRequests(period) {
		return $resource("/reviewr/api/v1/reviewrequest/upcoming/" + period).query().$promise;
	}

	function getUser() {
		return $resource("/api/me").get().$promise;
	}

	function sendOffer(request, user) {
		return $resource("reviewr/api/v1/user/" + user.id + "/offeron/" + request.id).get().$promise;
	}

	function cancelOffer(request) {
		return $resource("reviewr/api/v1/user/offeroff/3" + request.id).get().$promise;
	}
}