import { Router } from 'express';
const router = Router();

import { isAuthenticated } from '../../middlewares/isAuthenticated.middleware';
import { transactionCreatePostController } from '../controller/transaction.controller';

router.post('/add', isAuthenticated, transactionCreatePostController);

export default router;