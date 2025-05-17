const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config/environment');

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findByEmail(email);

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, config.jwtSecret, { expiresIn: '1h' });
    res.json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const logout = (req, res) => {
  res.json({ message: 'Logout successful' });
};

const signup = async (req, res) => {
  try {
    const { email, password, name, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    // Create new user
    const user = await User.create({ email, password, name, role });

    // Generate JWT token
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, config.jwtSecret, { expiresIn: '1h' });
    res.status(201).json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  login,
  logout,
  signup
};