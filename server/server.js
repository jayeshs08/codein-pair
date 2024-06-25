const express = require('express');
const bodyParser = require('body-parser');

const { Server } = require('socket.io');
const http = require('http');
const axios = require('axios'); // Import axios
const cors = require('cors');

dotenv.config();

const app = express();
app.use(cors());
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000", // Update with your client URL
        methods: ["GET", "POST"]
    }
});

const PORT = process.env.PORT || 4000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));



io.on('connection', (socket) => {
    console.log('New client connected');
    
    socket.on('join_room', (roomId) => {
        socket.join(roomId);
        io.in(roomId).emit('user_count', io.sockets.adapter.rooms.get(roomId)?.size || 0);
    });

    socket.on('code_change', ({ roomId, code }) => {
        socket.to(roomId).emit('code_update', code);
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
