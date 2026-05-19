

import employees from "../models/employee.js"
import leaveApllications from "../models/leaveAplication.js"
import { session } from "./authController.js"

// create leave
// post /api/leaves

export const createLeaves = async (req,res) => {

    try {
        const session = req.session
        const employee =  await employees.findOne({userId:session.userId})
         if(!employee){
            return res.status(404).json({error:"Employee not found"})
        }
        if(employee.isDeleted){
                        return res.status(403).json({error:"Your account is deactivated. You cannot clock in/out"})

        }

        const {type,startDate,endDate,reason} = req.body
        if(!type || !startDate || !endDate || !reason){
                                    return res.status(400).json({error:"Missing Fields"})

        }
        const today = new Date()
        today.setHours(0,0,0,0)
        if(new Date(startDate)<= today || new Date(endDate)<=today){
                                                return res.status(400).json({error:"Leave date must be in future"})

        }
         if(new Date(endDate)< new Date(startDate)){
                                                return res.status(400).json({error:"end date cannot be before start date"})

        }
        const leave = await  leaveApllications.create({
            employeeId:employee._id,
            type,
            startDate:new Date(startDate),
            endDate:new Date(endDate),
            reason,
            status:"Pending"


        })
        return res.json({success:true,data:leave })
    } catch (error) {
        res.status(500).json({error:"Failed"})
    }
    
}

// get leaves
// get /api/leaves
export const getLeaves = async (req,res) => {
 try {
            const session = req.session
     const isAdmin =  session.role === "Admin"
     if(isAdmin){
      const status = req.query.status
      const where = status ? {status} : {}
      const leaves = await leaveApllications.find(where).populate("employeeId").sort({createdAt:-1})
      const data = leaves.map((i)=>{
        const obj = i.toObject()
        return {
            ...obj,
            id:obj._id,
            employeee:obj.employeeId,
            employeeId:obj.employeeId?._id.toString()
    
        }
      })
      return res.json({data})
     }else{
        const employee = await employees.findOne({
            userId:session.userId
        }).lean()
        if(!employee) return res.status(404).json({error:"Not found"})
            const leaves = await leaveApllications.find({
        employeeId:employee._id}).sort({createdAt:-1})

        return res.json({
            data:leaves,
            employee:{...employee,id:employee._id.toString()}
        })
     }
 } catch (error) {
            res.status(500).json({error:"Failed"})

 }   
}

// update leave status
// Patch /api/leaves/:id

export const updateLeaveStatus = async (req,res) => {
    try {
        const {status} = req.body
        if(!["Pending","Approved" ,"Rejected"].includes(status)){
            return res.status(400).json({error:"Invalid status"})
        }

        const leave = await leaveApllications.findByIdAndUpdate(req.params.id,{status},{returnDocumnet:"after"})
        return res.json({success:true,data:leave})
        
    } catch (error) {
                   res.status(500).json({error:"Failed"})
console.log(error);
 
    }
}