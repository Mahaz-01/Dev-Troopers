const pool = require('../config/database');

class ChatRoom {
  static async findByUser(userId) {
    const query = `
      SELECT cr.*, array_agg(crm.user_id) AS members
      FROM chat_rooms cr
      JOIN chat_room_members crm ON cr.id = crm.chat_room_id
      WHERE crm.user_id = $1
      GROUP BY cr.id
    `;
    const result = await pool.query(query, [userId]);
    return result.rows;
  }

  static async findMembers(chatRoomId) {
    const query = `
      SELECT u.id, u.name
      FROM users u
      JOIN chat_room_members crm ON u.id = crm.user_id
      WHERE crm.chat_room_id = $1
    `;
    const result = await pool.query(query, [chatRoomId]);
    return result.rows;
  }
}

module.exports = ChatRoom;