"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
const isAuthenticated_middleware_1 = require("../../middlewares/isAuthenticated.middleware");
const transaction_controller_1 = require("../controller/transaction.controller");
router.post('/add', isAuthenticated_middleware_1.isAuthenticated, transaction_controller_1.transactionCreatePostController);
router.put('/edit/:transactionId', isAuthenticated_middleware_1.isAuthenticated, transaction_controller_1.transactionEditPutController);
router.patch('/due/edit/:transactionId', isAuthenticated_middleware_1.isAuthenticated, transaction_controller_1.dueTransactionUpdateController);
router.get('/all', isAuthenticated_middleware_1.isAuthenticated, transaction_controller_1.allTransactionsGetController);
router.delete('/single/:transactionId', isAuthenticated_middleware_1.isAuthenticated, transaction_controller_1.transactionDeleteController);
exports.default = router;
//# sourceMappingURL=transaction.route.js.map