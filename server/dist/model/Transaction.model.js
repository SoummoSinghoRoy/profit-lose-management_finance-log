"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const moment_1 = __importDefault(require("moment"));
const transactionSchema = new mongoose_1.Schema({
    transactionType: {
        type: String,
        required: true
    },
    to_from: {
        type: String,
        required: true
    },
    amount: {
        total: {
            type: Number,
            default: 0,
            required: true
        },
        paid: {
            type: Number,
            default: 0,
            required: true
        },
        received: {
            type: Number,
            default: 0,
            required: true
        },
        due: {
            type: Number,
            default: 0,
            required: true
        }
    },
    date: {
        type: String,
        required: true,
        set: (v) => (0, moment_1.default)(v, 'YYYY-MM-DD').format('YYYY-MM-DD'),
        get: (v) => (0, moment_1.default)(v, 'YYYY-MM-DD').format('DD-MM-YYYY')
    },
    description: {
        type: String,
        required: true
    },
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});
const Transaction = (0, mongoose_1.model)('Transaction', transactionSchema);
exports.default = Transaction;
//# sourceMappingURL=Transaction.model.js.map