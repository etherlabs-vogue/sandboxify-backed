import express from 'express';
import dbRest from './routes/db/db';
import kubeRest from './routes/kube/kube';
import bodyParser from 'body-parser';


const PORT = 3000
const app = express();


///Usage Of modules
// app.use(express.json())
app.use(bodyParser.json())
app.use(kubeRest)
app.use(dbRest)

  



app.get('/', (req, res) => {
    res.send('Well done!');
})

app.get('/health',(req , res)=>{
    res.status(200).json("application is UP")

})


app.listen(PORT, () => {
    console.log(`Application is listening on port ${PORT}`);
})