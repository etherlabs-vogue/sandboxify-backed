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
exports.deleteDeployment = exports.createDeployment = exports.deleteLab = void 0;
const express_1 = require("express");
const client_1 = require("@prisma/client");
const labTypeValidator_1 = __importDefault(require("../../validators/labTypeValidator"));
const body_parser_1 = __importDefault(require("body-parser"));
const prisma = new client_1.PrismaClient();
//Lab 
function createLab(title, description, type) {
    return __awaiter(this, void 0, void 0, function* () {
        const lab = yield prisma.labType.create({
            data: {
                title: title,
                description: description,
                type: type
            }
        });
        console.log("created Lab successfully");
    });
}
// Delete Lab
function deleteLab(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const lab = yield prisma.labType.delete({
            where: {
                id: id
            }
        });
        console.log("deleted Lab successfully");
    });
}
exports.deleteLab = deleteLab;
// Update Lab
function updateLab(title, description, type) {
    return __awaiter(this, void 0, void 0, function* () {
        const lab = yield prisma.labType.update({
            where: {
                title: title
            },
            data: {
                title: title,
                description: description,
                type: type,
            }
        });
        console.log("updated Lab successfully");
    });
}
//Deployment
function createDeployment(namespaceName, app, accessKey, secretKey) {
    return __awaiter(this, void 0, void 0, function* () {
        const deplyoment = yield prisma.deployment.create({
            data: {
                namespaceName: namespaceName,
                app: app,
                accessKey: accessKey,
                secretKey: secretKey
            }
        });
        console.log(`Created Deployment for ${namespaceName} successfully`);
    });
}
exports.createDeployment = createDeployment;
function deleteDeployment(namespaceName) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield prisma.deployment.delete({
                where: {
                    namespaceName: namespaceName,
                },
            });
            console.log(`Deleted Deployment for ${namespaceName} successfully`);
        }
        catch (error) {
            console.error(error);
        }
    });
}
exports.deleteDeployment = deleteDeployment;
const dbRest = (0, express_1.Router)();
dbRest.get('/api/labtypes', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const labs = yield prisma.labType.findMany();
        res.json(labs);
    }
    catch (error) {
        console.error('Error retrieving lab data:', error);
        res.status(500).json({ error: 'Failed to retrieve lab data' });
    }
}));
//Create Labtype in Database
dbRest.post('/api/create/labtype', body_parser_1.default.json(), (req, res) => {
    console.log(req.body);
    const { title, description, type } = labTypeValidator_1.default.parse(req.body);
    createLab(title, description, type).then(() => __awaiter(void 0, void 0, void 0, function* () {
        yield prisma.$disconnect();
    }))
        .catch((e) => __awaiter(void 0, void 0, void 0, function* () {
        console.error(e);
        yield prisma.$disconnect();
        process.exit(1);
    }));
    res.send(200).json(`Created Lab: ${title} successfully`);
});
dbRest.delete('/api/create/labtype', (res, req) => {
    const { labid } = req.body;
    deleteLab(labid).then(() => __awaiter(void 0, void 0, void 0, function* () {
        yield prisma.$disconnect();
    }))
        .catch((e) => __awaiter(void 0, void 0, void 0, function* () {
        console.error(e);
        yield prisma.$disconnect();
        process.exit(1);
    }));
    res.send(200).json(`Created Lab: ${labid} successfully`);
});
dbRest.put('/api/create/labtype', (res, req) => {
    const { title, description, type } = labTypeValidator_1.default.parse(req.body);
    updateLab(title, description, type).then(() => __awaiter(void 0, void 0, void 0, function* () {
        yield prisma.$disconnect();
    }))
        .catch((e) => __awaiter(void 0, void 0, void 0, function* () {
        console.error(e);
        yield prisma.$disconnect();
        process.exit(1);
    }));
    res.send(200).json(`Created Lab: ${title} successfully`);
});
exports.default = dbRest;
