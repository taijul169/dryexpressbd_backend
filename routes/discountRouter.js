
 const discountController = require('../controllers/discountController');
 const router_discount  = require('express').Router()
 router_discount.post('/adddiscount', discountController.addDiscount)
 router_discount.post('/adduserdiscount', discountController.addUsertoDiscount)
 router_discount.get('/getalldiscount', discountController.getAllDiscunts)
 router_discount.get('/updatealldiscount', discountController.getAllDiscunts)
 router_discount.get('/getalldiscountbyuserid/:user_id/:user_type', discountController.getAllDiscountsByUserID)
//  get customer discount by customer id
 router_discount.get('/getalldiscountbycustomerid/:customer_id', discountController.getAllDiscountsByCustomerID)
 router_discount.get('/getalldiscountbycustomeridindashboard/:customer_id', discountController.getAllDiscountsByCustomerIDInDashboard)
 router_discount.get('/getallusersbydiscountid/:discount_id/:user_type', discountController.getAllUsersByDiscountID)
 router_discount.get('/getsinglediscount/:id', discountController.getSingleDiscountId)
 router_discount.put('/updaesinglediscount/:id', discountController.updateSingleDiscount)

 module.exports =  router_discount