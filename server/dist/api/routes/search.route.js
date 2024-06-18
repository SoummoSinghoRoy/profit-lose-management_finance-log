"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
const isAuthenticated_middleware_1 = require("../../middlewares/isAuthenticated.middleware");
const search_controller_1 = require("../controller/search.controller");
router.get('/transaction/:searchterm', isAuthenticated_middleware_1.isAuthenticated, search_controller_1.searchResultController);
exports.default = router;
//# sourceMappingURL=search.route.js.map