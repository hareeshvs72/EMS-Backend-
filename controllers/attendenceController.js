// clock in/out for employee
// POST /api/attendence

import attendences from "../models/attendence.js";
import employees from "../models/employee.js";

export const clockiInOut = async (req,res) => {
    try {
        const session = req.payload
        const employee = await employees.findOne({
            userId:session.userId
        })
        if(!employee){
            return res.status(404).json({error:"Employee not found"})
        }
        if(employee.isDeleted){
                        return res.status(403).json({error:"Your account is deactivated. You cannot clock in/out"})

        }
        const today = new Date()
        today.setHours(0,0,0,0)
        const exisisting = await attendences.findOne({
            employeeId:employee._id,
            date:today,


        })
        const now  = new Date()

        if(!exisisting){
            const isLate = now.getHours() >=9 && now.getMinutes() > 0 

            const attendence =  await attendences.create({
                employeeId:employee._id,
                date:today,
                checkIn:now,
                status: isLate ? "Late" : "Present"
            })

            return res.json({success : true , type:"Check_IN", date: attendence})

        }
        else if (!existing.checkOut){
             const checkInTime = new Date(exisisting.checkIn).getTime()
             const diffms = now.getTime() - checkInTime
             const diffHours = diffms / (1000 *60 * 60)

             exisisting.checkOut = now
            //  compute working hours and day type 
            const workingHours =  parseFloat(diffHours.toFixed(2))
            let dayType = "Half Day"
            if(workingHours>=8) dayType = "Full Day"
            else if (workingHours>=6) dayType = "Three Quarter Day"
            else if(workingHours>=4) dayType = "Half Day"
            else dayType = "Short Day"

            exisisting.workingHours = workingHours
            exisisting.dayType = dayType
            await attendences.save()
           return res.json({success:true , type:"CHECK_Out", data:exisisting}) 
        }
        else{
                    return res.json({success:true , type:"CHECK_Out", data:exisisting}) 
   
        }

        
    } catch (error) {
        console.log("attendence Error",error);
      return   res.status(500).json({error:"Operation Failed"})
        
    }
}

// get Attendence for employee
// get /api/attendence

export const getAttendence = async (req,res) => {
    try {
         const session = req.payload
        const employee = await employees.findOne({
            userId:session.userId
        })
        if(!employee){
            return res.status(404).json({error:"Employee not found"})
        }

        const limit = parseInt(req.query.limit || 30)
        const history = (await attendences.find({employeeId:employee._id})).sort({date:-1}).limit(limit)
        return res,json({
            data:history,
            employee:{isDeleted:employee.isDeleted }
        })

    } catch (error) {
           console.log("attendence Error",error);
      return   res.status(500).json({error:"Failed To Fetch Attendence"})
    }
}