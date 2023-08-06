 const packageController  =require('../controllers/packageController.js');
 //const reviewController  =require('../controllers/reviewController');
 const router  = require('express').Router()
// product router
 router.post('/addpackageitem', packageController.addPackageitem)
 router.get('/allpackageitem', packageController.getAllPackageitem)


// get all published product
 router.get('/activepackageitem', packageController.getActiveItem)

 router.get('/singlepackageitem/:id', packageController.getOneItem)
 router.put('/updatepackageitem/:id', packageController.updateItem)
 router.delete('/deletepackageitem/:id', packageController.deleteItem)
 router.get('/totalamount', packageController.getSumofPrice)



 module.exports =  router