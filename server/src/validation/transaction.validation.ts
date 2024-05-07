type TransactionType = "income" | 'expense';

interface TransactionRequestBody {
  transactionType: TransactionType;
  to_from: string;
  total: number,
  paid: number;
  received: number;
  due: number;
  date: string;
  description: string;
}

interface TransactionValidationResult {
  error: object;
  isValid: boolean;
}

const transactionValidation = (transactionRequestBody: TransactionRequestBody): TransactionValidationResult => {
  let error: { [field: string]: string } = {};

  if (!transactionRequestBody.transactionType) {
    error.transactionType = `Type can't be empty`
  }

  if (!transactionRequestBody.to_from) {
    error.to_from = `Sender or Receiver can't be empty`
  }

  if (!transactionRequestBody.total) {
    error.total = `Total amount can't be empty`
  }

  if (transactionRequestBody.transactionType === 'expense' && (transactionRequestBody.paid === undefined || transactionRequestBody.paid === null)) {
    error.paid = `Paid amount can't be empty`
  }

  if (transactionRequestBody.transactionType === 'income' && (transactionRequestBody.received === undefined || transactionRequestBody.received === null)) {
    error.received = `Received amount can't be empty`
  }

  if (transactionRequestBody.due === undefined || transactionRequestBody.due === null) {
    error.due = `Due amount can't be empty`
  }

  if (!transactionRequestBody.date) {
    error.date = `Date can't be empty`
  }

  if (!transactionRequestBody.description) {
    error.description = `Description can't be empty`
  }

  return {
    error,
    isValid: Object.keys(error).length === 0
  }
}

export default transactionValidation;