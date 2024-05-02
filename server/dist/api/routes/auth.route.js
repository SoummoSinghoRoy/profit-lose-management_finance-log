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
const express_1 = require("express");
const router = (0, express_1.Router)();
const auth_controller_1 = require("../controller/auth.controller");
const fileupload_1 = __importDefault(require("../../middlewares/fileupload"));
const isAuthenticated_middleware_1 = require("../../middlewares/isAuthenticated.middleware");
const fileupload = fileupload_1.default.single('thumbnail');
const uploadHandle = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    fileupload(req, res, (err) => {
        if (err) {
            console.log(err);
            const response = {
                status: 400,
                error: {
                    message: `Attachment must be less than 250kb`
                }
            };
            res.json(response);
        }
        else {
            next();
        }
    });
});
router.post('/signup', isAuthenticated_middleware_1.isNotAuthenticated, uploadHandle, auth_controller_1.signUpPostController);
router.post('/login', isAuthenticated_middleware_1.isNotAuthenticated, auth_controller_1.logInPostController);
router.post('/logout', isAuthenticated_middleware_1.isAuthenticated, auth_controller_1.logoutPostController);
router.patch('/edit/:userId', isAuthenticated_middleware_1.isAuthenticated, auth_controller_1.passwordEditPatchController);
router.delete('/delete/:userId', isAuthenticated_middleware_1.isAuthenticated, auth_controller_1.userDeleteController);
exports.default = router;
//# sourceMappingURL=auth.route.js.map