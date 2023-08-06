
 const productImageController  =require('../controllers/productImageController');
 const router_shop  = require('express').Router()
// shop router
 router_shop.post('/addproductimage', productImageController.upload, productImageController.addProductImage)
 router_shop.get('/allproductimage', productImageController.getAllImages)
 router_shop.put('/productstatusupdate/:id/:status', productImageController.updateProduct)

 module.exports =  router_shop