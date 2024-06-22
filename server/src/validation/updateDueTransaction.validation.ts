import Transaction from "../model/Transaction.model";

type TransactionType = "income" | 'expense';

interface UpdateDueTransactionRequestBody {
  transactionId: any;
  transactionType: TransactionType;
  paid: number;
  received: number;
  currentDue: number;
  date: string;
}

interface UpdateDueTransactionValidationResult {
  error: object;
  isValid: boolean;
}

const updateDueTransactionValidation = async (updateDueRequestBody: UpdateDueTransactionRequestBody) : Promise<UpdateDueTransactionValidationResult> => {
  let error: {[field: string]: string} = {}

  if(updateDueRequestBody.transactionType === 'income' && !updateDueRequestBody.received) {
    error.received = `Received amount can't be empty`
  }

  if (updateDueRequestBody.transactionType === 'income' && (updateDueRequestBody.received === undefined || updateDueRequestBody.received === null)) {
    error.received = `Received amount can't be empty`
  }

  if(updateDueRequestBody.transactionType === 'expense' && !updateDueRequestBody.paid) {
    error.paid = `Paid amount can't be empty`
  }

  if (updateDueRequestBody.transactionType === 'expense' && (updateDueRequestBody.paid === undefined || updateDueRequestBody.paid === null)) {
    error.paid = `Paid amount can't be empty`
  }

  if(updateDueRequestBody.currentDue === undefined || updateDueRequestBody.currentDue === null) {
    error.currentDue = `Current due amount can't be empty`
  }

  if (!updateDueRequestBody.date) {
    error.date = `Date can't be empty`
  }
  const validTransaction = await Transaction.findById(updateDueRequestBody.transactionId);
  if (updateDueRequestBody.transactionType === 'income' && updateDueRequestBody.received > validTransaction!.amount.due) {
    error.received = `Received amount can't bigger then due amount`
  } else if(updateDueRequestBody.transactionType === 'expense' && updateDueRequestBody.paid > validTransaction!.amount.due) {
    error.paid = `Paid amount can't bigger then due amount`
  }

  return {
    error,
    isValid: Object.keys(error).length === 0
  }
}

export default updateDueTransactionValidation;