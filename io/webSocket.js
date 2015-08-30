module.exports = function(io) {
    return io.on("connection", function(socket) {
        console.log("Connected new user");

        socket.on("client message", function(msg) {
            console.log(msg);
            io.emit("server message", "message from server");
        });
    });
};