import express from "express";
import UserRouter from "./routes/v1/user-router";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import cors from 'cors'
dotenv.config();
const app =  express()

app.use(express.json())
app.use(express.raw({ type: "application/octet-stream", limit: "10mb" }));
app.use(cookieParser())
app.use(cors({
    origin: 'http://localhost:3000',
    credentials:true
  }))
app.use('/api/v1',UserRouter) 


app.listen(9000,()=>{
    console.log('Server is running on http://localhost:9000')
})