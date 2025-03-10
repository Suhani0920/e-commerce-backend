import jwt from "jsonwebtoken";
import User from "../models/user.js"; 

export const verifyJWT = async (req, res, next) => {
  try {
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

   
    if (!token) {
      console.log("token not found");
      return res.status(401).json({ msg: "Unauthorized request" });
    }
    
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    

    const user = await User.findById(decodedToken?._id).select("-password -refreshToken"); // Fetch user without sensitive data
    if (!user) {
      
      return res.status(401).json({ msg: "Invalid Access Token" });
    }

    req.user = user; // Attach the retrieved user to the request
    
    next();
  } catch (error) {

    console.log("Token verification error:", error);
    return res.status(401).json({ msg: "Invalid Access Token" });
  }
};
