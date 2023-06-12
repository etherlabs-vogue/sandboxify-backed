"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const deploymentObjectSchema = zod_1.z.object({
    namespaceName: zod_1.z.string().min(3).max(10).refine((val) => val.toLowerCase() === val, {
        message: 'Namespace name must be in lowercase'
    }),
    labId: zod_1.z.number().int(),
    app: zod_1.z.string().min(3).max(10),
    accessKey: zod_1.z.string().min(6).refine((val) => val.toLowerCase() === val, {
        message: 'Access key must be in lowercase'
    }),
    secretKey: zod_1.z.string().min(6).refine((val) => val.toLowerCase() === val, {
        message: 'Secret key must be in lowercase'
    })
});
exports.default = deploymentObjectSchema;
