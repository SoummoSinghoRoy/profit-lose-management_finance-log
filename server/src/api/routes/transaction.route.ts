import { Router } from 'express';
const router = Router();

import { isAuthenticated } from '../../middlewares/isAuthenticated.middleware';
import { allTransactionsGetController, dueTransactionUpdateController, transactionCreatePostController, transactionDeleteController, transactionEditPutController } from '../controller/transaction.controller';

router.post('/add', isAuthenticated, transactionCreatePostController);
router.put('/edit/:transactionId', isAuthenticated, transactionEditPutController);
router.patch('/due/edit/:transactionId', isAuthenticated, dueTransactionUpdateController);
router.get('/all', isAuthenticated, allTransactionsGetController);
router.delete('/single/:transactionId', isAuthenticated, transactionDeleteController);

export default router;