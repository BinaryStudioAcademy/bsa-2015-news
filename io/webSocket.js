module.exports = function(io) {
	return io.on("connection", function(socket) {
		socket.on("new post", function(post) {
			io.emit("push post", post);
		});
		socket.on("edit post", function(newPost) {
			io.emit("change post", newPost);
		});
		socket.on("edit comment", function(data) {
			io.emit("change comment", data);
		});
		socket.on("delete post", function(postId, type) {
			io.emit("splice post", postId, type);
		});
		socket.on("like comment", function(comment) {
			io.emit("change like comment", comment);
		});
		socket.on("like post", function(newPost) {
			io.emit("change like post", newPost);
		});
		socket.on("new comment", function(comment) {
			io.emit("push comment", comment);
		});
		socket.on("delete comment", function(commentDetails) {
			io.emit("splice comment", commentDetails);
		});
		socket.on("new pack", function(pack) {
			io.emit("push pack", pack);
		});
		socket.on("edit pack", function(data) {
			io.emit("change pack", data);
		});
		socket.on("delete pack", function(packId) {
			io.emit("splice pack", packId);
		});
	});
};