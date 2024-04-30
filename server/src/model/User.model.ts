import { Schema, model } from 'mongoose';

interface IUser {
  username: string;
  email: string;
  password: string;
  thumbnail: string;
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
  thumbnail: String
}, {
  timestamps: true
})

const User = model<IUser>('User', userSchema);

export default User;