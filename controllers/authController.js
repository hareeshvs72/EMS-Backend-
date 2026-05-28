// login for employee 

import users from "../models/user.js"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import employees from "../models/employee.js"

// POST /api/auth/login
export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    // ✅ correct validation
    if (!email || !password) {
      return res.status(400).json({ error: "Email and Password are required" });
    }

    const user = await users.findOne({ email });

    if (!user) {
      return res.status(401).json({ error: "Invalid Credentials" });
    }

    // ✅ role check
    if (role === "Admin" && user.role !== "Admin") {
      return res.status(401).json({ error: "Not authorized as admin" });
    }

    if (role === "Employee" && user.role !== "Employee") {
      return res.status(401).json({ error: "Not authorized as employee" });
    }

    // ✅ password check
    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return res.status(401).json({ error: "Invalid Credentials" });
    }

    // 🔥 IMPORTANT: fetch employee data
    let employee = null;

    if (user.role === "Employee") {
      employee = await employees.findOne({ userId: user._id });
    }

    // ✅ payload
    const payload = {
      userId: user._id,
      role: user.role,
      email: user.email,
      name: employee ? employee.firstName : "Admin",
      designation: employee ? employee.department : "Admin"
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    return res.json({ user: payload, token });

  } catch (error) {
    console.log(error);
    res.status(500).json("Login Failed");
  }
};

// get session for employee and admin 
// GET /api/auth/session
export const session = async (req , res ) =>{
    console.log("inside session");
    
  const session = req.payload
  console.log("auth controller",session);
  
  return res.json({user:session})
}

// chnage password for employee and admin 
// post /api/auth/change-password

export const changePassword = async (req, res) =>{
    try {
        const session = req.payload
        const {currentPassword,newPassword} = req.body
        if(!currentPassword || !newPassword){
                     return   res.status(400).json({error:"Both password are required"})

        }
        const user = await users.findById(session.userId)
        if(!user){
          return   res.status(404).json({error:"user not found"})
        }
        const isValid =  await bcrypt.compare(currentPassword,user.password)
        if(!isValid){
                                 return   res.status(400).json({error:"Current  password is incorrect"})

        }
        const hashed =  await bcrypt.hash(newPassword,10)
        await users.findByIdAndUpdate(session.userId,{password:hashed})
        return res.json({success:true})
    } catch (error) {
        console.log(error);
        
                res.status(500).json("Failed to chage passowrd")

    }
}