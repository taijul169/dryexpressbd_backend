 const cityController  =require('../controllers/cityController');
 

 const router  = require('express').Router()
// product router
 router.post('/addcity', cityController.addCity)
 router.get('/allcitywitharea', cityController.getAllCitys)
 router.get('/allcitywithareabyadmin', cityController.getAllCitysByAdmin)
 router.put('/citystatusupdate/:id/:status', cityController.updateCity)
//  single city update
 router.put('/citystatusupdate', cityController.updateSingleCity)
 


 module.exports =  router