import { Request, Response } from 'express';
import { pool } from '../config/database';
import { Restaurant } from '../models/types';

export const createRestaurant = async (req: Request, res: Response) => {
  try {
    const restaurant: Restaurant = req.body;
    const [result] = await pool.execute(
      `INSERT INTO restaurants (name, location_type, base_weekday_discount, 
       base_weekend_discount, base_preparation_time, peak_hour_threshold)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        restaurant.name,
        restaurant.location_type,
        restaurant.base_weekday_discount,
        restaurant.base_weekend_discount,
        restaurant.base_preparation_time,
        restaurant.peak_hour_threshold
      ]
    );
    res.status(201).json({ 
      message: 'Restaurant created successfully', 
      id: (result as any).insertId 
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create restaurant' });
  }
};

export const getAllRestaurants = async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM restaurants');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch restaurants' });
  }
};

export const getRestaurantById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const [rows]: any = await pool.execute(
      'SELECT * FROM restaurants WHERE id = ?',
      [id]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }
    
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch restaurant' });
  }
};