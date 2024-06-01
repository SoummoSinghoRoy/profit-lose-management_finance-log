"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const middlewares = [
    (0, morgan_1.default)('dev'),
    express_1.default.urlencoded({ extended: true }),
    express_1.default.json(),
    (0, cors_1.default)()
];
exports.default = (app) => {
    middlewares.forEach((middleware) => {
        app.use(middleware);
    });
};
//# sourceMappingURL=middleware.js.map