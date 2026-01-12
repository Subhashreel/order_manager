"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const restaurantRoutes_1 = __importDefault(require("./restaurantRoutes"));
const menuRoutes_1 = __importDefault(require("./menuRoutes"));
const orderRoutes_1 = __importDefault(require("./orderRoutes"));
const router = express_1.default.Router();
router.use('/restaurants', restaurantRoutes_1.default);
router.use('/menu', menuRoutes_1.default);
router.use('/orders', orderRoutes_1.default);
exports.default = router;
