import { Request, Response } from "express";
import { CustomRequest } from "../../middlewares/isAuthenticated.middleware";

import transactionValidation from "../../validation/transaction.validation";
import Transaction from "../../model/Transaction.model";
import User from "../../model/User.model";


interface ApiResponse {
  status: number;
  error?: {
    message: string | object
  };
  message?: string;
  data?: {
    id: any;
    transactionType: string;
    to_from: string;
    date: string;
    description: string;
  };
}

const transactionCreatePostController = async (req: Request, res: Response): Promise<void> => {
  const customReq = req as CustomRequest;
  const { transaction_type, to_from, total, paid, received, due, date, description } = req.body;
  const transactionType = transaction_type.toLowerCase();
  const validation = transactionValidation({transactionType, to_from, total, paid, received, due, date, description});
  if(!validation.isValid) {
    const validationresult: ApiResponse = {
      status: 400,
      message: 'Error occurred',
      error: {
        message: validation.error
      }
    }
    res.json(validationresult)
  }
  try {
    const user = await User.findById(customReq.user!.id)
    const registeredTransaction = new Transaction({
      transactionType,
      to_from,
      amount: {
        total,
        paid: transactionType === 'income' ? 0 : paid,
        received: transactionType === 'expense' ? 0 : received,
        due
      },
      date,
      description,
      user: user!._id
    })
    const transaction = await registeredTransaction.save();
    const response: ApiResponse = {
      status: 200,
      message: 'User successfully created',
      data: {
        id: transaction._id,
        transactionType: transaction.transactionType,
        to_from: transaction.to_from,
        date: transaction.date,
        description: transaction.description
      }
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

export { transactionCreatePostController };