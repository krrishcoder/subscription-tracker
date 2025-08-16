import express from 'express'; 
import { PORT } from './config/env.js'
import cors from 'cors';

import userRouter from './routes/user.routes.js'
import subsRouter from './routes/subscription.routes.js'
import authRouter from './routes/auth.routes.js'
import connectToDb from './database/mongodb.js';
import errorMiddleware from './middlewares/error.middleware.js';
import cookieParser from 'cookie-parser';
import arcjetMiddleware from './middlewares/arcjet.middleware.js';
import workflowRouter from './routes/workflow.routes.js';


const app = express();


app.set('trust proxy', true);
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());

app.use(arcjetMiddleware);

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/subscriptions', subsRouter);
app.use('/api/v1/workflows', workflowRouter);

app.use(errorMiddleware);



app.get('/',(req,res)=>{
     

    res.send('welcome to the subscription tracker API') 


       
})

app.listen(PORT, async()=>{
    console.log(`server  running on http://localhost:${PORT}`)
    await connectToDb();
})



export default app; 

