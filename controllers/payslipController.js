

// create payslip
// post /api/payslips

import employees from "../models/employee.js"
import payslips from "../models/paySlip.js"

export const createPayslip = async (req,res) => {
    try {
        const { employeeId ,month ,year ,basicSalary,allowances,deduction} = req.body

    if(!month || !basicSalary || !year || !employeeId){
        return res.status(400).json({error:"Missing fields"})
    }

    const netSalary = Number(basicSalary) + Number(allowances || 0 ) - Number(deduction || 0)
   const payslip =  await payslips.create({
    employeeId,
    month:Number(month),
    year:Number(year),
    basicSalary:Number(basicSalary),
    allowance:Number(allowances || 0),
    deduction:Number(deduction || 0),
    netSalary

   })
   return res.json({success:true , data : payslip})
    } catch (error) {
       return res.status(500).json({error:"Failed"}) 
    }

}


// get payslips
// get /api/payslips

export const getPayslips = async (req,res) => {
    try {
        const session = req.session
        const isAdmin = session.role === "Admin"

        if(isAdmin){
            const payslip = await payslips.find().populate("employeeId").sort({createdAt:-1})
            return res.json({data:payslip})
         }
         else{
            const employee = await employees.findOne({userId:session.userId})
            if(!employee){
                return res.status(404).json({error:"Not Found"})
            }
            const payslip = await payslips.find({employeeId:employee._id}).sort({createdAt:-1})
            return res.json({dtat:payslip})

         }
    } catch (error) {
               return res.status(500).json({error:"Failed"}) 

    }
    
}

// get payslip by id
// get /api/payslip/:id

export const getPayslipById = async (req,res) => {
    try {
        const payslip = await payslips.findById(req.params.id).populate("employeeId").lean()
        if(!payslip) return res.status(404).json({error:"Not Found"})
            res.json({data:payslip})
    } catch (error) {
                       return res.status(500).json({error:"Failed"}) 

    }
}

