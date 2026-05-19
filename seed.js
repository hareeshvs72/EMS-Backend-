import  "dotenv/config";
import connectDB from './config/db.js'
import users from "./models/user.js";
import bcrypt from 'bcrypt'
const temperoryPassword = "admin123"

async function registerAdmin() {
    try {
         const AdminEmail = process.env.ADMIN_EMAIL

         if(!AdminEmail){
            console.error("Missing Admin email env variable");
            process.exit(1)
            
          }
    await connectDB()

    const exisistingAdmin = await users.findOne({email:process.env.ADMIN_EMAIL})
    if(exisistingAdmin){
        console.log("user Already Exoisying as role ",exisistingAdmin.role)
        process.exit(1)
    }
   const hashedPassowrd = await bcrypt.hash(temperoryPassword,10)
   const admin = await users.create({
    email:process.env.ADMIN_EMAIL,
    password:hashedPassowrd,
    role:"Admin"
   })
   console.log("admin user Created ");
   console.log("\nemail:",admin.email);
   console.log("\npassword:",temperoryPassword);
   
   
   process.exit(1)
    } catch (error) {
        console.log(error);
        
    }
}
registerAdmin()