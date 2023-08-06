
 
 const paymenthistory =require('../controllers/paymentController')
 const router_payment  = require('express').Router()

router_payment.post('/addpayment',paymenthistory.addPayment)
router_payment.get('/getallpaymenthistory',paymenthistory.getallpaymenthistory)
router_payment.get('/getallpaymentbyshopid',paymenthistory.getapppaymenthistorybyshopid)
router_payment.get('/getallpaymentbycustomerid',paymenthistory.getapppaymenthistorybycustomerid)
router_payment.get('/getallpaymentbyorderid',paymenthistory.getapppaymenthistorybyorderid)



 module.exports =  router_payment