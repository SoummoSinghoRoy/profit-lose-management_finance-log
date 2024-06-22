import { Schema, ObjectId, model } from 'mongoose';
import moment from 'moment';

type TransactionType = "income" | 'expense';

interface ITransaction {
  transactionType: TransactionType,
  to_from: string;
  amount: {
    total: number,
    paid: number,
    received: number,
    due: number
  },
  date: string;
  last_update_date: string;
  description: string;
  user: ObjectId;
}

const transactionSchema = new Schema<ITransaction> ({
  transactionType: {
    type: String,
    required: true
  },
  to_from: {
    type: String,
    required: true
  },
  amount: {
    total: {
      type: Number,
      default: 0,
      required: true
    },
    paid: {
      type: Number,
      default: 0,
      required: true
    },
    received: {
      type: Number,
      default: 0,
      required: true
    }, 
    due: {
      type: Number,
      default: 0,
      required: true
    }
  },
  date: {
    type: String,
    required: true,
    set: (v: string) => moment(v, 'YYYY-MM-DD').format('YYYY-MM-DD'),
    get: (v: string) => moment(v, 'YYYY-MM-DD').format('DD-MM-YYYY')
  },
  last_update_date: {
    type: String,
    required: true,
    set: (v: string) => moment(v, 'YYYY-MM-DD').format('YYYY-MM-DD'),
    get: (v: string) => moment(v, 'YYYY-MM-DD').format('DD-MM-YYYY')
  },
  description: {
    type: String,
    required: true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
})

transactionSchema.index({
  transactionType: 'text',
  to_from: 'text'
}, {
  weights: {
    to_from: 2,
    transactionType: 1
  }
})

const Transaction = model<ITransaction>('Transaction', transactionSchema);

export default Transaction;