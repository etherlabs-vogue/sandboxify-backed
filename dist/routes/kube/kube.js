"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const deploymentValidator_1 = __importDefault(require("../../validators/deploymentValidator"));
const child_process_1 = require("child_process");
const handlebars_1 = __importDefault(require("handlebars"));
const fs = __importStar(require("fs"));
const db_1 = require("../db/db");
const kubeRest = (0, express_1.Router)();
const minioTemplateFile = "./Template/minioTemplate.yaml";
//exec Kubectl commands
function executeKubectl(command) {
    return new Promise((resolve, reject) => {
        (0, child_process_1.exec)(command, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error executing command: ${error}`);
                reject(error);
                return;
            }
            console.log(`Command executed successfully: ${command}`);
            resolve(stdout);
            console.log(`stderr: ${stderr}`);
        });
    });
}
kubeRest.post('/api/deployments/objectStorage', (req, res) => {
    try {
        const { namespaceName, labId, app, accessKey, secretKey } = deploymentValidator_1.default.parse(req.body);
        const source = fs.readFileSync(minioTemplateFile, 'utf-8');
        const template = handlebars_1.default.compile(source);
        const data = {
            NamespaceName: namespaceName,
            labId: labId,
            app: app,
            accessKey: accessKey,
            secretKey: secretKey
        };
        const output = template(data);
        console.log(output);
        fs.writeFileSync('tempfile.yaml', output, 'utf8');
        executeKubectl('kubectl apply -f ./tempfile.yaml')
            .then(() => {
            (0, db_1.createDeployment)(namespaceName, app, accessKey, secretKey);
            //Add Remove file
            res.status(200).json('Deployed Lab');
        })
            .catch((err) => {
            res.status(500).json(err);
        });
    }
    catch (error) {
        //@ts-expect-error
        res.status(400).json(error.message);
    }
});
kubeRest.delete('/api/labs/objectstorage', (req, res) => {
    try {
        const { namespaceName, labId, app, accessKey, secretKey } = deploymentValidator_1.default.parse(req.body);
        const source = fs.readFileSync(minioTemplateFile, 'utf-8');
        const template = handlebars_1.default.compile(source);
        const data = {
            NamespaceName: namespaceName,
            labId: labId,
            app: app,
            accessKey: accessKey,
            secretKey: secretKey
        };
        const output = template(data);
        console.log(output);
        fs.writeFileSync('./tempfile.yaml', output, 'utf8');
        executeKubectl('kubectl delete -f ./tempfile.yaml')
            .then(() => {
            fs.unlink('./tempfile.yaml', (err) => {
                if (err) {
                    console.log(err);
                }
                console.log("deleted Temp file");
            });
            res.status(200).json(`Deleted Lab ${namespaceName} successfully `);
        })
            .catch((err) => {
            res.status(500).json(err);
        });
    }
    catch (error) {
        //@ts-expect-error
        res.status(400).json(error.message);
    }
});
exports.default = kubeRest;
