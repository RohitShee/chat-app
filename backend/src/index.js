import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.route.js';
import { connectDB } from './lib/db.js';
const app = express();
dotenv.config();
const PORT = process.env.PORT || 8000;
app.listen(PORT, ()=>{
    console.log(`Server started on http://localhost:`+PORT);
    connectDB()
})

app.use('/api/auth',authRoutes)