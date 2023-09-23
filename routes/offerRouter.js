 
 const offerController =  require('../controllers/offerController')

 const router  = require('express').Router()

// product router
 router.post('/addoffer',offerController.upload, offerController.addoffer)
 router.put('/singleofferupdate',offerController.upload, offerController.updateSingleOffer)
 router.get('/getalloffer', offerController.getAlloffer)
 router.get('/getSingleActiveOffer', offerController.getActiveSingleOffer)
 router.get('/getSingleofferbyid/:id', offerController.getActiveSingleOfferByid)


 module.exports =  router