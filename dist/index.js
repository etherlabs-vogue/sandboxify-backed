"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_1 = __importDefault(require("./routes/db/db"));
const kube_1 = __importDefault(require("./routes/kube/kube"));
const body_parser_1 = __importDefault(require("body-parser"));
const PORT = 3001;
const app = (0, express_1.default)();
///Usage Of modules
// app.use(express.json())
app.use(body_parser_1.default.json());
app.use(kube_1.default);
app.use(db_1.default);
app.get('/', (req, res) => {
    res.send('Well done!');
});
app.get('/health', (req, res) => {
    res.status(200).json("application is UP");
});
app.listen(PORT, () => {
    console.log(`Application is listening on port ${PORT}`);
});
