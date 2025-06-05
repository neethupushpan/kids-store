const Admin = require('../models/adminModel');
const User = require('../models/userModel')
const bcrypt = require('bcrypt');
const createToken = require('../utils/generateToken');

// Admin Register
const register = async (req, res) => {
  try {
    const { name, email, password, accessLevel = 1 } = req.body||{

    };

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

   const userExists = await Admin.findOne({email})
   if(userExists){
   return res.status(400).json({error:"User already exists"})
   }
//password hash
  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(password,salt)
  console.log(hashedPassword)
  
//user - save to db
   const newUser = new Admin({name,email,password:hashedPassword,role:'admin',accessLevel})
   const savedUser = await newUser.save()
   
   
    
//remove password from user to send back
    const userData = savedUser.toObject();
    delete userData.password


return res.status(201).json({ message: 'Admin registered', userData });
  } catch(error) {
    res.status(500).json({ error: error.message });
  }
};

//login
//login
const login = async(req,res,next)=>{
    try{
//input - variables store
const {email,password} = req.body|| {}

//valid-input
if( !email || !password){
return res.status(400).json({error:"All fields are required"})
}
//check if user exists
const userExists = await Admin.findOne({email})
if(!userExists){
return res.status(400).json({error:"User not found"})
}
  console.log("Input Password:", password);
    console.log("Stored Password (Hashed):", userExists.password);
//compare paswsword
const passwordMatch = await bcrypt.compare(password,userExists.password)

if(!passwordMatch){
    return res.status(400).json({error:"Invalid Password"})
}
//token creation
const token = createToken(userExists._id, userExists.role); 

 res.cookie('token',token,{
    httpOnly:true,
    secure:true,
    sameSite:'Strict'
});                                                               
const userObject = userExists.toObject()
delete userObject.password
return res.status(200).json({message:"Login succesful",userObject})

    }catch(error){
        console.log(error)



res.status(error.status||500).json({error:error.message||"Internal server error"})
    }
}
//

//profile
const profile =async(req,res,next)=>{
    try{
    const userId=req.user.id
    const userData = await Admin.findById(userId).select("-password")
    return res.status(200).json({data:userData,message:"profile retrieved"})
    }catch(error){
        console.log(error)
        res.status(error.status||500).json({error:error.message||"Internal server error"})
    }
}
//logout
const logout = async(req,res,next)=>{
    try{
        res.clearCookie("token")
        res.status(200).json({
            success:true,
            message:"Logout Successfully",
        })
    }catch(error){
        console.log(error)
        res.status(error.status||500).json({error:error.message||"Internal server error"})

    }
}
//update
const update =async(req,res,next)=>{
    try{
    const userId=req.user.id

    const {name,email,password,profilepic} = req.body||{}
    const userData = await Admin.findByIdAndUpdate(userId,{name,email,password,profilepic},{new:true}).select("-password")
    return res.status(200).json({data:userData,message:"profile updated"})
    }catch(error){
        console.log(error)
        res.status(error.status||500).json({error:error.message||"Internal server error"})
    }
}

//delete user
const deleteUser =async(req,res,next)=>{
    try{
    const userId=req.params.userId
    if(!userId){
        return res.status(400).json({error:'User ID is required'});
    }

   
    const userData = await User.findByIdAndDelete(userId)
    if(!userData){
        return res.status(400).json({error:'User not found'}); 
    }
    return res.status(200).json({deletedUser:userData._id,message:"User deleted"})
    }catch(error){
        console.log(error)
        res.status(error.status||500).json({error:error.message||"Internal server error"})
    }
}

module.exports={register,login,profile,logout,update,deleteUser}
