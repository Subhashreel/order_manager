"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'FoodHub Order Management API',
            version: '1.0.0',
            description: 'Complete order management with dynamic discounting and automated preparation time'
        },
    },
    apis: ['./src/routes/*.ts'],
};
