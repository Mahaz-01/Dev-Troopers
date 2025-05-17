const pool = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
  static async findByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await pool.query(query, [email]);
    return result.rows[0];
  }

  static async create(userData) {
    const { email, password, name, role } = userData;
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = 'INSERT INTO users (email, password, name, role) VALUES ($1, $2, $3, $4) RETURNING *';
    const result = await pool.query(query, [email, hashedPassword, name, role]);
    return result.rows[0];
  }
}

module.exports = User;