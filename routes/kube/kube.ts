import { Router, Request, Response } from 'express';
import deploymentObjectSchema from '../../validators/deploymentValidator';
import { exec } from 'child_process';
import Handlebars from 'handlebars';
import * as fs from 'fs';

import { createDeployment } from '../db/db'

const kubeRest = Router()
const minioTemplateFile = "./Template/minioTemplate.yaml"


//exec Kubectl commands
function executeKubectl(command: string): Promise<string> {
    return new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
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








kubeRest.post('/api/deployments/objectStorage', (req: Request, res: Response) => {
    try {
        const { namespaceName, labId, app, accessKey, secretKey } = deploymentObjectSchema.parse(req.body);
        const source = fs.readFileSync(minioTemplateFile, 'utf-8');
        const template = Handlebars.compile(source);
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
                createDeployment(namespaceName, app, accessKey, secretKey)
                //Add Remove file
                res.status(200).json('Deployed Lab');
            })
            .catch((err) => {
                res.status(500).json(err);
            });

    } catch (error) {
        //@ts-expect-error
        res.status(400).json(error.message);
    }
});

kubeRest.delete('/api/labs/objectstorage', (req: Request, res: Response) => {
    try {
        const { namespaceName, labId, app, accessKey, secretKey } = deploymentObjectSchema.parse(req.body);

        const source = fs.readFileSync(minioTemplateFile, 'utf-8');
        const template = Handlebars.compile(source);
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
                        console.log(err)
                    }
                    console.log("deleted Temp file")
                })
            
                res.status(200).json(`Deleted Lab ${namespaceName} successfully `);
            })
            .catch((err) => {
                res.status(500).json(err);
            });
    } catch (error) {
        //@ts-expect-error
        res.status(400).json(error.message);
    }
});





export default kubeRest