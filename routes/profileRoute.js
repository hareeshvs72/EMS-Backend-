import { Router } from 'express'
import { getProfile, updateProfile } from '../controllers/profileController.js'
import { protect  } from '../middleware/auth.js'

const profileRouter = Router()

profileRouter.put("/",protect,updateProfile)
profileRouter.get("/",protect,getProfile)

export default profileRouter