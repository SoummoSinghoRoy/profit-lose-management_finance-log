import { Request, Response } from "express";
import fs from 'fs';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import env_variables from '../../config/custom_env_variables';

import signupValidation from '../../validation/signup.validation';
import User from "../../model/User.model";
import logInValidation from "../../validation/login.validation";
import passwordEditValidation from "../../validation/passwordedit.validation";
import { CustomRequest } from "../../middlewares/isAuthenticated.middleware";
import Transaction from "../../model/Transaction.model";

interface ApiResponse {
  status: number;
  error?: {
    message: string | object
  };
  message?: string;
  data?: {
    id?: any;
    username?: string;
    email?: string;
    financialState?: {
      netProfit: number;
      netLose: number;
      netPayableDue: number;
      netReceivableDue: number;
      totalTransaction: number;
    },
  }
  isAuthenticated?: boolean;
}

const signUpPostController = async (req: Request, res: Response): Promise<void> => {
  const { username, email, password, confirmPassword } = req.body;

  const validation = await signupValidation({ username, email, password, confirmPassword });

  if (!req.file && !validation.isValid) {
    const validationresult: ApiResponse = {
      status: 400,
      message: 'Error occurred',
      error: {
        message: {...validation.error, thumbnail: `Must attach valid image`}
      }
    }
    res.json(validationresult)
  } else if (req.file && !validation.isValid) {
    fs.unlink(req.file.path, (err) => {
      if (err) throw err
    })
    const validationresult: ApiResponse = {
      status: 400,
      message: 'Error occurred',
      error: {
        message: validation.error
      }
    }
    res.json(validationresult)
  } else if (!req.file && validation.isValid) {
    const validationresult: ApiResponse = {
      status: 400,
      message: 'Error occurred',
      error: {
        message: {thumbnail: `Must attach valid image`}
      }
    }
    res.json(validationresult)
  } else {
    try {
      bcrypt.hash(password, 10,  async(err, hash) => {
        if (err) {
          console.log(err);
          const response: ApiResponse = {
            status: 500,
            message: 'Error occurred, get back soon',
            error: { message: 'Internal server error' }
          }
          res.json(response)
        } else {
          const registeredUser = new User ({ 
            username, 
            email, 
            password: hash,
            thumbnail: `/uploads/${req.file!.filename}`
          })
          const user = await registeredUser.save()
          const response: ApiResponse = {
            status: 200,
            message: 'User successfully created',
            data: {
              id: user._id,
              username: user.username,
              email: user.email
            }
          }
          res.json(response)
        }
      })
    } catch (error) {
      console.log(error);
      const response: ApiResponse = {
        status: 500,
        message: 'Error occurred, get back soon',
        error: { message: 'Internal server error' }
      }
      res.json(response)
    }
  }
}

const logInPostController = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  const validation = await logInValidation({email, password});
  if (!validation.isValid) {
    const validationresult: ApiResponse = {
      status: 400,
      message: 'Error occurred',
      error: {
        message: validation.error
      }
    }
    res.json(validationresult)
  } else {
    try {
      if (validation.isValid) {
        const validUser = await User.findOne({email});
        jwt.sign({
          id: validUser!._id,
          username: validUser!.username, email: validUser!.email
        }, env_variables.secret_key, { expiresIn: '12h' }, (err, token) => {
          if (err) {
            console.log(err);
            const response: ApiResponse = {
              status: 500,
              message: 'Error occurred, get back soon',
              error: { message: 'Internal server error' }
            }
            res.json(response)
          }
          if (token) {
            const response: ApiResponse = {
              status: 200,
              message: 'Successfully loggedin',
              isAuthenticated: true,
              data: {
                id: validUser!._id,
                username: validUser!.username,
                financialState: {
                  netProfit: validUser!.financialState.netProfit,
                  netLose: validUser!.financialState.netLose,
                  netPayableDue: validUser!.financialState.netPayableDue,
                  netReceivableDue: validUser!.financialState.netReceivableDue,
                  totalTransaction: validUser!.financialState.totalTransaction
                }
              }
            }
            res.cookie('authorization', 'Bearer ' + token, { expires: new Date(Date.now() + 12 * 3600000) });
            res.json(response);
          } else {
            const response: ApiResponse = {
              status: 401,
              message: 'Authorization failed',
              isAuthenticated: false
            }
            res.json(response)
          }
        })
      }
    } catch (error) {
      console.log(error);
      const response: ApiResponse = {
        status: 500,
        message: 'Error occurred, get back soon',
        error: { message: 'Internal server error' }
      }
      res.json(response)
    }
  } 
}

const logoutPostController = async (req: Request, res: Response): Promise<void> => {
  try {
    res.clearCookie('authorization');
    const response: ApiResponse = {
      status: 200,
      message: 'Successfully loggedout',
      isAuthenticated: false
    }
    res.json(response)
  } catch (error) {
    console.log(error);
    const response: ApiResponse = {
      status: 500,
      message: 'Error occurred, get back soon',
      error: { message: 'Internal server error' }
    }
    res.json(response)
  }
}

const passwordEditPatchController = async (req: Request, res: Response): Promise<void> => {
  const customReq = req as CustomRequest;
  const { currentPassword, newPassword, confirmNewPassword } = req.body;
  const { userId } = req.params;

  const validation = await passwordEditValidation({ userId, currentPassword, newPassword, confirmNewPassword});
  if (!validation.isValid) {
    const validationresult: ApiResponse = {
      status: 400,
      message: 'Error occurred',
      error: {
        message: validation.error
      }
    }
    res.json(validationresult)
  } else {
    try {
      if (customReq.user!.id === userId) {
        bcrypt.hash(newPassword, 10,  async(err, hash) => {
          if (err) {
            console.log(err);
            const response: ApiResponse = {
              status: 500,
              message: 'Error occurred, get back soon',
              error: { message: 'Internal server error' }
            }
            res.json(response)
          } else {
            await User.findOneAndUpdate( 
              {_id: customReq.user!.id}, 
              { password: hash }, 
              {new: true}
            )
            const response: ApiResponse = {
              status: 200,
              message: 'Password successfully updated'
            }
            res.json(response)
          }
        })
      } else {
        const response: ApiResponse = {
          status: 403,
          message: `Can't update password`
        }
        res.json(response)
      }
    } catch (error) {
      console.log(error);
      const response: ApiResponse = {
        status: 500,
        message: 'Error occurred, get back soon',
        error: { message: 'Internal server error' }
      }
      res.json(response)
    }
  }
}

const userDeleteController = async (req: Request, res: Response): Promise<void> => {
  const customReq = req as CustomRequest;
  const { userId } = req.params;
  try {
    if (customReq.user!.id === userId) {
      const validUser = await User.findOne({_id: userId});
      await User.deleteOne({_id: validUser?._id});
      await Transaction.deleteMany({user: userId});
      res.clearCookie('authorization');
      fs.unlink(`./${validUser!.thumbnail}`, (err) => {
        if (err) throw err
      })
      const response: ApiResponse = {
        status: 200,
        message: `User deleted successfully`
      }
      res.json(response)
    } else {
      const response: ApiResponse = {
        status: 403,
        message: `Can't delete user`
      }
      res.json(response)
    }
  } catch (error) {
    console.log(error);
    const response: ApiResponse = {
      status: 500,
      message: 'Error occurred, get back soon',
      error: { message: 'Internal server error' }
    }
    res.json(response)
  }
}

export { signUpPostController, logInPostController, logoutPostController, passwordEditPatchController, userDeleteController };