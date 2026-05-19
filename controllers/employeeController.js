

import employees from '../models/employee.js'
import bcrypt from 'bcrypt'
import users from '../models/user.js'
// get employees
// GET /api/employees
export const getEmployees = async (req,res)=>{
  try {
     const {department} = req.query
     const where ={}
     if(department){
        where.department = department
     }
     const employee = await employees.find(where).toSorted({createdAt:-1}).populate("userId", "email role").lean() 
     res.json(employee)
  } catch (error) {
    res.status(500).json({err:"Failed To Fetch Employees", error})
  }
}

// create employee
// POST /api/employees

export const createEmployees = async (req,res)=>{
   try {
    const {firstName,lastName,email,phone,position,department,basicSalary,allowances,deduction,joinDate,password,role,bio}= req.body
    if(!email || !password || !firstName || !lastName){
      return  res.status(400).json({err :"Missing Required Fields"})
    }
       const hashed = await bcrypt.hash(password,10)
       const user = await users.create({
        email,
        password:hashed,
        role:role || "Employee"
       })

       const employee = await employees.create({
        userId:user._id,
        firstName,
        lastName,
        email,
        phone,
        position,
        department,
        basicSalary:Number(basicSalary) || 0 ,
        allowances:Number(allowances) || 0 ,
        deduction:Number(deduction) || 0 ,
        joinDate:new Date(joinDate),
        bio:bio || ""
       })
       res.status(201).json({success:true,employee})

   } catch (error) {
    if(error.code === 11000){
        res.status(400).json({error:"email Already Exixt"})
    }
    console.log(error);
    res.status(500).json({err:"Failed To Create Employee"})
    
   }
}

// update employee
// PUT /api/employee/:id
export const updateEmployees = async (req,res)=>{
 try {
    const {id} = req.params
    const {firstName,lastName,email,phone,position,department,basicSalary,allowances,deduction,password,role,bio,employeeStatus}= req.body
    
    const employee = await employees.findById(id)
    if(!employee) return res.status(404).json({error:"Employe Not Found"})
  


     const updateEmployee = await employees.findByIdAndUpdate(id,
        {
        firstName,
        lastName,
        email,
        phone,
        position,
        department,
        basicSalary:Number(basicSalary) || 0 ,
        allowances:Number(allowances) || 0 ,
        deduction:Number(deduction) || 0 ,
        employeeStatus:employeeStatus || "Active",
        bio:bio || ""
       },{new:true})
       res.status(201).json({success:true,updateEmployee})

    //    update user Records
     
    // const updateUser = await users.findByIdAndUpdate(employee.userId,{ })

   } catch (error) {
    if(error.code === 11000){
        res.status(400).json({error:"email Already Exixt"})
    }
    console.log(error);
    res.status(500).json({err:"Failed To Update Employee"})
    
   }
}

// delete employee
// DELETE /api/employees/:id
export const deleteEmployees = async (req,res)=>{
  try {
    const {id} = req.params
    const employee  = await employees.findById(id)
    if(!employee) return res.status(400).json({error:"Employee Not Found"})

        employee.isDeleted = true
        employee.employeeStatus = "Inactive"
        await employee.save()
        res.json({success:true})
  } catch (error) {
     console.log(error);
    res.status(500).json({err:"Failed To Delete Employee"})
    
  }
}