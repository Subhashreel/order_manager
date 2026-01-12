"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const menuController_1 = require("../controllers/menuController");
const router = express_1.default.Router();
/**
 * @swagger
 * /api/menu:
 *   post:
 *     summary: Create a menu item
 *     tags: [Menu]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               restaurant_id:
 *                 type: integer
 *                 example: 1
 *               name:
 *                 type: string
 *                 example: "Margherita Pizza"
 *               category:
 *                 type: string
 *                 enum: [appetizer, main, dessert, beverage]
 *                 example: "main"
 *               base_price:
 *                 type: number
 *                 example: 12.99
 *               preparation_complexity:
 *                 type: number
 *                 example: 1.5
 *     responses:
 *       201:
 *         description: Menu item created
 */
router.post('/', menuController_1.createMenuItem);
/**
 * @swagger
 * /api/menu/restaurant/{restaurantId}:
 *   get:
 *     summary: Get menu items for a restaurant
 *     tags: [Menu]
 *     parameters:
 *       - in: path
 *         name: restaurantId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Menu items list
 */
router.get('/restaurant/:restaurantId', menuController_1.getMenuByRestaurant);
exports.default = router;
