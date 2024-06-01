"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isNotAuthenticated = exports.isAuthenticated = void 0;
const jwt_decode_1 = require("jwt-decode");
const isAuthenticated = (req, res, next) => {
    const customReq = req;
    const token = req.headers['authorization'];
    if (token) {
        const decoded = (0, jwt_decode_1.jwtDecode)(token);
        if (decoded) {
            customReq.user = {
                id: decoded.id,
                username: decoded.username,
                email: decoded.email
            };
            next();
        }
        else {
            const response = {
                status: 403,
                message: 'Forbidden',
                isAuthenticated: false
            };
            res.json(response);
        }
    }
    else {
        const response = {
            status: 401,
            message: 'UnAuthorized',
            isAuthenticated: false,
        };
        res.json(response);
    }
};
exports.isAuthenticated = isAuthenticated;
const isNotAuthenticated = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) {
        next();
    }
    else {
        const response = {
            status: 403,
            message: 'Already loggedin',
            isAuthenticated: true
        };
        res.json(response);
    }
};
exports.isNotAuthenticated = isNotAuthenticated;
//# sourceMappingURL=isAuthenticated.middleware.js.map