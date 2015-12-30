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
        socket.on("delete post", function(postId) {
            io.emit("splice post", postId);
        });
        socket.on("like comment", function(comment) {
            io.emit("change like comment", comment);
        });
        socket.on("like post", function(newPost) {
            io.emit("change like post", newPost);
        });
        socket.on("new comment", function(commnet) {
            io.emit("push comment", commnet);
        });
        socket.on("delete comment", function(commentDetails) {
            io.emit("splice comment", commentDetails);
        });
    });
};