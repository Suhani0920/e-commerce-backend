import User from "../models/user.js";
import validator from "validator";
import jwt from "jsonwebtoken";


const generateAccessAndRefreshTokens= async(userId)=>{
    try {
        const users= await User.findById(userId)
         const accessToken=users.generateAccessToken();
       const refreshToken =  users.generateRefreshToken();
        users.refreshToken = refreshToken

         await users.save({validateBeforeSave: false})
      
         return {accessToken ,refreshToken};

    } catch (error) {
        return res.status(500).json({error : error?.message});
        
    }
}
const createNewAccount = async(req,res)=>{
    const { username,name,password,email, phoneNumber , isAdmin} = req.body;
  

  if (!validator.isEmail(email)) {
    return res.status(400).send("Invalid email format");
  }

  if (!validator.isLength(password, { min: 6, max: 10})) {
    return res.status(400).send("Password must be between 6 and 10 characters");
  }
  if (!/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/[0-9]/.test(password) || !/[!@#$%^&*]/.test(password)) {
    return res.status(400).send("Password must include uppercase, lowercase, number, and special character");
  }

  if (!/^[a-zA-Z0-9_]{3,15}$/.test(username)) {
    return res.status(400).send("Username must be 3-15 characters long and can only contain letters, numbers, and underscores");
  }

  
  

  
  

    
        const existedUser = await User.findOne({
            $or:[ {username } , { email }]
        })

        if(existedUser){
            return res.status(409).send("email or username already exists ");
            }
   const newUser= await User.create({
        username:username,
        name:name,
        phoneNumber: phoneNumber,
        password:password,
        email : email,
        isAdmin: isAdmin || false // Default to false unless specified
    });

    const newResponse = await User.findById(newUser.id).select("-password -refreshToken")

    if(!newResponse){
        return res.status(500).send("something went wrong while creating new user");
    }
 return res.status(201).send("user created");
}









const loginAccount= async (req,res)=>{
    const {email,username , password} = req.body;
    console.log(email);
    console.log(username);
   if(!(username || email)){
    return res.status(401).send(" username or email required");
   }
    const users = await User.findOne({
       $or: [{username},{email}]
    });
    
     if(!users) return res.status(401).json({ message:"user does not exists"});
    

    const isPasswordValid= await users.isPasswordCorrect(password)
  
    if(!isPasswordValid) return res.status(401).json({ message:"incorrect password"});

    const {accessToken ,refreshToken}= await generateAccessAndRefreshTokens(users._id)
    
    const loggedInUser = await User.findById(users._id).select("-password -refreshToken")
 
    const options = {
        httpOnly : true,
        
    }

    res.status(200).cookie("accessToken",accessToken , options ).cookie("refreshToken",refreshToken , options ).json({msg:"user logged in successfully"});

}














const logOutUser = async(req,res)=>{
    await  User.findByIdAndUpdate(
        req.User._id,{
            $set:{
                refreshToken : undefined
            }
        },
        {
            new : true
        }
     )

     const options = {
        httpOnly : true,
        secure : true
    }

    return res.status(200).clearCookie("accessToken",options).clearCookie("refreshToken", options).json({msg:"User Logged Out"})


}

// Update user details
const updateUserDetails = async (req, res) => {
    const { userId } = req.params;
    const updates = req.body;
  
    try {
      const user = await User.findByIdAndUpdate(userId, updates, { new: true, runValidators: true });
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      res.status(200).json({ message: "User updated successfully", user });
    } catch (error) {
      res.status(500).json({ message: "Failed to update user", error });
    }
  };
  
  // Get user details
  const getUserDetails = async (req, res) => {
    const { userId } = req.params;
  
    try {
      const user = await User.findById(userId).select("-password -refreshToken");
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve user details", error });
    }
  };
  
  // Admin functionality to get all users
  const getAllUsers = async (req, res) => {
    try {
      const users = await User.find().select("-password -refreshToken");
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve users", error });
    }
  };
  
  // Delete a user
  const deleteUser = async (req, res) => {
    const { userId } = req.params;
  
    try {
      const user = await User.findByIdAndDelete(userId);
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete user", error });
    }
  };

const refreshAccessToken = async(req,res)=>{
    try {
        const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken
        if(!incomingRefreshToken){
            return res.status(401).json({msg : "unauthorized request"})
        }
    
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )
    
        const user = await User.findById(decodedToken?._id);
    
        if(!user){
            return res.status(401).json({msg:"invalid refresh token"});
        }
        if(incomingRefreshToken !== User.refreshToken){
            return res.status().json({msg : "Refresh token is expired or used"});
        }
        const options = {
            httpOnly:true,
            secure:true
        }
        const {accessToken,refreshToken} = await generateAccessAndRefreshTokens(user._id)
    
       return res.status(200).cookie("accessToken",accessToken ,options).cookie("refreshtoken",refreshToken,options).json({msg:"Access token refreshed"})
    
    
    } catch (error) {
        return res.status(401).json({error : error?.message});
    }


}

export { createNewAccount, loginAccount  ,logOutUser , updateUserDetails,getUserDetails,getAllUsers,deleteUser,refreshAccessToken};



