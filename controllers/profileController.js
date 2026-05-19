// GEt Profile
// GET /api/profile
import employee from '../models/employee.js'
export const getProfiile = async (req,res)=>{
       
    try {
        const session = req.session
        const employee = await employee.findOne({userId:session.userId})

        if(!employee){
            // authenticated user is not employee - return admin profile 
            return res.json({
                firstname:"Admin",
                
            })
        }

    } catch (error) {
        console.log(error);
        
    }
}

// update profile
// PUT /api/profile

export const UpdateProfile = async (req,res) => {
    
}