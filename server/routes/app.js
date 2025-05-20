const express = require('express')
const router = express.Router()

const userRouter = require('./userRoutes')
// /api/user
router.use('/user',userRouter)
//productRouter
//paymentRouter
module.exports = router 