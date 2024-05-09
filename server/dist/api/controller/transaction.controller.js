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
exports.transactionDeleteController = exports.allTransactionsGetController = exports.transactionEditPutController = exports.transactionCreatePostController = void 0;
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
    else {
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
            if (transactionType === 'income') {
                const netLoseCalculation = user.financialState.netLose !== 0 && user.financialState.netLose >= user.financialState.netProfit ? user.financialState.netLose - transaction.amount.received : 0;
                yield User_model_1.default.findOneAndUpdate({ _id: user._id }, { $set: {
                        "financialState": {
                            "netProfit": user.financialState.netProfit + transaction.amount.received,
                            "netLose": netLoseCalculation,
                            "netPayableDue": user.financialState.netPayableDue,
                            "netReceivableDue": user.financialState.netReceivableDue + transaction.amount.due,
                        }
                    } });
            }
            else if (transactionType === 'expense') {
                const netProfitCalculation = user.financialState.netProfit !== 0 && user.financialState.netProfit >= user.financialState.netLose ? user.financialState.netProfit - transaction.amount.paid : 0;
                yield User_model_1.default.findOneAndUpdate({ _id: user._id }, { $set: {
                        "financialState": {
                            "netProfit": netProfitCalculation,
                            "netLose": user.financialState.netLose + transaction.amount.paid,
                            "netPayableDue": user.financialState.netPayableDue + transaction.amount.due,
                            "netReceivableDue": user.financialState.netReceivableDue
                        }
                    } });
            }
            const response = {
                status: 200,
                message: 'Transaction successfully created',
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
    }
});
exports.transactionCreatePostController = transactionCreatePostController;
const transactionEditPutController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { transaction_type, to_from, total, paid, received, due, date, description } = req.body;
    const transactionType = transaction_type.toLowerCase();
    const { transactionId } = req.params;
    const validTransaction = yield Transaction_model_1.default.findById(transactionId);
    if (validTransaction) {
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
        else {
            try {
                yield Transaction_model_1.default.findOneAndUpdate({ _id: validTransaction._id }, { transactionType,
                    to_from,
                    amount: {
                        total,
                        paid: transactionType === 'income' ? 0 : paid,
                        received: transactionType === 'expense' ? 0 : received,
                        due
                    },
                    date,
                    description }, { new: true });
                const updatedTransaction = yield Transaction_model_1.default.findById(transactionId);
                const response = {
                    status: 200,
                    message: 'Transaction successfully updated',
                    data: {
                        id: updatedTransaction._id,
                        transactionType: updatedTransaction.transactionType,
                        to_from: updatedTransaction.to_from,
                        date: updatedTransaction.date,
                        description: updatedTransaction.description
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
        }
    }
    else {
        const response = {
            status: 404,
            message: `Transaction item not found`
        };
        res.json(response);
    }
});
exports.transactionEditPutController = transactionEditPutController;
const allTransactionsGetController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const customReq = req;
    try {
        const transactions = yield Transaction_model_1.default.find({ user: customReq.user.id });
        if (transactions) {
            const response = {
                status: 200,
                message: 'successfully retrieved data',
                data: transactions
            };
            res.json(response);
        }
        else {
            const response = {
                status: 404,
                message: `Transactions not found`
            };
            res.json(response);
        }
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
exports.allTransactionsGetController = allTransactionsGetController;
const transactionDeleteController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { transactionId } = req.params;
    try {
        const validTransaction = yield Transaction_model_1.default.findById(transactionId);
        if (validTransaction) {
            yield Transaction_model_1.default.deleteOne({ _id: validTransaction._id });
            const response = {
                status: 200,
                message: 'successfully deleted',
            };
            res.json(response);
        }
        else {
            const response = {
                status: 404,
                message: `Transactions not found`
            };
            res.json(response);
        }
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
exports.transactionDeleteController = transactionDeleteController;
//# sourceMappingURL=transaction.controller.js.map