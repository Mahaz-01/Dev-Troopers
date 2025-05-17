const pool = require('../config/database');

class Message {
  static async findByUser(userId) {
    const query = `
      SELECT m.*, u1.name AS sender_name, u2.name AS receiver_name
      FROM messages m
      JOIN users u1 ON m.sender_id = u1.id
      JOIN users u2 ON m.receiver_id = u2.id
      WHERE m.sender_id = $1 OR m.receiver_id = $1
      ORDER BY m.created_at ASC
    `;
    const result = await pool.query(query, [userId]);
    return result.rows;
  }

  static async create(messageData) {
    const { sender_id, receiver_id, content } = messageData;
    const query = `
      INSERT INTO messages (sender_id, receiver_id, content)
      VALUES ($1, $2, $3) RETURNING *
    `;
    const result = await pool.query(query, [sender_id, receiver_id, content]);
    return result.rows[0];
  }
}

module.exports = Message;