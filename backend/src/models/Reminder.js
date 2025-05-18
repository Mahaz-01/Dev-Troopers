const pool = require('../config/database');

class Reminder {
  static async findByUser(userId) {
    const query = `
      SELECT * FROM reminders
      WHERE user_id = $1
      ORDER BY due_date ASC
    `;
    const result = await pool.query(query, [userId]);
    return result.rows;
  }

  static async create(reminderData) {
    const { user_id, title, description, due_date } = reminderData;
    const query = `
      INSERT INTO reminders (user_id, title, description, due_date)
      VALUES ($1, $2, $3, $4) RETURNING *
    `;
    const result = await pool.query(query, [user_id, title, description, due_date]);
    return result.rows[0];
  }

  static async update(id, reminderData) {
    const { title, description, due_date, is_completed } = reminderData;
    const query = `
      UPDATE reminders
      SET title = $1, description = $2, due_date = $3, is_completed = $4
      WHERE id = $5 RETURNING *
    `;
    const result = await pool.query(query, [title, description, due_date, is_completed, id]);
    return result.rows[0];
  }

  static async delete(id) {
    const query = 'DELETE FROM reminders WHERE id = $1 RETURNING *';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }
}

module.exports = Reminder;