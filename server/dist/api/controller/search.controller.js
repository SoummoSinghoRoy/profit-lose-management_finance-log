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
exports.searchResultController = void 0;
const Transaction_model_1 = __importDefault(require("../../model/Transaction.model"));
const searchResultController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { searchterm } = req.params;
    try {
        const transactions = yield Transaction_model_1.default.find({
            $text: { $search: searchterm }
        });
        if (transactions.length !== 0) {
            const response = {
                status: 200,
                message: 'successfully retrieve data',
                data: transactions
            };
            res.json(response);
        }
        else {
            const response = {
                status: 404,
                message: 'Data not found'
            };
            res.json(response);
        }
    }
    catch (error) {
        console.log(error);
        const response = {
            status: 500,
            message: 'Internal Server Error'
        };
        res.json(response);
    }
});
exports.searchResultController = searchResultController;
//# sourceMappingURL=search.controller.js.map