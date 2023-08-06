 const productController  =require('../controllers/productController.js');
 const reviewController  =require('../controllers/reviewController');

 const router  = require('express').Router()
// product router
 router.post('/addproduct/:shopid', productController.addProduct)
//  updated adding product with multiple service type
 router.post('/addproductlatest/:shopid', productController.addProductLatest)
 router.get('/allproducts', productController.getAllProducts)

//  get all products by shop id
 router.get('/allproducts/:shopid', productController.getAllProductsByshopID)

// get published product by shop id
 router.get('/published/:shopid', productController.getPublishedProductByshopID)
 router.get('/publishedformob', productController.getPublishedProductByshopIDforMob)
 router.get('/publishedformobbycategoy', productController.getAllProductsByshopIDAndCategory)
 
 router.get('/allproductbycategory/:category', productController.getProductByCategory)

// get all published product
 router.get('/published', productController.getPublishedProduct)
 router.get('/singleproduct/:id', productController.getOneProduct)
 router.put('/updateproduct/:id', productController.updateProduct)

 router.put('/updateproductlatest/:id', productController.updateProductLatest)
 router.put('/productstatusupdate/:id/:status', productController.productStatusUpdate)
 router.delete('/deleteproduct/:id', productController.deleteProduct)



// review router
router.post('/addReview/:productid',reviewController.addReview)
router.get('/allReviews',reviewController.getAllReviews)

router.get('/getProductReviews/:id',productController.getProuductReviews) 
// get product by keyword
router.get('/getproductbykeyword',productController.findProductByKeyword) 

// servicename 
router.post('/addservicename',productController.addservicename)
router.get('/getallservicename',productController.getallservicename)

// get single product with details
router.get('/getsingleproductdetails/:id',productController.getSingleProductDetails)



 module.exports =  router