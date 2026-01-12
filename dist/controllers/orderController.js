"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrdersByRestaurant = exports.getOrderById = exports.updateOrderStatus = exports.createOrder = void 0;
const database_1 = require("../config/database");
const orderUtils_1 = require("../utils/orderUtils");
const createOrder = async (req, res) => {
    const conn = await database_1.pool.getConnection();
    try {
        await conn.beginTransaction();
        const orderRequest = req.body;
        const [restaurants] = await conn.execute('SELECT * FROM restaurants WHERE id = ?', [orderRequest.restaurant_id]);
        if (restaurants.length === 0) {
            throw new Error('Restaurant not found');
        }
        const restaurant = restaurants[0];
        const menuItemIds = orderRequest.items.map(i => i.menu_item_id);
        const placeholders = menuItemIds.map(() => '?').join(',');
        const [menuItems] = await conn.execute(`SELECT * FROM menu_items WHERE id IN (${placeholders})`, menuItemIds);
        let subtotal = 0;
        // const orderItems = orderRequest.items.map(item => {
        //   const menuItem = menuItems.find((m: any) => m.id === item.menu_item_id);
        //   const totalPrice = menuItem.base_price * item.quantity;
        //   subtotal += totalPrice;
        //   return {
        //     ...item,
        //     unit_price: menuItem.base_price,
        //     total_price: totalPrice,
        //     preparation_complexity: menuItem.preparation_complexity
        //   };
        // });
        const orderItems = orderRequest.items.map(item => {
            const menuItem = menuItems.find((m) => m.id === item.menu_item_id);
            if (!menuItem) {
                throw new Error(`Menu item ${item.menu_item_id} not found`);
            }
            const totalPrice = menuItem.base_price * item.quantity;
            subtotal += totalPrice;
            return {
                ...item,
                unit_price: menuItem.base_price,
                total_price: totalPrice,
                preparation_complexity: menuItem.preparation_complexity
            };
        });
        const now = new Date();
        const currentHour = now.getHours();
        const [hourlyOrders] = await conn.execute(`SELECT COUNT(*) as count FROM orders 
       WHERE restaurant_id = ? 
       AND DATE(created_at) = CURDATE() 
       AND HOUR(created_at) = ?`, [orderRequest.restaurant_id, currentHour]);
        const isPeakHour = hourlyOrders[0].count >= restaurant.peak_hour_threshold;
        const discountPercentage = (0, orderUtils_1.calculateDiscount)(restaurant, isPeakHour);
        const discountAmount = (subtotal * discountPercentage) / 100;
        const totalAmount = subtotal - discountAmount;
        const estimatedPrepTime = (0, orderUtils_1.calculatePreparationTime)(restaurant.base_preparation_time, orderItems, isPeakHour);
        const [orderResult] = await conn.execute(`INSERT INTO orders (restaurant_id, customer_name, customer_phone, order_status,
       subtotal, discount_percentage, discount_amount, total_amount, 
       estimated_preparation_time, order_date, order_time)
       VALUES (?, ?, ?, 'pending', ?, ?, ?, ?, ?, CURDATE(), CURTIME())`, [
            orderRequest.restaurant_id,
            orderRequest.customer_name,
            orderRequest.customer_phone,
            subtotal,
            discountPercentage,
            discountAmount,
            totalAmount,
            estimatedPrepTime
        ]);
        const orderId = orderResult.insertId;
        for (const item of orderItems) {
            await conn.execute(`INSERT INTO order_items (order_id, menu_item_id, quantity, unit_price, total_price)
         VALUES (?, ?, ?, ?, ?)`, [orderId, item.menu_item_id, item.quantity, item.unit_price, item.total_price]);
        }
        await conn.execute('INSERT INTO order_status_history (order_id, new_status) VALUES (?, "pending")', [orderId]);
        await conn.commit();
        res.status(201).json({
            message: 'Order created successfully',
            order_id: orderId,
            subtotal,
            discount_percentage: discountPercentage,
            discount_amount: discountAmount,
            total_amount: totalAmount,
            estimated_preparation_time: estimatedPrepTime,
            is_peak_hour: isPeakHour
        });
    }
    catch (error) {
        await conn.rollback();
        res.status(500).json({
            error: 'Failed to create order',
            details: error.message
        });
    }
    finally {
        conn.release();
    }
};
exports.createOrder = createOrder;
const updateOrderStatus = async (req, res) => {
    const conn = await database_1.pool.getConnection();
    try {
        const { orderId } = req.params;
        const { status } = req.body;
        const [orders] = await conn.execute('SELECT order_status FROM orders WHERE id = ?', [orderId]);
        if (orders.length === 0) {
            return res.status(404).json({ error: 'Order not found' });
        }
        const oldStatus = orders[0].order_status;
        await conn.beginTransaction();
        await conn.execute('UPDATE orders SET order_status = ? WHERE id = ?', [status, orderId]);
        await conn.execute('INSERT INTO order_status_history (order_id, old_status, new_status) VALUES (?, ?, ?)', [orderId, oldStatus, status]);
        await conn.commit();
        res.json({
            message: 'Order status updated successfully',
            old_status: oldStatus,
            new_status: status
        });
    }
    catch (error) {
        await conn.rollback();
        res.status(500).json({ error: 'Failed to update order status' });
    }
    finally {
        conn.release();
    }
};
exports.updateOrderStatus = updateOrderStatus;
const getOrderById = async (req, res) => {
    try {
        const { orderId } = req.params;
        const [orders] = await database_1.pool.execute('SELECT * FROM orders WHERE id = ?', [orderId]);
        if (orders.length === 0) {
            return res.status(404).json({ error: 'Order not found' });
        }
        const [items] = await database_1.pool.execute(`SELECT oi.*, mi.name as item_name FROM order_items oi
       JOIN menu_items mi ON oi.menu_item_id = mi.id
       WHERE oi.order_id = ?`, [orderId]);
        const [history] = await database_1.pool.execute('SELECT * FROM order_status_history WHERE order_id = ? ORDER BY changed_at', [orderId]);
        res.json({
            order: orders[0],
            items,
            status_history: history
        });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch order' });
    }
};
exports.getOrderById = getOrderById;
const getOrdersByRestaurant = async (req, res) => {
    try {
        const { restaurantId } = req.params;
        const { status, date } = req.query;
        let query = 'SELECT * FROM orders WHERE restaurant_id = ?';
        const params = [restaurantId];
        if (status) {
            query += ' AND order_status = ?';
            params.push(status);
        }
        if (date) {
            query += ' AND order_date = ?';
            params.push(date);
        }
        query += ' ORDER BY created_at DESC';
        const [orders] = await database_1.pool.execute(query, params);
        res.json(orders);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
};
exports.getOrdersByRestaurant = getOrdersByRestaurant;
