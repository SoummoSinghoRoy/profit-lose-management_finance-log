import { Schema, model } from 'mongoose';

interface IUser {
  username: string;
  email: string;
  password: string;
  thumbnail: string;
  financialState: {
    netProfit: number;
    netLose: number;
    netPayableDue: number;
    netReceivableDue: number;
  }
}

const userSchema= new Schema<IUser> ({
  username: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  thumbnail: String,
  financialState: {
    netProfit: {
      type: Number,
      default: 0
    },
    netLose: {
      type: Number,
      default: 0
    },
    netPayableDue: {
      type: Number,
      default: 0
    },
    netReceivableDue: {
      type: Number,
      default: 0
    }
  }
}, {
  timestamps: true
})

const User = model<IUser>('User', userSchema);

export default User;