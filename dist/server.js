"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const routes_1 = __importDefault(require("./routes")); // Import the central index.ts file from the routes folder
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)({ origin: '*' }));
app.use(express_1.default.json());
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: { title: 'FoodHub API', version: '1.0.0' },
        servers: [{ url: 'http://localhost:5000' }]
    },
    apis: ['./src/routes/*.ts']
};
const swaggerSpec = (0, swagger_jsdoc_1.default)(swaggerOptions);
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerSpec));
// Use all routes from the central index.ts file
app.use('/api', routes_1.default);
app.listen(5000, () => console.log('Server running on port 5000'));
