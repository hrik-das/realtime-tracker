const express = require("express");
const app = express();
const path = require("path");

const http = require("http");
const socketIO = require("socket.io");
const server = http.createServer(app);
const io = socketIO(server);

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, "public")));

// Set up the view engine
app.set("view engine", "ejs");

io.on("connection", (socket) => {
    console.log("A user connected");

    socket.on("send-location", (data) => {
        console.log("Location received:", data);
        // Broadcast location to all connected clients
        io.emit("update-location", { id: socket.id, ...data });
    });

    socket.on("disconnect", () => {
        io.emit("user-disconnected", socket.id);
    });
});

app.get("/", (req, res) => {
    res.render("index");
});

server.listen(3000, () => {
    console.log("Server listening on port 3000");
});