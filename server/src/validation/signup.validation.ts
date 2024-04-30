import validator from 'validator';
import User from '../model/User.model';

interface SignUpRequestBody {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface SignUpValidationResult {
  error: object;
  isValid: boolean;
}

const signupValidation = async (signuprequestbody: SignUpRequestBody): Promise<SignUpValidationResult> => {
  let error: { [field: string]: string } = {};

  if (!signuprequestbody.username) {
    error.username = `Username can't empty`
  }

  if (!signuprequestbody.email) {
    error.email = `Email can't empty`
  } else if (!validator.isEmail(signuprequestbody.email)) {
    error.email = `Email must be valid`
  }

  if (!signuprequestbody.password) {
    error.password = `Password can't be empty`
  } else if (!validator.isLength(signuprequestbody.password, { min: 6, max: 10 })) {
    error.password = `Password length must be 6 to 10 charecter`
  }

  if (!signuprequestbody.confirmPassword) {
    error.confirmPassword = `Confirm password can't be empty`;
  } else if (signuprequestbody.password !== signuprequestbody.confirmPassword) {
    error.confirmPassword = `Password do not match`;
  }

  const existuser: object | null = await User.findOne({email: signuprequestbody.email})
  if (existuser) {
    error.email = `You don't use this email`
  }

  return {
    error,
    isValid: Object.keys(error).length === 0
  }
}

export default signupValidation;