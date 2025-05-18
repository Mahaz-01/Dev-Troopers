const pool = require('../config/database');

class Message {
  static async findByChatRoom(chatRoomId) {
    const query = `
      SELECT m.*, u.name AS sender_name
      FROM messages m
      JOIN users u ON m.sender_id = u.id
      WHERE m.chat_room_id = $1
      ORDER BY m.created_at ASC
    `;
    const result = await pool.query(query, [chatRoomId]);
    return result.rows;
  }

  static async create(messageData) {
    const { chat_room_id, sender_id, content } = messageData;
    const query = `
      INSERT INTO messages (chat_room_id, sender_id, content)
      VALUES ($1, $2, $3) RETURNING *
    `;
    const result = await pool.query(query, [chat_room_id, sender_id, content]);
    return result.rows[0];
  }
}

module.exports = Message;