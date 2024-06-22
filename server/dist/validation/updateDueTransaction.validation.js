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
const Transaction_model_1 = __importDefault(require("../model/Transaction.model"));
const updateDueTransactionValidation = (updateDueRequestBody) => __awaiter(void 0, void 0, void 0, function* () {
    let error = {};
    if (updateDueRequestBody.transactionType === 'income' && !updateDueRequestBody.received) {
        error.received = `Received amount can't be empty`;
    }
    if (updateDueRequestBody.transactionType === 'income' && (updateDueRequestBody.received === undefined || updateDueRequestBody.received === null)) {
        error.received = `Received amount can't be empty`;
    }
    if (updateDueRequestBody.transactionType === 'expense' && !updateDueRequestBody.paid) {
        error.paid = `Paid amount can't be empty`;
    }
    if (updateDueRequestBody.transactionType === 'expense' && (updateDueRequestBody.paid === undefined || updateDueRequestBody.paid === null)) {
        error.paid = `Paid amount can't be empty`;
    }
    if (updateDueRequestBody.currentDue === undefined || updateDueRequestBody.currentDue === null) {
        error.currentDue = `Current due amount can't be empty`;
    }
    if (!updateDueRequestBody.date) {
        error.date = `Date can't be empty`;
    }
    const validTransaction = yield Transaction_model_1.default.findById(updateDueRequestBody.transactionId);
    if (updateDueRequestBody.transactionType === 'income' && updateDueRequestBody.received > validTransaction.amount.due) {
        error.received = `Received amount can't bigger then due amount`;
    }
    else if (updateDueRequestBody.transactionType === 'expense' && updateDueRequestBody.paid > validTransaction.amount.due) {
        error.paid = `Paid amount can't bigger then due amount`;
    }
    return {
        error,
        isValid: Object.keys(error).length === 0
    };
});
exports.default = updateDueTransactionValidation;
//# sourceMappingURL=updateDueTransaction.validation.js.map