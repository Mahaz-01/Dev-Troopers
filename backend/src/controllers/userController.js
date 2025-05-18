const pool = require('../config/database');

const getUsers = async (req, res) => {
  try {
    const query = 'SELECT id, name FROM users';
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getUsers };