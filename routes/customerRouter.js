
 const customerController  =require('../controllers/customerController');
 const router_customer  = require('express').Router()
// customer router
 router_customer.post('/addcustomer',customerController.upload, customerController.addCustomer)
 router_customer.get('/allcustomers', customerController.getAllCustomers)
 router_customer.get('/singlecustomer/:id', customerController.getOneCustomer)
 router_customer.put('/updatecustomer/:id',customerController.upload, customerController.updateCustomer)
 router_customer.post('/userexistOrNot/:phone', customerController.NumberExistOrNot)
 router_customer.get('/userexistOrNot/:phone', customerController.NumberExistOrNot)


//  status update 
 router_customer.put('/updatecustomerstatus/:id/:status', customerController.updateCustomerstatus)
 router_customer.delete('/deletecustomer/:id', customerController.deleteCustomer)
//  customer route authenticate
router_customer.get('/authenticate/:jwtoken',customerController.customerauthenticate);

//  login route
router_customer.post('/login',customerController.customerlogin);

 module.exports =  router_customer