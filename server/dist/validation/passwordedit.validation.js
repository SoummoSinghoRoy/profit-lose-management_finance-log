"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const validator_1 = __importDefault(require("validator"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const User_model_1 = __importDefault(require("../model/User.model"));
const passwordEditValidation = (editrequestbody) => __awaiter(void 0, void 0, void 0, function* () {
    let error = {};
    if (!editrequestbody.currentPassword) {
        error.currentPassword = `Current password can't be empty`;
    }
    const validUser = yield User_model_1.default.findOne({ _id: editrequestbody.userId });
    if (validUser) {
        const match = yield bcrypt_1.default.compare(editrequestbody.currentPassword, validUser.password);
        if (!match) {
            error.currentPassword = `Incorrect password`;
        }
    }
    else {
        error.credential = `Wrong credential! Can't update password`;
    }
    if (!editrequestbody.newPassword) {
        error.newPassword = `New password can't be empty`;
    }
    else if (!validator_1.default.isLength(editrequestbody.newPassword, { min: 6, max: 10 })) {
        error.newPassword = ` New password length must be 6 to 10 charecter`;
    }
    if (!editrequestbody.confirmNewPassword) {
        error.confirmNewPassword = `Confirm new password can't be empty`;
    }
    else if (editrequestbody.newPassword !== editrequestbody.confirmNewPassword) {
        error.confirmNewPassword = `New password do not match`;
    }
    return {
        error,
        isValid: Object.keys(error).length === 0
    };
});
exports.default = passwordEditValidation;
//# sourceMappingURL=passwordedit.validation.js.map