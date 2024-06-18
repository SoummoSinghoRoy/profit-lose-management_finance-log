"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_route_1 = __importDefault(require("./auth.route"));
const transaction_route_1 = __importDefault(require("./transaction.route"));
const search_route_1 = __importDefault(require("./search.route"));
const routes = [
    {
        path: '/api/search',
        handler: search_route_1.default
    },
    {
        path: '/api/transaction',
        handler: transaction_route_1.default
    },
    {
        path: '/api/auth',
        handler: auth_route_1.default
    },
    {
        path: '/',
        handler: (res) => {
            res.status(200).json({
                msg: `Server running properly`
            });
        }
    }
];
exports.default = (app) => {
    routes.forEach(route => {
        if (route.path == '/') {
            app.get(route.path, route.handler);
        }
        else {
            app.use(route.path, route.handler);
        }
    });
};
//# sourceMappingURL=route.js.map