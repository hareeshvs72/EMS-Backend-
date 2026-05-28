import {Router} from 'express'
import { getDashbord } from '../controllers/dashbordController.js'
import { protect} from '../middleware/auth.js'

const dashboardRouter = Router()

dashboardRouter.get("/", protect, getDashbord)

export default dashboardRouter