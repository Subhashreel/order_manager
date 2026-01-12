"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const restaurantController_1 = require("../controllers/restaurantController");
const router = express_1.default.Router();
/**
 * @swagger
 * /api/restaurants:
 *   post:
 *     summary: Create a new restaurant
 *     tags: [Restaurants]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - location_type
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Campus Cafe"
 *               location_type:
 *                 type: string
 *                 enum: [college, workplace, airport, city, urban]
 *                 example: "college"
 *               base_weekday_discount:
 *                 type: number
 *                 example: 5
 *               base_weekend_discount:
 *                 type: number
 *                 example: 15
 *               base_preparation_time:
 *                 type: integer
 *                 example: 20
 *               peak_hour_threshold:
 *                 type: integer
 *                 example: 10
 *     responses:
 *       201:
 *         description: Restaurant created successfully
 */
router.post('/', restaurantController_1.createRestaurant);
/**
 * @swagger
 * /api/restaurants:
 *   get:
 *     summary: Get all restaurants
 *     tags: [Restaurants]
 *     responses:
 *       200:
 *         description: List of all restaurants
 */
router.get('/', restaurantController_1.getAllRestaurants);
/**
 * @swagger
 * /api/restaurants/{id}:
 *   get:
 *     summary: Get restaurant by ID
 *     tags: [Restaurants]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Restaurant details
 */
router.get('/:id', restaurantController_1.getRestaurantById);
exports.default = router;
