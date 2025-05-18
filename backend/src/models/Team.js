const pool = require('../config/database');

class Team {
  static async findByUser(userId) {
    const query = `
      SELECT t.*, ARRAY_AGG(tm.user_id) AS member_ids
      FROM teams t
      LEFT JOIN team_members tm ON t.id = tm.team_id
      WHERE tm.user_id = $1 OR t.creator_id = $1
      GROUP BY t.id
      ORDER BY t.created_at DESC
    `;
    const result = await pool.query(query, [userId]);
    return result.rows;
  }

  static async create(teamData) {
    const { name, creator_id } = teamData;
    const query = `
      INSERT INTO teams (name, creator_id)
      VALUES ($1, $2) RETURNING *
    `;
    const result = await pool.query(query, [name, creator_id]);
    return result.rows[0];
  }

  static async addMember(teamId, userId) {
    const query = `
      INSERT INTO team_members (team_id, user_id)
      VALUES ($1, $2) RETURNING *
    `;
    const result = await pool.query(query, [teamId, userId]);
    return result.rows[0];
  }

  static async removeMember(teamId, userId) {
    const query = `
      DELETE FROM team_members
      WHERE team_id = $1 AND user_id = $2 RETURNING *
    `;
    const result = await pool.query(query, [teamId, userId]);
    return result.rows[0];
  }
}

module.exports = Team;