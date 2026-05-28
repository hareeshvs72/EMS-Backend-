import express from 'express'
import cors from 'cors'
import  'dotenv/config'
import multer from 'multer'
import  connectDB  from './config/db.js'
import authRouter from './routes/authRoutes.js'
import emploeesRouter from './routes/employeeRouter.js'
import attendenceRouter from './routes/attendenceRoutes.js'
import leaveRouter from './routes/leaveRoute.js'
import payslipRouter from './routes/payslipRouter.js'
import { serve } from "inngest/express";
import { inngest, functions } from "./inngest/index.js"
import dashbordRouter from './routes/dashboardRoute.js'
import profileRouter from './routes/profileRoute.js'
const app = express()


const PORT = process.env.PORT || 4000


// middleware 

app.use(cors())
app.use(express.json())
app.use(multer().none())

// route

app.get("/",(req,res)=>{
    res.send("server is running")
})


app.use((req,res,next)=>{
  console.log(req.method,req.url);
  next()
  
})


app.use("/api/auth", authRouter)
app.use('/api/employees',emploeesRouter)
app.use('/api/attendence',attendenceRouter)
app.use('/api/leave',leaveRouter)
app.use('/api/payslips',payslipRouter)
app.use('/api/dashboard',dashbordRouter)
app.use('/api/profile',profileRouter)


app.use("/api/inngest", serve({ client: inngest, functions }));




// server running ( listen )
await connectDB()
app.listen(PORT,()=> console.log(`server is running on ${PORT}`))