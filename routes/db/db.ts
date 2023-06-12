import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import LabTypeSchema from '../../validators/labTypeValidator';
import bodyParser from 'body-parser';
const prisma = new PrismaClient()


//Lab 
async function createLab(title: string, description: string, type: string) {
  const lab = await prisma.labType.create({
    data: {
      title: title,
      description: description,
      type: type
    }
  })
  console.log("created Lab successfully")
}
// Delete Lab
export async function deleteLab(id: number) {
  const lab = await prisma.labType.delete({
    where: {
      id: id
    }
  });
  console.log("deleted Lab successfully");
}
// Update Lab
async function updateLab(title: string, description: string, type: string ) {
  const lab = await prisma.labType.update({
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
}



//Deployment
export async function createDeployment(namespaceName: string, app: string, accessKey: string, secretKey: string) {
  const deplyoment = await prisma.deployment.create({
    data: {
      namespaceName: namespaceName,
      app: app,
      accessKey: accessKey,
      secretKey: secretKey
    }
  })
  console.log(`Created Deployment for ${namespaceName} successfully`)
}

export async function deleteDeployment(namespaceName: string) {
  try {
    await prisma.deployment.delete({
      where: {
        namespaceName: namespaceName,
      },
    });
    console.log(`Deleted Deployment for ${namespaceName} successfully`);
  } catch (error) {
    console.error(error);
  }
}




const dbRest = Router();

dbRest.get('/api/labtypes', async (req, res) => {
  try {
    const labs = await prisma.labType.findMany();
    res.json(labs);
  } catch (error) {
    console.error('Error retrieving lab data:', error);
    res.status(500).json({ error: 'Failed to retrieve lab data' });
  }
});


//Create Labtype in Database
dbRest.post('/api/create/labtype',bodyParser.json(), (req: Request, res: Response) => {
  console.log(req.body)
  const { title, description, type } = LabTypeSchema.parse(req.body)
  createLab(title, description, type).then(async () => {
    await prisma.$disconnect()
  })
    .catch(async (e) => {
      console.error(e)
      await prisma.$disconnect()
      process.exit(1)
    })
  res.send(200).json(`Created Lab: ${title} successfully`)

})
dbRest.delete('/api/create/labtype', (req: Request, res: Response) => {
  const { labid } = req.body
  deleteLab(labid).then(async () => {
    await prisma.$disconnect()
  })
    .catch(async (e) => {
      console.error(e)
      await prisma.$disconnect()
      process.exit(1)
    })
  res.send(200).json(`Created Lab: ${labid} successfully`)

})
dbRest.put('/api/create/labtype', (req: Request, res: Response) => {
  const { title, description, type } = LabTypeSchema.parse(req.body)
  updateLab(title , description , type).then(async () => {
    await prisma.$disconnect()
  })
    .catch(async (e) => {
      console.error(e)
      await prisma.$disconnect()
      process.exit(1)
    })
  res.send(200).json(`Created Lab: ${title} successfully`)

})

export default dbRest