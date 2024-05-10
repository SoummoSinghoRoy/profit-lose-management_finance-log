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
    amount: {
      total: number;
      paid: number;
      received: number;
      due: number;
    };
    date: string;
    description: string;
  } | object[];
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
  } else {
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
      if(transactionType === 'income') {
        await User.findOneAndUpdate(
          {_id: user!._id},
          {$set: {
            "financialState": {
              "netProfit": user!.financialState.netProfit + transaction.amount.received,
              "netLose": user!.financialState.netLose - transaction.amount.received,
              "netPayableDue": user!.financialState.netPayableDue,
              "netReceivableDue": user!.financialState.netReceivableDue + transaction.amount.due,
              "totalTransaction": user!.financialState.totalTransaction + transaction.amount.total
            }
          }}
        );
      } else if(transactionType === 'expense') {
        await User.findOneAndUpdate(
          {_id: user!._id},
          {$set: {
            "financialState": {
              "netProfit": user!.financialState.netProfit - transaction.amount.paid,
              "netLose": user!.financialState.netLose + transaction.amount.paid,
              "netPayableDue": user!.financialState.netPayableDue + transaction.amount.due,
              "netReceivableDue": user!.financialState.netReceivableDue,
              "totalTransaction": user!.financialState.totalTransaction + transaction.amount.total
            }
          }}
        );
      }
      const response: ApiResponse = {
        status: 200,
        message: 'Transaction successfully created',
        data: {
          id: transaction._id,
          transactionType: transaction.transactionType,
          to_from: transaction.to_from,
          amount: {
            total: transaction.amount.total,
            paid: transaction.amount.paid,
            received: transaction.amount.received,
            due: transaction.amount.due
          },
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
}

const transactionEditPutController = async (req: Request, res: Response): Promise<void> => {
  const customReq = req as CustomRequest;
  const { transaction_type, to_from, total, paid, received, due, date, description } = req.body;
  const transactionType = transaction_type.toLowerCase();
  const { transactionId } = req.params;

  const validTransaction = await Transaction.findById(transactionId);
  if (validTransaction) {
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
    } else {
      try {
        await Transaction.findOneAndUpdate(
          {_id: validTransaction._id },
          { transactionType,
            to_from,
            amount: {
              total,
              paid: transactionType === 'income' ? 0 : paid,
              received: transactionType === 'expense' ? 0 : received,
              due
            },
            date,
            description },
          { new: true } 
        );
        const updatedTransaction = await Transaction.findById(transactionId);
        const user = await User.findById(customReq.user!.id);
        if(transactionType === 'income') {
          const netLoseCalculation = user!.financialState.netLose !== 0 && user!.financialState.netLose >=  user!.financialState.netProfit ? (user!.financialState.netLose + validTransaction!.amount.received) - updatedTransaction!.amount.received : 0;
          await User.findOneAndUpdate(
            {_id: user!._id},
            {$set: {
              "financialState": {
                "netProfit": (user!.financialState.netProfit - validTransaction!.amount.received) + updatedTransaction!.amount.received,
                "netLose": netLoseCalculation,
                "netPayableDue": user!.financialState.netPayableDue,
                "netReceivableDue": (user!.financialState.netReceivableDue - validTransaction.amount.due) + updatedTransaction!.amount.due,
                "totalTransaction": (user!.financialState.totalTransaction - validTransaction.amount.total) + updatedTransaction!.amount.total
              }
            }}
          )
        } else if(transactionType === 'expense') {
          const netProfitCalculation = user!.financialState.netProfit !== 0 && user!.financialState.netProfit >=  user!.financialState.netLose? (user!.financialState.netProfit + validTransaction!.amount.paid) - updatedTransaction!.amount.paid : 0;
          await User.findOneAndUpdate(
            {_id: user!._id},
            {$set: {
              "financialState": {
                "netProfit": netProfitCalculation,
                "netLose": (user!.financialState.netLose - validTransaction!.amount.paid) + updatedTransaction!.amount.paid,
                "netPayableDue": (user!.financialState.netPayableDue - validTransaction.amount.due) + updatedTransaction!.amount.due,
                "netReceivableDue": user!.financialState.netReceivableDue,
                "totalTransaction": (user!.financialState.totalTransaction - validTransaction.amount.total) + updatedTransaction!.amount.total
              }
            }}
          )
        }
        const response: ApiResponse = {
          status: 200,
          message: 'Transaction successfully updated',
          data: {
            id: updatedTransaction!._id,
            transactionType: updatedTransaction!.transactionType,
            to_from: updatedTransaction!.to_from,
            amount: {
              total: updatedTransaction!.amount.total,
              paid: updatedTransaction!.amount.paid,
              received: updatedTransaction!.amount.received,
              due: updatedTransaction!.amount.due
            },
            date: updatedTransaction!.date,
            description: updatedTransaction!.description
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
  } else {
    const response: ApiResponse = {
      status: 404,
      message: `Transaction item not found`
    }
    res.json(response)
  }
}

const allTransactionsGetController = async (req: Request, res: Response): Promise<void> => {
  const customReq = req as CustomRequest;
  try {
    const transactions = await Transaction.find({user: customReq.user!.id});
    if (transactions) {
      const response: ApiResponse = {
        status: 200,
        message: 'successfully retrieved data',
        data: transactions
      }
      res.json(response)
    } else {
      const response: ApiResponse = {
        status: 404,
        message: `Transactions not found`
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

const transactionDeleteController = async (req: Request, res: Response): Promise<void> => {
  const customReq = req as CustomRequest;
  const { transactionId } = req.params;
  try {
    const validTransaction = await Transaction.findById(transactionId);
    if (validTransaction) {
      await Transaction.deleteOne({_id: validTransaction._id});
      const user = await User.findById(customReq.user!.id);
      if(validTransaction.transactionType === 'income') {
        await User.findOneAndUpdate(
          {_id: user!._id},
          {$set: {
            "financialState": {
              "netProfit": user!.financialState.netProfit - validTransaction.amount.received,
              "netLose": user!.financialState.netLose + validTransaction.amount.received,
              "netPayableDue": user!.financialState.netPayableDue,
              "netReceivableDue": user!.financialState.netReceivableDue - validTransaction.amount.due,
              "totalTransaction": user!.financialState.totalTransaction - validTransaction.amount.total
            }
          }}
        )
      } else if(validTransaction.transactionType === 'expense') {
        await User.findOneAndUpdate(
          {_id: user!._id},
          {$set: {
            "financialState": {
              "netProfit": user!.financialState.netProfit + validTransaction.amount.paid,
              "netLose": user!.financialState.netLose - validTransaction.amount.paid,
              "netPayableDue": user!.financialState.netPayableDue - validTransaction.amount.due,
              "netReceivableDue": user!.financialState.netReceivableDue,
              "totalTransaction": user!.financialState.totalTransaction - validTransaction.amount.total
            }
          }}
        )
      }
      const response: ApiResponse = {
        status: 200,
        message: 'successfully deleted',
      }
      res.json(response)
    } else {
      const response: ApiResponse = {
        status: 404,
        message: `Transactions not found`
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

export { transactionCreatePostController, transactionEditPutController, allTransactionsGetController, transactionDeleteController };