import { Request, Response } from "express";
import { CustomRequest } from "../../middlewares/isAuthenticated.middleware";

import transactionValidation from "../../validation/transaction.validation";
import Transaction from "../../model/Transaction.model";
import User from "../../model/User.model";
import updateDueTransactionValidation from "../../validation/updateDueTransaction.validation";

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
  financialState?: {
    netProfit: number;
    netLose: number;
    netPayableDue: number;
    netReceivableDue: number;
    totalTransaction: number;
  }
}

const transactionCreatePostController = async (req: Request, res: Response): Promise<void> => {
  const customReq = req as CustomRequest;
  const { transactionType, to_from, total, paid, received, due, date, description } = req.body;

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
              "netLose": user!.financialState.netLose,
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
              "netProfit": user!.financialState.netProfit,
              "netLose": user!.financialState.netLose + transaction.amount.paid,
              "netPayableDue": user!.financialState.netPayableDue + transaction.amount.due,
              "netReceivableDue": user!.financialState.netReceivableDue,
              "totalTransaction": user!.financialState.totalTransaction + transaction.amount.total
            }
          }}
        );
      }
      const userState = await User.findById(customReq.user!.id);
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
        ,
        financialState: {
          netProfit: userState?.financialState.netProfit || 0,
          netLose: userState?.financialState.netLose || 0,
          netPayableDue: userState?.financialState.netPayableDue || 0,
          netReceivableDue: userState?.financialState.netReceivableDue || 0,
          totalTransaction: userState?.financialState.totalTransaction || 0
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
  const { transactionType, to_from, total, paid, received, due, date, description } = req.body;
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
        if(updatedTransaction!.transactionType === 'income') {
          await User.findOneAndUpdate(
            {_id: user!._id},
            {$set: {
              "financialState": {
                "netProfit": (user!.financialState.netProfit - validTransaction!.amount.received) + updatedTransaction!.amount.received,
                "netLose": user!.financialState.netLose,
                "netPayableDue": user!.financialState.netPayableDue,
                "netReceivableDue": (user!.financialState.netReceivableDue - validTransaction.amount.due) + updatedTransaction!.amount.due,
                "totalTransaction": (user!.financialState.totalTransaction - validTransaction.amount.total) + updatedTransaction!.amount.total
              }
            }}
          )
        } else if(updatedTransaction!.transactionType === 'expense') {
          await User.findOneAndUpdate(
            {_id: user!._id},
            {$set: {
              "financialState": {
                "netProfit": user!.financialState.netProfit,
                "netLose": (user!.financialState.netLose - validTransaction!.amount.paid) + updatedTransaction!.amount.paid,
                "netPayableDue": (user!.financialState.netPayableDue - validTransaction.amount.due) + updatedTransaction!.amount.due,
                "netReceivableDue": user!.financialState.netReceivableDue,
                "totalTransaction": (user!.financialState.totalTransaction - validTransaction.amount.total) + updatedTransaction!.amount.total
              }
            }}
          )
        }
        const userState = await User.findById(customReq.user!.id);
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
          },
          financialState: {
            netProfit: userState?.financialState.netProfit || 0,
            netLose: userState?.financialState.netLose || 0,
            netPayableDue: userState?.financialState.netPayableDue || 0,
            netReceivableDue: userState?.financialState.netReceivableDue || 0,
            totalTransaction: userState?.financialState.totalTransaction || 0
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

const dueTransactionUpdateController = async (req: Request, res: Response): Promise<void> => {
  const customReq = req as CustomRequest;
  const { transactionId } = req.params;
  const { paid, received, currentDue, date } = req.body;

  const validTransaction = await Transaction.findById(transactionId);
  const transactionType = validTransaction!.transactionType;
  if (validTransaction) {
    const validation = await updateDueTransactionValidation({transactionId ,transactionType, paid, received, currentDue, date});
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
          {_id: validTransaction._id},
          {$set: {
            "amount": {
              "total": validTransaction.amount.total,
              "paid": transactionType === 'expense' ? validTransaction.amount.paid + paid : validTransaction.amount.paid,
              "received": transactionType === 'income' ? validTransaction.amount.received + received : validTransaction.amount.received,
              "due": currentDue
            },
            "date": date
          }}
        )
        const dueUpdatedTransaction = await Transaction.findById(transactionId);
        const user = await User.findById(customReq.user!.id);
        if (dueUpdatedTransaction!.transactionType === 'income') {
          await User.findOneAndUpdate(
            {_id: user!._id},
            {$set: {
              "financialState": {
                "netProfit": user!.financialState.netProfit + received,
                "netLose": user!.financialState.netLose,
                "netPayableDue": user!.financialState.netPayableDue,
                "netReceivableDue": user!.financialState.netReceivableDue - received,
                "totalTransaction": user!.financialState.totalTransaction
              }
            }}
          )
        } else if (dueUpdatedTransaction!.transactionType === 'expense') {
          await User.findOneAndUpdate(
            {_id: user!._id},
            {$set: {
              "financialState": {
                "netProfit": user!.financialState.netProfit,
                "netLose": user!.financialState.netLose + paid,
                "netPayableDue": user!.financialState.netPayableDue - paid,
                "netReceivableDue": user!.financialState.netReceivableDue,
                "totalTransaction": user!.financialState.totalTransaction
              }
            }}
          )
        }
        const userState = await User.findById(customReq.user!.id);
        const response: ApiResponse = {
          status: 200,
          message: 'Due Transaction successfully updated',
          data: {
            id: dueUpdatedTransaction!._id,
            transactionType: dueUpdatedTransaction!.transactionType,
            to_from: dueUpdatedTransaction!.to_from,
            amount: {
              total: dueUpdatedTransaction!.amount.total,
              paid: dueUpdatedTransaction!.amount.paid,
              received: dueUpdatedTransaction!.amount.received,
              due: dueUpdatedTransaction!.amount.due
            },
            date: dueUpdatedTransaction!.date,
            description: dueUpdatedTransaction!.description
          },
          financialState: {
            netProfit: userState?.financialState.netProfit || 0,
            netLose: userState?.financialState.netLose || 0,
            netPayableDue: userState?.financialState.netPayableDue || 0,
            netReceivableDue: userState?.financialState.netReceivableDue || 0,
            totalTransaction: userState?.financialState.totalTransaction || 0
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
    const userState = await User.findById(customReq.user!.id);
    if (transactions) {
      const response: ApiResponse = {
        status: 200,
        message: 'successfully retrieved data',
        data: transactions,
        financialState: {
          netProfit: userState?.financialState.netProfit || 0,
          netLose: userState?.financialState.netLose || 0,
          netPayableDue: userState?.financialState.netPayableDue || 0,
          netReceivableDue: userState?.financialState.netReceivableDue || 0,
          totalTransaction: userState?.financialState.totalTransaction || 0
        }
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
      const userState = await User.findById(customReq.user!.id);
      const response: ApiResponse = {
        status: 200,
        message: 'successfully deleted',
        financialState: {
          netProfit: userState?.financialState.netProfit || 0,
          netLose: userState?.financialState.netLose || 0,
          netPayableDue: userState?.financialState.netPayableDue || 0,
          netReceivableDue: userState?.financialState.netReceivableDue || 0,
          totalTransaction: userState?.financialState.totalTransaction || 0
        }
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

export { transactionCreatePostController, transactionEditPutController, dueTransactionUpdateController, allTransactionsGetController, transactionDeleteController };