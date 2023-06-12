"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const LabTypeSchema = zod_1.z.object({
    title: zod_1.z.string().min(1).max(100),
    description: zod_1.z.string().min(1).max(1000),
    type: zod_1.z.string().min(1).max(100)
});
exports.default = LabTypeSchema;
