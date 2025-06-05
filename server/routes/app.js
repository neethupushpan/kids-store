const express = require('express')
const router = express.Router()

const userRouter = require('./userRoutes')
const sellerRouter = require('./sellerRoutes')
const adminRouter = require('./adminRoutes')
const productRouter = require('./productRoutes')
const orderRouter = require('./orderRoutes')
const cartRouter = require('./cartRoutes')
const reviewRouter = require('./reviewRoutes')
// /api/user
router.use('/user',userRouter)
// /api/admin
router.use('/admin',adminRouter)
// /api/seller
router.use('/seller',sellerRouter)
//productRouter
router.use('/product',productRouter)
//orderRouter
router.use('/orders',orderRouter)
//cartRouter
router.use('/cart',cartRouter)
//reviewRouter
router.use('/review',reviewRouter)
//paymentRouter
module.exports = router 