"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const transactionValidation = (transactionRequestBody) => {
    let error = {};
    if (!transactionRequestBody.transactionType) {
        error.transactionType = `Type can't be empty`;
    }
    if (!transactionRequestBody.to_from) {
        error.to_from = `Sender or Receiver can't be empty`;
    }
    if (!transactionRequestBody.total) {
        error.total = `Total amount can't be empty`;
    }
    else if (transactionRequestBody.total === 0) {
        error.total = `Should contains valid total amount`;
    }
    if (transactionRequestBody.transactionType === 'expense' && (transactionRequestBody.paid === undefined || transactionRequestBody.paid === null)) {
        error.paid = `Paid amount can't be empty`;
    }
    else if (transactionRequestBody.transactionType === 'expense' && transactionRequestBody.paid > transactionRequestBody.total) {
        error.paid = `Should contains valid paid amount`;
    }
    if (transactionRequestBody.transactionType === 'income' && (transactionRequestBody.received === undefined || transactionRequestBody.received === null)) {
        error.received = `Received amount can't be empty`;
    }
    else if (transactionRequestBody.transactionType === 'income' && transactionRequestBody.received > transactionRequestBody.total) {
        error.received = `Should contains valid received amount`;
    }
    if (transactionRequestBody.due === undefined || transactionRequestBody.due === null) {
        error.due = `Due amount can't be empty`;
    }
    if (!transactionRequestBody.date) {
        error.date = `Date can't be empty`;
    }
    if (!transactionRequestBody.description) {
        error.description = `Description can't be empty`;
    }
    return {
        error,
        isValid: Object.keys(error).length === 0
    };
};
exports.default = transactionValidation;
//# sourceMappingURL=transaction.validation.js.map