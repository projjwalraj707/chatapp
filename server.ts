import { createServer } from "http";
import next from "next";
import { Server } from "socket.io";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer();

  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  // Make io globally accessible
  (global as any).io = io;

  httpServer.on("request", (req, res) => {
    if (req.url?.startsWith("/socket.io")) return;
    handler(req, res);
  });

  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    socket.on("join_room", (username, room) => {
      socket.join(room);
      console.log(`User ${username} joined room: ${room}`);
    });

    socket.on("leave_room", (username, room) => {
      socket.leave(room);
      console.log(`User ${username} left room: ${room}`);
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });

  httpServer
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});
