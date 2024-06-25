const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
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

app.post('/run-code', async (req, res) => {
    console.log('Received /run-code request');
    const { source_code, language } = req.body;

    const languageMapping = {
        javascript: 63,
        python: 71,
        java: 62,
        c: 50,
        cpp: 54,
    };

    const language_id = languageMapping[language];

    try {
        const submitResponse = await axios.post('https://api.judge0.com/submissions', {
            source_code,
            language_id
        }, {
            headers: {
                'Content-Type': 'application/json',
                'X-RapidAPI-Key': "b01387a951msh5f42de4e5ed3e74p12137bjsnc2375c6c7caf"
            }
        });

        const { token } = submitResponse.data;

        // Fetch the result after a delay
        setTimeout(async () => {
            const outputResponse = await axios.get(`https://api.judge0.com/submissions/${token}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'X-RapidAPI-Key': "b01387a951msh5f42de4e5ed3e74p12137bjsnc2375c6c7caf"
                }
            });

            const outputData = outputResponse.data;
            res.json({ output: outputData.stdout || outputData.stderr });
        }, 2000);
    } catch (error) {
        console.error('Error executing code:', error);
        res.status(500).json({ error: 'Code execution failed' });
    }
});

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
