"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const path_1 = __importDefault(require("path"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const health_check_1 = __importDefault(require("./routes/health_check"));
const book_1 = __importDefault(require("./routes/book"));
const author_1 = __importDefault(require("./routes/author"));
const category_1 = __importDefault(require("./routes/category"));
const auth_1 = __importDefault(require("./routes/auth"));
const app = (0, express_1.default)();
dotenv_1.default.config();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.static(path_1.default.join(__dirname, "public")));
app.use((0, morgan_1.default)("dev"));
// Connect to DB
mongoose_1.default.connect(String(process.env.MONGODB_URI))
    .then(() => console.log("Connected to DB successfully"))
    .catch(err => console.log("Error connecting to DB: ", err));
// Routes
app.get("/api/health-check", health_check_1.default);
app.use("/api/auth", auth_1.default);
app.use("/api/author", author_1.default);
app.use("/api/book", book_1.default);
app.use("/api/category", category_1.default);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Listening to server on port: ${PORT}`));
exports.default = app;
