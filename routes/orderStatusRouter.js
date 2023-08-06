 const orderstatusController = require('../controllers/orderstatusController');
 

 const router  = require('express').Router()
// product router
 router.post('/addorderstatus', orderstatusController.addAccept)
 router.get('/getorderstatusbyorderid/:order_id',orderstatusController.getOrderStatus)
 router.put('/orderstatusupdatebyorderid/:order_id/:status',orderstatusController.orderStatusUpdate)
 router.put('/orderstatusupdatecancelbyorderid/:order_id/:status',orderstatusController.orderStatusUpdateforcancel)
 //router.get('/allcitywitharea', orderstatusController.getAllCitys)
 


 module.exports =  router