import validator from 'validator';
import bcrypt from 'bcrypt';

import User from '../model/User.model';


interface EditRequestBody {
  userId: string;
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

interface EditValidationResult {
  error: object;
  isValid: boolean;
}

const passwordEditValidation = async (editrequestbody: EditRequestBody): Promise<EditValidationResult> => {
  let error: { [field: string]: string } = {};

  if (!editrequestbody.currentPassword) {
    error.currentPassword = `Current password can't be empty`
  }

  const validUser: any = await User.findOne({_id: editrequestbody.userId});
  if (validUser) {
    const match = await bcrypt.compare(editrequestbody.currentPassword, validUser.password)
    if (!match) {
      error.currentPassword = `Incorrect password`
    }
  } else {
    error.credential = `Wrong credential! Can't update password`
  }

  if (!editrequestbody.newPassword) {
    error.newPassword = `New password can't be empty`
  } else if (!validator.isLength(editrequestbody.newPassword, { min: 6, max: 10 })) {
    error.newPassword = ` New password length must be 6 to 10 charecter`
  }

  if (!editrequestbody.confirmNewPassword) {
    error.confirmNewPassword = `Confirm new password can't be empty`;
  } else if (editrequestbody.newPassword !== editrequestbody.confirmNewPassword) {
    error.confirmNewPassword = `New password do not match`;
  }

  return {
    error,
    isValid: Object.keys(error).length === 0
  }
}

export default passwordEditValidation;