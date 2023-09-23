 
 const offeruserController =  require('../controllers/offeruserController')
 

 const router  = require('express').Router()

// product router
 router.post('/addofferuser', offeruserController.addofferuser)
 router.get('/getallregistereduser', offeruserController.getRegiseredUser)
 router.get('/getregistereduserwithlimit', offeruserController.getRegiseredUserwithlimit)

 module.exports =  router