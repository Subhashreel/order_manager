"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMenuByRestaurant = exports.createMenuItem = void 0;
const database_1 = require("../config/database");
const createMenuItem = async (req, res) => {
    try {
        const item = req.body;
        const [result] = await database_1.pool.execute(`INSERT INTO menu_items (restaurant_id, name, category, base_price, preparation_complexity)
       VALUES (?, ?, ?, ?, ?)`, [
            item.restaurant_id,
            item.name,
            item.category,
            item.base_price,
            item.preparation_complexity
        ]);
        res.status(201).json({
            message: 'Menu item created successfully',
            id: result.insertId
        });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to create menu item' });
    }
};
exports.createMenuItem = createMenuItem;
const getMenuByRestaurant = async (req, res) => {
    try {
        const { restaurantId } = req.params;
        const [rows] = await database_1.pool.execute('SELECT * FROM menu_items WHERE restaurant_id = ?', [restaurantId]);
        res.json(rows);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch menu items' });
    }
};
exports.getMenuByRestaurant = getMenuByRestaurant;
