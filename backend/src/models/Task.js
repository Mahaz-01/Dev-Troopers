const pool = require('../config/database');

  class Task {
    static async findAll(userId) {
      const query = 'SELECT * FROM tasks WHERE assigned_to = $1 OR created_by = $1';
      const result = await pool.query(query, [userId]);
      return result.rows;
    }

    static async findById(id) {
      const query = 'SELECT * FROM tasks WHERE id = $1';
      const result = await pool.query(query, [id]);
      return result.rows[0];
    }

    static async create(taskData) {
      const { title, description, status, priority, assigned_to, created_by } = taskData;
      const query = `
        INSERT INTO tasks (title, description, status, priority, assigned_to, created_by)
        VALUES ($1, $2, $3, $4, $5, $6) RETURNING *
      `;
      const result = await pool.query(query, [title, description, status, priority, assigned_to, created_by]);
      return result.rows[0];
    }

    static async update(id, taskData) {
      const { title, description, status, priority, assigned_to } = taskData;
      const query = `
        UPDATE tasks 
        SET title = $1, description = $2, status = $3, priority = $4, assigned_to = $5, updated_at = CURRENT_TIMESTAMP
        WHERE id = $6 RETURNING *
      `;
      const result = await pool.query(query, [title, description, status, priority, assigned_to, id]);
      return result.rows[0];
    }

    static async delete(id) {
      const query = 'DELETE FROM tasks WHERE id = $1 RETURNING *';
      const result = await pool.query(query, [id]);
      return result.rows[0];
    }
  }

  module.exports = Task;