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
const User_model_1 = __importDefault(require("../model/User.model"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const logInValidation = (loginrequestbody) => __awaiter(void 0, void 0, void 0, function* () {
    let error = {};
    if (!loginrequestbody.email) {
        error.email = `Email can't be empty`;
    }
    if (!loginrequestbody.password) {
        error.password = `Password can't be empty`;
    }
    const validUser = yield User_model_1.default.findOne({ email: loginrequestbody.email });
    if (validUser) {
        const match = yield bcrypt_1.default.compare(loginrequestbody.password, validUser.password);
        if (!match) {
            error.password = `Password incorrect`;
        }
    }
    else {
        error.email = `Email not valid`;
    }
    return {
        error,
        isValid: Object.keys(error).length === 0
    };
});
exports.default = logInValidation;
//# sourceMappingURL=login.validation.js.map