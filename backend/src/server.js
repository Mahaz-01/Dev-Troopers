const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { createServer } = require('http');
const { Server } = require('socket.io');
const config = require('./config/environment');
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');
const chatRoutes = require('./routes/chatRoutes');
const ChatRoom = require('./models/ChatRoom');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(helmet());
app.use(express.json());

// Socket.io Connection
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('joinRooms', async (userId) => {
    try {
      const chatRooms = await ChatRoom.findByUser(userId);
      chatRooms.forEach((room) => {
        socket.join(`room-${room.id}`);
        console.log(`User ${userId} joined room-${room.id}`);
      });
    } catch (error) {
      console.error('Error joining rooms:', error);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Routes
app.use('/auth', authRoutes);
app.use('/tasks', taskRoutes);
app.use('/chat', chatRoutes(io));

// Error Handler
app.use(errorHandler);

// Test Route
app.get('/', (req, res) => {
  res.json({ message: 'Team Dev Trooper Backend is running!' });
});

// Start Server
const PORT = config.port;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});