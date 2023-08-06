
 const courierController  =require('../controllers/courierController');
 const router_courier  = require('express').Router()
// courier router
 router_courier.post('/addcourier', courierController.upload, courierController.addCourier)
 router_courier.get('/allcouriers', courierController.getAllCourier)
 router_courier.get('/allcouriersbyshopid/:shop_id', courierController.getAllCourierByshopID)
 router_courier.get('/singlecourier/:id', courierController.getOneCourier)
 router_courier.put('/updatecourier/:id',courierController.upload, courierController.updateCourier)

 router_courier.put('/updatecourierphoto/:id',courierController.upload, courierController.updateCourierphoto)
 
 router_courier.put('/courierstatusupdate/:id/:status', courierController.Courierstatusupdate)
 router_courier.put('/courierblockedunblocked/:id/:status', courierController.Courierblockedunblocked)
 //router_courier.delete('/deletecourier/:id', courierController.deletecourier)
 router_courier.get('/allpublishedcourier', courierController.getActiveCourier)

//  get courier by area and city
 router_courier.get('/couriers/:city/:area', courierController.getActiveCourierByarea);

//  get newly requested and pending courier list
 router_courier.get('/allpendinglist',courierController.getallPendingCouriers);
//  get blocked courier list
router_courier.get('/allblockedlist',courierController.getallBlockedCouriers);

 router_courier.get('/courierproducts/:courierid',courierController.getCouriersproducts);
 router_courier.get('/courierproductsbyfilters/:status/:courierid',courierController.getCouriersproductsbyfilters);

//  login route
 router_courier.post('/login',courierController.Courierlogin);
//  courier route authenticate
 router_courier.get('/authenticate/:jwtoken',courierController.Courierauthenticate);

 router_courier.put('/updatecourierimage/:id',courierController.upload,courierController.updateImageCourier)


 module.exports =  router_courier