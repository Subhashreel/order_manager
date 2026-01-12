import { pool } from './database';

async function testConnection() {
  try {
    const [rows] = await pool.query('SELECT 1 + 1 AS result');
    console.log('Database connected:', rows);
  } catch (error) {
    console.error('Database connection failed:', error);
  }
}

testConnection();