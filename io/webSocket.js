module.exports = function(io) {
    return io.on("connection", function(socket) {
        socket.on("new post", function(post) {
            io.emit("push post", post);
        });
        socket.on("new comment", function(commnet) {
            io.emit("push comment", commnet);
        });
    });
};