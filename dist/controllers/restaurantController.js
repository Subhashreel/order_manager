"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRestaurantById = exports.getAllRestaurants = exports.createRestaurant = void 0;
const database_1 = require("../config/database");
const createRestaurant = async (req, res) => {
    try {
        const restaurant = req.body;
        const [result] = await database_1.pool.execute(`INSERT INTO restaurants (name, location_type, base_weekday_discount, 
       base_weekend_discount, base_preparation_time, peak_hour_threshold)
       VALUES (?, ?, ?, ?, ?, ?)`, [
            restaurant.name,
            restaurant.location_type,
            restaurant.base_weekday_discount,
            restaurant.base_weekend_discount,
            restaurant.base_preparation_time,
            restaurant.peak_hour_threshold
        ]);
        res.status(201).json({
            message: 'Restaurant created successfully',
            id: result.insertId
        });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to create restaurant' });
    }
};
exports.createRestaurant = createRestaurant;
const getAllRestaurants = async (req, res) => {
    try {
        const [rows] = await database_1.pool.execute('SELECT * FROM restaurants');
        res.json(rows);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch restaurants' });
    }
};
exports.getAllRestaurants = getAllRestaurants;
const getRestaurantById = async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await database_1.pool.execute('SELECT * FROM restaurants WHERE id = ?', [id]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Restaurant not found' });
        }
        res.json(rows[0]);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch restaurant' });
    }
};
exports.getRestaurantById = getRestaurantById;
