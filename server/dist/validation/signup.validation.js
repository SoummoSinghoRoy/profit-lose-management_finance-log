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
const User_model_1 = __importDefault(require("../model/User.model"));
const signupValidation = (signuprequestbody) => __awaiter(void 0, void 0, void 0, function* () {
    let error = {};
    if (!signuprequestbody.username) {
        error.username = `Username can't empty`;
    }
    if (!signuprequestbody.email) {
        error.email = `Email can't empty`;
    }
    else if (!validator_1.default.isEmail(signuprequestbody.email)) {
        error.email = `Email must be valid`;
    }
    if (!signuprequestbody.password) {
        error.password = `Password can't be empty`;
    }
    else if (!validator_1.default.isLength(signuprequestbody.password, { min: 6, max: 10 })) {
        error.password = `Password length must be 6 to 10 charecter`;
    }
    if (!signuprequestbody.confirmPassword) {
        error.confirmPassword = `Confirm password can't be empty`;
    }
    else if (signuprequestbody.password !== signuprequestbody.confirmPassword) {
        error.confirmPassword = `Password do not match`;
    }
    const existuser = yield User_model_1.default.findOne({ email: signuprequestbody.email });
    if (existuser) {
        error.email = `You don't use this email`;
    }
    return {
        error,
        isValid: Object.keys(error).length === 0
    };
});
exports.default = signupValidation;
//# sourceMappingURL=signup.validation.js.map