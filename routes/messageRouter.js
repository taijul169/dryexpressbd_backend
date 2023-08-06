 const messageController  =require('../controllers/messageController');
 

 const router  = require('express').Router()
// product router
 router.post('/addmessage', messageController.addMessage)
 router.get('/getmessagebycustomeridandshopid/:customer_id/:shop_id', messageController.getMessageByshopidandcustomerid)

 router.get('/allcitywithareabyadmin', messageController.getAllCitysByAdmin)
 router.put('/citystatusupdate/:id/:status', messageController.updateCity)
//  single city update
 router.put('/citystatusupdate', messageController.updateSingleCity)
 


 module.exports =  router