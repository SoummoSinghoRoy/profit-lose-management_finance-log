import { Request, Response } from "express";

import Transaction from "../../model/Transaction.model";

interface ApiResponse {
  status: number;
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
  } | object[]
}

export const searchResultController = async (req: Request, res: Response): Promise<void> => {
  const { searchterm } = req.params;
  try {
    const transactions = await Transaction.find({
      $text: {$search: searchterm}
    })
    if(transactions.length !== 0) {
      const response: ApiResponse = {
        status: 200,
        message: 'successfully retrieve data',
        data: transactions
      }
      res.json(response)
    } else {
      const response: ApiResponse = {
        status: 404,
        message: 'Data not found'
      }
      res.json(response)
    }
  } catch (error) {
    console.log(error);
    const response: ApiResponse = {
      status: 500,
      message: 'Internal Server Error'
    }
    res.json(response)
  }
}