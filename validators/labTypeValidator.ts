import { string, z } from 'zod';


const LabTypeSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().min(1).max(1000),
  type: z.string().min(1).max(100)

})

  export default LabTypeSchema