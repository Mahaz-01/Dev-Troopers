const pool = require('../config/database');

class ChatRoom {
  static async create(name, userIds, teamId = null, creatorId = null) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const chatRoomQuery = `
        INSERT INTO chat_rooms (name, team_id, creator_id)
        VALUES ($1, $2, $3) RETURNING *
      `;
      const chatRoomResult = await client.query(chatRoomQuery, [name, teamId, creatorId || userIds[0]]);
      const chatRoom = chatRoomResult.rows[0];

      const memberQuery = `
        INSERT INTO chat_room_members (chat_room_id, user_id)
        VALUES ($1, $2)
      `;
      for (const userId of userIds) {
        await client.query(memberQuery, [chatRoom.id, userId]);
      }

      await client.query('COMMIT');
      return chatRoom;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  static async findByUser(userId) {
    const query = `
      SELECT cr.*, u.name AS creator_name
      FROM chat_rooms cr
      JOIN chat_room_members crm ON cr.id = crm.chat_room_id
      JOIN users u ON cr.creator_id = u.id
      WHERE crm.user_id = $1
    `;
    const result = await pool.query(query, [userId]);
    const chatRooms = result.rows;

    for (const room of chatRooms) {
      const membersQuery = `
        SELECT u.id, u.name
        FROM chat_room_members crm
        JOIN users u ON crm.user_id = u.id
        WHERE crm.chat_room_id = $1
      `;
      const membersResult = await pool.query(membersQuery, [room.id]);
      room.members = membersResult.rows;
    }

    return chatRooms;
  }

  static async findByTeam(teamId) {
    const query = `
      SELECT * FROM chat_rooms
      WHERE team_id = $1
    `;
    const result = await pool.query(query, [teamId]);
    return result.rows[0] || null;
  }
}

module.exports = ChatRoom;