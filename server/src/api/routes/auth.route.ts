import { Router, Request, Response, NextFunction } from 'express';
const router = Router();

import { logInPostController, logoutPostController, passwordEditPatchController, signUpPostController, userDeleteController } from '../controller/auth.controller';
import upload from '../../middlewares/fileupload';
import { isAuthenticated, isNotAuthenticated } from '../../middlewares/isAuthenticated.middleware';
const fileupload = upload.single('thumbnail');

interface FileHandleResponse {
  status: number;
  message: string;
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
        message: 'Error occurred', 
        error: {
          message: {thumbnail: `Attachment must be less than 250kb`}
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
router.post('/logout', isAuthenticated, logoutPostController);
router.patch('/edit/:userId', isAuthenticated, passwordEditPatchController);
router.delete('/delete/:userId', isAuthenticated, userDeleteController);

export default router;
