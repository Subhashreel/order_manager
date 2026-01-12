"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculatePreparationTime = exports.calculateDiscount = void 0;
const LOCATION_MULTIPLIERS = {
    college: 1.3,
    workplace: 1.2,
    airport: 1.1,
    city: 1.05,
    urban: 1.0
};
const calculateDiscount = (restaurant, isPeakHour) => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    let discount = isWeekend
        ? restaurant.base_weekend_discount
        : restaurant.base_weekday_discount;
    const locationMultiplier = LOCATION_MULTIPLIERS[restaurant.location_type] || 1.0;
    discount *= locationMultiplier;
    if (isPeakHour) {
        discount *= 0.7;
    }
    return Math.min(discount, 50);
};
exports.calculateDiscount = calculateDiscount;
const calculatePreparationTime = (baseTime, orderItems, isPeakHour) => {
    const totalComplexity = orderItems.reduce((sum, item) => sum + (item.quantity * item.preparation_complexity), 0);
    let prepTime = baseTime + (totalComplexity * 2);
    if (isPeakHour) {
        prepTime *= 1.5;
    }
    return Math.ceil(prepTime / 5) * 5;
};
exports.calculatePreparationTime = calculatePreparationTime;
