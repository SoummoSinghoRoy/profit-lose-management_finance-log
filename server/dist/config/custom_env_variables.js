"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const env_variables = {
    db_uri: process.env.DB_URI || '',
    db_admin: process.env.DB_ADMIN || '',
    db_password: process.env.DB_PASSWORD || '',
    secret_key: process.env.SECRET_KEY || ''
};
exports.default = env_variables;
//# sourceMappingURL=custom_env_variables.js.map