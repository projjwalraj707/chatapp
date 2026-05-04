import { Server } from "socket.io";

const SocketHandler = (req, res) => {
    if (!res.socket.server.io) {
        console.log("Initializing Socket.io server...");
        const io = new Server(res.socket.server);
        res.socket.server.io = io;
        io.on("connection", (socket) => {
            console.log("A user connected: " + socket.id);
            socket.on("disconnect", () => {
                console.log("A user disconnected: " + socket.id);
            });
        });
    }
    res.end();
}

export { SocketHandler as GET, SocketHandler as POST };