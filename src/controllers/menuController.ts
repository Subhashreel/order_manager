import { Request, Response } from 'express';
import { pool } from '../config/database';
import { MenuItem } from '../models/types';

export const createMenuItem = async (req: Request, res: Response) => {
  try {
    const item: MenuItem = req.body;
    const [result] = await pool.execute(
      `INSERT INTO menu_items (restaurant_id, name, category, base_price, preparation_complexity)
       VALUES (?, ?, ?, ?, ?)`,
      [
        item.restaurant_id, 
        item.name, 
        item.category, 
        item.base_price, 
        item.preparation_complexity
      ]
    );
    res.status(201).json({ 
      message: 'Menu item created successfully', 
      id: (result as any).insertId 
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create menu item' });
  }
};

export const getMenuByRestaurant = async (req: Request, res: Response) => {
  try {
    const { restaurantId } = req.params;
    const [rows] = await pool.execute(
      'SELECT * FROM menu_items WHERE restaurant_id = ?',
      [restaurantId]
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch menu items' });
  }
};