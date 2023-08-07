 const orderstatusController = require('../controllers/orderstatusController');
 
const cartController  =  require('../controllers/cartController')
 const router  = require('express').Router()


//  cart router
router.post('/addtocart', cartController.upload, cartController.addToCart)
router.get('/getcartitem',cartController.getCartItem)
router.get('/getsinglecartitem/:id',cartController.getsingleCartItem)
router.delete('/deletetecartitem/:id',cartController.deleteCartItem)
router.delete('/deletetecartitembytoken',cartController.deleteCartItembytoken)
// product router
 router.post('/addorderstatus', orderstatusController.addAccept)
 router.get('/getorderstatusbyorderid/:order_id',orderstatusController.getOrderStatus)
 router.put('/orderstatusupdatebyorderid/:order_id/:status',orderstatusController.orderStatusUpdate)
 router.put('/orderstatusupdatecancelbyorderid/:order_id/:status',orderstatusController.orderStatusUpdateforcancel)
 //router.get('/allcitywitharea', orderstatusController.getAllCitys)
 


 module.exports =  router