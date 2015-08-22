module.exports = {
	uri: 'mongodb://localhost/intranet-news',
	opts: {
		server: { 
			auto_reconnect: true,
			poolSize: 40
		},
		user: 'root'
	}
};