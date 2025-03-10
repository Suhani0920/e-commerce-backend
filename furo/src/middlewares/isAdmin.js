import User from "../models/user.js";

export const isAdmin = async(req,res,next)=>{
    try {
        if(!req.user){
            return res.status(401).json({ msg: "Unauthorized" });
        }

        const user = await User.findById(req.user._id);
        if(!user || !user.isAdmin){
            return res.status(403).json({ msg: "Access denied, admin privileges required" });
        }

        next();
    } catch (error) {
        return res.status(500).json({ msg: "Internal server error" });
    }
};
