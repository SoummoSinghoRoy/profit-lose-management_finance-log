"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const app = (0, express_1.default)();
const custom_env_variables_1 = __importDefault(require("./config/custom_env_variables"));
const middleware_1 = __importDefault(require("./middlewares/middleware"));
(0, middleware_1.default)(app);
const route_1 = __importDefault(require("./api/routes/route"));
(0, route_1.default)(app);
const PORT = process.env.PORT || 7272;
mongoose_1.default.set('strictQuery', false);
mongoose_1.default.connect(custom_env_variables_1.default.db_uri).then(() => {
    console.log(`DB connected....`);
    app.listen(PORT, () => {
        console.log(`Server connected on port ${PORT}`);
    });
}).catch((err) => {
    console.log(err);
});
//# sourceMappingURL=server.js.map