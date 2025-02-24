import dotenv from 'dotenv';
import express from 'express';
import cookieParser from 'cookie-parser';

import authRoutes from './routes/auth.route.js';
import { connectDB } from './lib/db.js';


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json()); 
app.use(cookieParser());


//Creating Routes
app.use("/api/v1/auth", authRoutes);


app.listen(PORT, ()=>{
    console.log(`Server is running on the port ${PORT}`);
    connectDB();
})

