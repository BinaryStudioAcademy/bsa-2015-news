var app = require('../app');
app.factory("HRService", HRService);

function HRService() {
	return {
		getActivities: getActivities
	};

	function getActivities() {
		var activities = [
		{
			id: 1,
			message: "recruiter@local.com has joined Hunter",
			tag: 0,
			time: new Date("2015-08-10T00:00:00").toLocaleString(),
			url: "#/user/edit/1",
			userAlias: "HR3",
			userLogin: "recruiter2@local.com"
		},
		{
			id: 2,
			message: "someoneOther@global.net has left Hunter",
			tag: 0,
			time: new Date("2015-08-09T05:13:00").toLocaleString(),
			url: "#/user/edit/2",
			userAlias: "HR333",
			userLogin: "recruiter2@local.com"
		},
		{
			id: 3,
			message: "yetSomeOneNew@super.site has done something nice to everybody",
			tag: 0,
			time: new Date("2015-08-09T00:15:00").toLocaleString(),
			url: "#/user/edit/3",
			userAlias: "HR9000",
			userLogin: "recruiter2@local.com"
		}
		];
		return activities;
	}
}