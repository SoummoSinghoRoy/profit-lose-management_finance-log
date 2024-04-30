import { Router, Request, Response, NextFunction, RequestHandler } from 'express';
const router = Router();

import { logInPostController, logoutPostController, passwordEditPatchController, signUpPostController } from '../controller/auth.controller';
import upload from '../../middlewares/fileupload';
import { isAuthenticated, isNotAuthenticated } from '../../middlewares/isAuthenticated.middleware';
const fileupload = upload.single('thumbnail');

interface FileHandleResponse {
  status: number;
  error?: {
    message: string | object
  }
}

const uploadHandle = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
  fileupload(req, res, (err) => {
    if (err) {
      console.log(err);
      const response: FileHandleResponse = {
        status: 400,
        error: {
          message: `Attachment must be less than 250kb`
        }
      }
      res.json(response); 
    } else {
      next();
    }
  })
}

router.post('/signup', isNotAuthenticated, uploadHandle, signUpPostController);
router.post('/login', isNotAuthenticated, logInPostController);
router.post('/logout', isAuthenticated as RequestHandler, logoutPostController);
router.patch('/edit/:userId', isAuthenticated as RequestHandler, passwordEditPatchController );

export default router;
