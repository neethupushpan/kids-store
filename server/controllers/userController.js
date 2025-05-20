const User = require('../models/userModel')
const bcrypt = require('bcrypt')
const createToken = require('../utils/generateToken')
//register

const register = async (req,res,next)=>{
    try{
//input - variables store
const {name,email,password,profilepic} = req.body|| {}

//valid-input
if(!name || !email || !password){
return res.status(400).json({error:"All fields are required"})
}
//check if user exists
const userExists = await User.findOne({email})
if(userExists){
return res.status(400).json({error:"User already exists"})
}
//password hash
const salt = await bcrypt.genSalt(10)
const hashedPassword = await bcrypt.hash(password,salt)
console.log(hashedPassword)
//user - save to db
const role = req.body.role && ['admin', 'user'].includes(req.body.role) ? req.body.role : 'user';
const newUser = new User({name,email,password:hashedPassword,role: role})
const savedUser = await newUser.save()

//remove password from user to send back
const userData = savedUser.toObject()
delete userData.password

res.status(201).json({message:"Account created",userData})
    
}catch(error){
        console.log(error)
        res.status(error.status||500).json({error:error.message||"Internal server error"})
    }
}


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
const userExists = await User.findOne({email})
if(!userExists){
return res.status(400).json({error:"User not found"})
}
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
//profile
const profile =async(req,res,next)=>{
    try{
    const userId=req.user.id
    const userData = await User.findById(userId).select("-password")
    return res.status(200).json({data:userData,message:"profile retrieved"})
    }catch(error){
        console.log(error)
        res.status(error.status||500).json({error:error.message||"Internal server error"})
    }
}
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
    const userData = await User.findByIdAndUpdate(userId,{name,email,password,profilepic},{new:true}).select("-password")
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