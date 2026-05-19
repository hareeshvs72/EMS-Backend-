import { Router } from "express";
import { protect } from "../middleware/auth.js";
import { clockiInOut, getAttendence } from "../controllers/attendenceController.js";

const attendenceRouter = Router()

attendenceRouter.post('/',protect,clockiInOut)
attendenceRouter.get('/',protect,getAttendence)
export default attendenceRouter