
const express = require('express')
const adminRouter =express.Router()
const {register} = require("../controllers/adminController")
const {login,profile,logout,update,deleteUser} =require("../controllers/adminController")

const authAdmin = require('../middlewares/authAdmin')


//signup
// /api/user/register
adminRouter.post('/register',register)

//login
// /api/user/login
adminRouter.post('/login',login)
//logout
adminRouter.get('/logout',logout)
//profile
adminRouter.get('/profile',authAdmin,profile)
//profile-update
adminRouter.patch('/update',authAdmin,update)
//delete
adminRouter.delete('/delete/:userId',authAdmin,deleteUser)
module.exports = adminRouter