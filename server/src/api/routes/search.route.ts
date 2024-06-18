import { Router } from 'express';
const router = Router();

import { isAuthenticated } from '../../middlewares/isAuthenticated.middleware';
import { searchResultController } from '../controller/search.controller';

router.get('/transaction/:searchterm', isAuthenticated, searchResultController);

export default router;