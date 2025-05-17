const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const config = require('./config/environment');
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');
const chatRoutes = require('./routes/chatRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());

// Routes
app.use('/auth', authRoutes);
app.use('/tasks', taskRoutes);
app.use('/chat', chatRoutes);

// Error Handler
app.use(errorHandler);

// Test Route
app.get('/', (req, res) => {
  res.json({ message: 'Team Dev Trooper Backend is running!' });
});

// Start Server
const PORT = config.port;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});