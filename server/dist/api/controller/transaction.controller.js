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
exports.transactionDeleteController = exports.allTransactionsGetController = exports.dueTransactionUpdateController = exports.transactionEditPutController = exports.transactionCreatePostController = void 0;
const transaction_validation_1 = __importDefault(require("../../validation/transaction.validation"));
const Transaction_model_1 = __importDefault(require("../../model/Transaction.model"));
const User_model_1 = __importDefault(require("../../model/User.model"));
const updateDueTransaction_validation_1 = __importDefault(require("../../validation/updateDueTransaction.validation"));
const transactionCreatePostController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const customReq = req;
    const { transactionType, to_from, total, paid, received, due, date, description } = req.body;
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
                yield User_model_1.default.findOneAndUpdate({ _id: user._id }, { $set: {
                        "financialState": {
                            "netProfit": user.financialState.netProfit + transaction.amount.received,
                            "netLose": user.financialState.netLose,
                            "netPayableDue": user.financialState.netPayableDue,
                            "netReceivableDue": user.financialState.netReceivableDue + transaction.amount.due,
                            "totalTransaction": user.financialState.totalTransaction + transaction.amount.total
                        }
                    } });
            }
            else if (transactionType === 'expense') {
                yield User_model_1.default.findOneAndUpdate({ _id: user._id }, { $set: {
                        "financialState": {
                            "netProfit": user.financialState.netProfit,
                            "netLose": user.financialState.netLose + transaction.amount.paid,
                            "netPayableDue": user.financialState.netPayableDue + transaction.amount.due,
                            "netReceivableDue": user.financialState.netReceivableDue,
                            "totalTransaction": user.financialState.totalTransaction + transaction.amount.total
                        }
                    } });
            }
            const userState = yield User_model_1.default.findById(customReq.user.id);
            const response = {
                status: 200,
                message: 'Transaction successfully created',
                data: {
                    id: transaction._id,
                    transactionType: transaction.transactionType,
                    to_from: transaction.to_from,
                    amount: {
                        total: transaction.amount.total,
                        paid: transaction.amount.paid,
                        received: transaction.amount.received,
                        due: transaction.amount.due
                    },
                    date: transaction.date,
                    description: transaction.description
                },
                financialState: {
                    netProfit: (userState === null || userState === void 0 ? void 0 : userState.financialState.netProfit) || 0,
                    netLose: (userState === null || userState === void 0 ? void 0 : userState.financialState.netLose) || 0,
                    netPayableDue: (userState === null || userState === void 0 ? void 0 : userState.financialState.netPayableDue) || 0,
                    netReceivableDue: (userState === null || userState === void 0 ? void 0 : userState.financialState.netReceivableDue) || 0,
                    totalTransaction: (userState === null || userState === void 0 ? void 0 : userState.financialState.totalTransaction) || 0
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
    const customReq = req;
    const { transactionType, to_from, total, paid, received, due, date, description } = req.body;
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
                const user = yield User_model_1.default.findById(customReq.user.id);
                if (updatedTransaction.transactionType === 'income') {
                    yield User_model_1.default.findOneAndUpdate({ _id: user._id }, { $set: {
                            "financialState": {
                                "netProfit": (user.financialState.netProfit - validTransaction.amount.received) + updatedTransaction.amount.received,
                                "netLose": user.financialState.netLose,
                                "netPayableDue": user.financialState.netPayableDue,
                                "netReceivableDue": (user.financialState.netReceivableDue - validTransaction.amount.due) + updatedTransaction.amount.due,
                                "totalTransaction": (user.financialState.totalTransaction - validTransaction.amount.total) + updatedTransaction.amount.total
                            }
                        } });
                }
                else if (updatedTransaction.transactionType === 'expense') {
                    yield User_model_1.default.findOneAndUpdate({ _id: user._id }, { $set: {
                            "financialState": {
                                "netProfit": user.financialState.netProfit,
                                "netLose": (user.financialState.netLose - validTransaction.amount.paid) + updatedTransaction.amount.paid,
                                "netPayableDue": (user.financialState.netPayableDue - validTransaction.amount.due) + updatedTransaction.amount.due,
                                "netReceivableDue": user.financialState.netReceivableDue,
                                "totalTransaction": (user.financialState.totalTransaction - validTransaction.amount.total) + updatedTransaction.amount.total
                            }
                        } });
                }
                const userState = yield User_model_1.default.findById(customReq.user.id);
                const response = {
                    status: 200,
                    message: 'Transaction successfully updated',
                    data: {
                        id: updatedTransaction._id,
                        transactionType: updatedTransaction.transactionType,
                        to_from: updatedTransaction.to_from,
                        amount: {
                            total: updatedTransaction.amount.total,
                            paid: updatedTransaction.amount.paid,
                            received: updatedTransaction.amount.received,
                            due: updatedTransaction.amount.due
                        },
                        date: updatedTransaction.date,
                        description: updatedTransaction.description
                    },
                    financialState: {
                        netProfit: (userState === null || userState === void 0 ? void 0 : userState.financialState.netProfit) || 0,
                        netLose: (userState === null || userState === void 0 ? void 0 : userState.financialState.netLose) || 0,
                        netPayableDue: (userState === null || userState === void 0 ? void 0 : userState.financialState.netPayableDue) || 0,
                        netReceivableDue: (userState === null || userState === void 0 ? void 0 : userState.financialState.netReceivableDue) || 0,
                        totalTransaction: (userState === null || userState === void 0 ? void 0 : userState.financialState.totalTransaction) || 0
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
const dueTransactionUpdateController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const customReq = req;
    const { transactionId } = req.params;
    const { paid, received, currentDue, date } = req.body;
    const validTransaction = yield Transaction_model_1.default.findById(transactionId);
    const transactionType = validTransaction.transactionType;
    if (validTransaction) {
        const validation = yield (0, updateDueTransaction_validation_1.default)({ transactionId, transactionType, paid, received, currentDue, date });
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
                yield Transaction_model_1.default.findOneAndUpdate({ _id: validTransaction._id }, { $set: {
                        "amount": {
                            "total": validTransaction.amount.total,
                            "paid": transactionType === 'expense' ? validTransaction.amount.paid + paid : validTransaction.amount.paid,
                            "received": transactionType === 'income' ? validTransaction.amount.received + received : validTransaction.amount.received,
                            "due": currentDue
                        },
                        "date": date
                    } });
                const dueUpdatedTransaction = yield Transaction_model_1.default.findById(transactionId);
                const user = yield User_model_1.default.findById(customReq.user.id);
                if (dueUpdatedTransaction.transactionType === 'income') {
                    yield User_model_1.default.findOneAndUpdate({ _id: user._id }, { $set: {
                            "financialState": {
                                "netProfit": user.financialState.netProfit + received,
                                "netLose": user.financialState.netLose,
                                "netPayableDue": user.financialState.netPayableDue,
                                "netReceivableDue": user.financialState.netReceivableDue - received,
                                "totalTransaction": user.financialState.totalTransaction
                            }
                        } });
                }
                else if (dueUpdatedTransaction.transactionType === 'expense') {
                    yield User_model_1.default.findOneAndUpdate({ _id: user._id }, { $set: {
                            "financialState": {
                                "netProfit": user.financialState.netProfit,
                                "netLose": user.financialState.netLose + paid,
                                "netPayableDue": user.financialState.netPayableDue - paid,
                                "netReceivableDue": user.financialState.netReceivableDue,
                                "totalTransaction": user.financialState.totalTransaction
                            }
                        } });
                }
                const userState = yield User_model_1.default.findById(customReq.user.id);
                const response = {
                    status: 200,
                    message: 'Due successfully updated',
                    data: {
                        id: dueUpdatedTransaction._id,
                        transactionType: dueUpdatedTransaction.transactionType,
                        to_from: dueUpdatedTransaction.to_from,
                        amount: {
                            total: dueUpdatedTransaction.amount.total,
                            paid: dueUpdatedTransaction.amount.paid,
                            received: dueUpdatedTransaction.amount.received,
                            due: dueUpdatedTransaction.amount.due
                        },
                        date: dueUpdatedTransaction.date,
                        description: dueUpdatedTransaction.description
                    },
                    financialState: {
                        netProfit: (userState === null || userState === void 0 ? void 0 : userState.financialState.netProfit) || 0,
                        netLose: (userState === null || userState === void 0 ? void 0 : userState.financialState.netLose) || 0,
                        netPayableDue: (userState === null || userState === void 0 ? void 0 : userState.financialState.netPayableDue) || 0,
                        netReceivableDue: (userState === null || userState === void 0 ? void 0 : userState.financialState.netReceivableDue) || 0,
                        totalTransaction: (userState === null || userState === void 0 ? void 0 : userState.financialState.totalTransaction) || 0
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
exports.dueTransactionUpdateController = dueTransactionUpdateController;
const allTransactionsGetController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const customReq = req;
    try {
        const transactions = yield Transaction_model_1.default.find({ user: customReq.user.id });
        const userState = yield User_model_1.default.findById(customReq.user.id);
        if (transactions) {
            const response = {
                status: 200,
                message: 'successfully retrieved data',
                data: transactions,
                financialState: {
                    netProfit: (userState === null || userState === void 0 ? void 0 : userState.financialState.netProfit) || 0,
                    netLose: (userState === null || userState === void 0 ? void 0 : userState.financialState.netLose) || 0,
                    netPayableDue: (userState === null || userState === void 0 ? void 0 : userState.financialState.netPayableDue) || 0,
                    netReceivableDue: (userState === null || userState === void 0 ? void 0 : userState.financialState.netReceivableDue) || 0,
                    totalTransaction: (userState === null || userState === void 0 ? void 0 : userState.financialState.totalTransaction) || 0
                }
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
    const customReq = req;
    const { transactionId } = req.params;
    try {
        const validTransaction = yield Transaction_model_1.default.findById(transactionId);
        if (validTransaction) {
            yield Transaction_model_1.default.deleteOne({ _id: validTransaction._id });
            const user = yield User_model_1.default.findById(customReq.user.id);
            if (validTransaction.transactionType === 'income') {
                yield User_model_1.default.findOneAndUpdate({ _id: user._id }, { $set: {
                        "financialState": {
                            "netProfit": user.financialState.netProfit - validTransaction.amount.received,
                            "netLose": user.financialState.netLose,
                            "netPayableDue": user.financialState.netPayableDue,
                            "netReceivableDue": user.financialState.netReceivableDue - validTransaction.amount.due,
                            "totalTransaction": user.financialState.totalTransaction - validTransaction.amount.total
                        }
                    } });
            }
            else if (validTransaction.transactionType === 'expense') {
                yield User_model_1.default.findOneAndUpdate({ _id: user._id }, { $set: {
                        "financialState": {
                            "netProfit": user.financialState.netProfit,
                            "netLose": user.financialState.netLose - validTransaction.amount.paid,
                            "netPayableDue": user.financialState.netPayableDue - validTransaction.amount.due,
                            "netReceivableDue": user.financialState.netReceivableDue,
                            "totalTransaction": user.financialState.totalTransaction - validTransaction.amount.total
                        }
                    } });
            }
            const userState = yield User_model_1.default.findById(customReq.user.id);
            const response = {
                status: 200,
                message: 'successfully deleted',
                data: {
                    id: validTransaction._id,
                    transactionType: validTransaction.transactionType,
                    to_from: validTransaction.to_from,
                    amount: {
                        total: validTransaction.amount.total,
                        paid: validTransaction.amount.paid,
                        received: validTransaction.amount.received,
                        due: validTransaction.amount.due
                    },
                    date: validTransaction.date,
                    description: validTransaction.description
                },
                financialState: {
                    netProfit: (userState === null || userState === void 0 ? void 0 : userState.financialState.netProfit) || 0,
                    netLose: (userState === null || userState === void 0 ? void 0 : userState.financialState.netLose) || 0,
                    netPayableDue: (userState === null || userState === void 0 ? void 0 : userState.financialState.netPayableDue) || 0,
                    netReceivableDue: (userState === null || userState === void 0 ? void 0 : userState.financialState.netReceivableDue) || 0,
                    totalTransaction: (userState === null || userState === void 0 ? void 0 : userState.financialState.totalTransaction) || 0
                }
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