"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.transactionCreatePostController = void 0;
const transaction_validation_1 = __importDefault(require("../../validation/transaction.validation"));
const Transaction_model_1 = __importDefault(require("../../model/Transaction.model"));
const User_model_1 = __importDefault(require("../../model/User.model"));
const transactionCreatePostController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const customReq = req;
    const { transaction_type, to_from, total, paid, received, due, date, description } = req.body;
    const transactionType = transaction_type.toLowerCase();
    const validation = (0, transaction_validation_1.default)({ transactionType, to_from, total, paid, received, due, date, description });
    if (!validation.isValid) {
        const validationresult = {
            status: 400,
            message: 'Error occurred',
            error: {
                message: validation.error
            }
        };
        res.json(validationresult);
    }
    try {
        const user = yield User_model_1.default.findById(customReq.user.id);
        const registeredTransaction = new Transaction_model_1.default({
            transactionType,
            to_from,
            amount: {
                total,
                paid: transactionType === 'income' ? 0 : paid,
                received: transactionType === 'expense' ? 0 : received,
                due
            },
            date,
            description,
            user: user._id
        });
        const transaction = yield registeredTransaction.save();
        const response = {
            status: 200,
            message: 'User successfully created',
            data: {
                id: transaction._id,
                transactionType: transaction.transactionType,
                to_from: transaction.to_from,
                date: transaction.date,
                description: transaction.description
            }
        };
        res.json(response);
    }
    catch (error) {
        console.log(error);
        const response = {
            status: 500,
            message: 'Error occurred, get back soon',
            error: { message: 'Internal server error' }
        };
        res.json(response);
    }
});
exports.transactionCreatePostController = transactionCreatePostController;
//# sourceMappingURL=transaction.controller.js.map