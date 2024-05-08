import { Router } from 'express';
const router = Router();

import { isAuthenticated } from '../../middlewares/isAuthenticated.middleware';
import { allTransactionsGetController, transactionCreatePostController, transactionEditPutController } from '../controller/transaction.controller';

router.post('/add', isAuthenticated, transactionCreatePostController);
router.put('/edit/:transactionId', isAuthenticated, transactionEditPutController);
router.get('/all', isAuthenticated, allTransactionsGetController);

export default router;