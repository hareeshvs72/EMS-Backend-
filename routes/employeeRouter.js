import {Router} from 'express'
import { createEmployees, deleteEmployees, getEmployees, updateEmployees } from '../controllers/employeeController.js'
import { protect, protectAdmin } from '../middleware/auth.js'

const emploeesRouter = Router()

emploeesRouter.get("/",protect,protectAdmin,getEmployees)
emploeesRouter.post("/",protect,protectAdmin,createEmployees)
emploeesRouter.put("/:id",protect,protectAdmin,updateEmployees)
emploeesRouter.delete("/:id",protect,protectAdmin,deleteEmployees)

export default emploeesRouter
