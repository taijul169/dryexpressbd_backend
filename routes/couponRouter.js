 const couponController  =require('../controllers/couponController');

 const router  = require('express').Router()
// product router
 router.post('/createcoupon', couponController.createCoupon)
 router.get('/getallactivecoupon', couponController.getAllActivecoupons)
 router.get('/getallcoupon', couponController.getAllcouponssByAdmin)
 router.put('/updatecouponbyid', couponController.updatecouponbyid)
 router.post('/couponcodevalidate', couponController.validateCouponCode)

 


 module.exports =  router