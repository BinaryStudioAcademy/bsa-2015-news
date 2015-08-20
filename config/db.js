module.exports = {
	uri: 'mongodb://localhost/intranet-notifications',
	opts: {
		server: { 
			auto_reconnect: true,
			poolSize: 40
		},
		user: 'root'
	}
};