import { string, z } from 'zod';

const deploymentObjectSchema = z.object({
    namespaceName: z.string().min(3).max(10).refine((val) => val.toLowerCase() === val, {
      message: 'Namespace name must be in lowercase'
    }),
    labId: z.number().int(),
    app: z.string().min(3).max(10),
    accessKey: z.string().min(6).refine((val) => val.toLowerCase() === val, {
      message: 'Access key must be in lowercase'
    }),
    secretKey: z.string().min(6).refine((val) => val.toLowerCase() === val, {
      message: 'Secret key must be in lowercase'
    })
  });
  



export default deploymentObjectSchema