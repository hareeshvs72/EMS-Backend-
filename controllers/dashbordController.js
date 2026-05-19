// get dashbord for employye and admin
// get /api/dashbord

export const getDashbord = async (req,res) => {
    try {
        const session = req.session
        if ( session.role === "Admin"){
            
        }
    } catch (error) {
        console.error("dashbord error " , error)
        return res.status(500).json({error:"Failed"})
    }
}