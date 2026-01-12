"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("./database");
async function testConnection() {
    try {
        const [rows] = await database_1.pool.query('SELECT 1 + 1 AS result');
        console.log('Database connected:', rows);
    }
    catch (error) {
        console.error('Database connection failed:', error);
    }
}
testConnection();
