import express from 'express';
import restaurantRoutes from './restaurantRoutes';
import menuRoutes from './menuRoutes';
import orderRoutes from './orderRoutes';

const router = express.Router();

router.use('/restaurants', restaurantRoutes);
router.use('/menu', menuRoutes);
router.use('/orders', orderRoutes);

export default router;