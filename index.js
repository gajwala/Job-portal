import express from "express";
import bodyParser from "body-parser";
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from "cors";

import userRouter from './routes/user.js'
import jobRouter from './routes/job.js';
import applicationRouter from './routes/application.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(cors());

// Use API versioning
app.use('/api/v1/users', userRouter);
app.use('/api/v1/jobs', jobRouter);
app.use('/api/v1/applications', applicationRouter);

app.get('/',(req,res)=>{
    res.send('Hello to job portal API')
})

mongoose.connect(process.env.URI).then(()=>{
    console.log('mogoose connected');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

}).catch(()=>{
    console.log(`Something happend in server side please reach out after some time`);
})

