"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    username: {
        type: String,
        required: true,
        lowercase: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    thumbnail: String,
    financialState: {
        netProfit: {
            type: Number,
            default: 0
        },
        netLose: {
            type: Number,
            default: 0
        },
        netPayableDue: {
            type: Number,
            default: 0
        },
        netReceivableDue: {
            type: Number,
            default: 0
        },
        totalTransaction: {
            type: Number,
            default: 0
        }
    }
}, {
    timestamps: true
});
const User = (0, mongoose_1.model)('User', userSchema);
exports.default = User;
//# sourceMappingURL=User.model.js.map