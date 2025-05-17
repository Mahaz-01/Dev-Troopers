require('dotenv').config();

module.exports = {
  port: process.env.PORT || 5000,
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_NAME || 'team_dev_trooper_db'
  },
  jwtSecret: process.env.JWT_SECRET || 'your_jwt_secret_key'
};