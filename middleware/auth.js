
import jwt from 'jsonwebtoken'
export const protect = async (req, res, next) => {
    console.log("inside protect midleware");
    
    try {
        const authHeader = req.headers.authorization
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ error: "Unauthorized" })
        }
        const token = authHeader.split(" ")[1]
        console.log("token", token);

        req.payload =  jwt.verify(token, process.env.JWT_SECRET)
        console.log(res.payload );

        if (!req.payload ) {
            return res.status(401).json({ error: "Unauthorized" })
        }
        next()
    } catch (error) {
        console.log(error);

        return res.status(500).json({ error: "Unauthorized" })

    }
}

export const protectAdmin = (req, res, next) => {
    console.log("admin", req.payload);

    if (req?.payload?.role !== "Admin") {
        return res.status(403).json({ error: "Admin Access required" })
    }
    next()
}