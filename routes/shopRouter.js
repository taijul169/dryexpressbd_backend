
 const shopController  =require('../controllers/shopController');
const adminModel = require('../models/adminModel');
 const router_shop  = require('express').Router()
// shop router
 router_shop.post('/addshop', shopController.upload, shopController.addShop)
 router_shop.get('/allshopsadmin', shopController.getAllShopsAdmin)
 router_shop.get('/allshops', shopController.getAllShops)
//  get shop from admin panel for report 
 router_shop.post('/allshops/report', shopController.getAllShopsforReport)
 
 router_shop.get('/singleshop/:id', shopController.getOneShop)
//  get single shop by phone or id
 router_shop.post('/findsingleshop', shopController.getSingleShopByPhoneOrID)

 router_shop.put('/updateshop/:id',shopController.upload, shopController.updateShop)
 router_shop.put('/updateshopimage/:id',shopController.upload, shopController.updateShopImage)
 router_shop.put('/updateshopnidphoto/:id',shopController.uploadNID, shopController.updateShopnidphoto)
 router_shop.put('/updateshoptradephoto/:id',shopController.uploadTRADE, shopController.updateShoptradephoto)
 router_shop.put('/shopstatusupdate/:id/:status', shopController.shopstatusupdate)
 router_shop.put('/shopblockedunblocked/:id/:status', shopController.shopblockedunblocked)
//update shop status (online offline) by shop 
 router_shop.put('/shopstatusupdatebyshop/:id/:status', shopController.updateShopStatusbyshop)
//  shop status update by adminModel( featured or not)
 router_shop.put('/makeshopfeaturedOrNot/:id/:status', shopController.updateShopFeaturedStatusbyAdmin)
 router_shop.delete('/deleteshop/:id', shopController.deleteShop)
 router_shop.get('/allpublishedshop', shopController.getActiveShop)
 router_shop.get('/allpublishedshopbyareacity', shopController.getActiveShopByareaUpdated)
 router_shop.post('/userexistOrNot/:phone', shopController.NumberExistOrNot)
 router_shop.get('/userexistOrNot/:phone', shopController.NumberExistOrNot)
//  get shop by area and city
 router_shop.get('/shops/:city/:area', shopController.getActiveShopByarea);
 router_shop.get('/shopsbylocation/:lat/:long', shopController.getActiveShopByUserLocation);

//  get newly requested and pending shop list
router_shop.get('/allpendinglist',shopController.getallPendingshops);
//  get blocked shop list
router_shop.get('/allblockedlist',shopController.getallBlockedshops);
// get all verified list
router_shop.get('/allverifiedlist',shopController.getallVerifiedshops);

 router_shop.get('/shopproducts/:shopid',shopController.getshopsproducts);

//  login route
 router_shop.post('/login',shopController.shoplogin);
//  shop route authenticate
 router_shop.get('/authenticate/:jwtoken',shopController.shopauthenticate);


 // get all shops by city and area for mobile with pagination
 router_shop.get('/getallshopsbycityandarea',shopController.getAllShopsByCityAreaForMob);
 router_shop.get('/getallshopsbylatlong',shopController.getActiveShopByUserLocationForMob);
//  get featured Shoplist
 router_shop.get('/getfeaturedShoplist',shopController.getActiveFeaturedData);
router_shop.put('/updatefirebasetoken/:id',shopController.updateFirebasetoken)
router_shop.put('/updateprofitpercentglobal/:id',shopController.updateprofitpercentglobal)
router_shop.put('/passwordrecover',shopController.forGotPassword)
 module.exports =  router_shop