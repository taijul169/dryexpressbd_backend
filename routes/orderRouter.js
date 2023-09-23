
 const orderController  =require('../controllers/orderController');
 const router_order  = require('express').Router()
// order router
 router_order.post('/addorder/:userid', orderController.addOrder)

//  add order latest
 router_order.post('/addorderlatest/:userid', orderController.addOrderlatest)
//  get all orders by discount id
 router_order.get('/getallordersbydiscountid/:discount_id', orderController.getAllOrdersByDiscountId)
//  get all orders by shopid and discount id
 router_order.get('/getallordersbydiscountidandShopid/:discount_id/:shop_id', orderController.getAllOrdersByDiscountIdandshopid)
 router_order.get('/allorders', orderController.getAllOrders)
//  admin report
 router_order.post('/allorders/report', orderController.getAllOrdersforReport)

 router_order.get('/allordersbyshopid/:shopid', orderController.getAllOrdersByshopId)
 router_order.get('/allcustomersbyshopid/:shop_id', orderController.getallCustomersByShopID)
//  for mob dashboard
 router_order.get('/allordersbyshopid/mob/:shopid', orderController.getLengthforalltypesOrders)

//  get order list by status and shop id
 router_order.get('/shop/:status/:shopid', orderController.getAllOrdersByStatusshopId)
//  get all orders by status
 router_order.get('/:status', orderController.getAllOrdersByStatus)
//  get all order by payment method by admin for report

 router_order.post('/report/payment', orderController.getAllOrdersByPaymentMethod)

 //router_order.get('/singleorder/:id', orderController.getOneOrder)
 router_order.get('/singleorder/:order_id', orderController.getsingleOrderbyorderid)

 router_order.get('/allorderbyuserid/:userid', orderController.getOrdersbyuserid)
 router_order.get('/allshopsbyuserid/:userid', orderController.getShoplistbyuserid)
 
 router_order.get('/allorderbyuseridandshopid/:userid/:shop_id', orderController.getOrdersbyuseridAndShopid)

 router_order.get('/getallorderwithreviewandcustomerinfo/:userid/:shop_id', orderController.getallorderbycustomeridandshopid)
//  router_order.delete('/deleteorder/:id', orderController.deleteorder)
//  router_order.get('/allpublished', orderController.getActiveorder)
 router_order.get('/alldeliverdorder', orderController.getDeliveredOrder)
 router_order.put('/orderstatusupdatebyid/:orderid/:status', orderController.orderStatusUpdate)
//  update payment status
 router_order.put('/orderpaymentstatusupdatebyid/:orderid/:status/:method', orderController.updatePaymentStatus)

 router_order.get('/allordersbystatusandshopid/mob', orderController.getAllOrdersBystatusnshopidinmobile)
//  get best seller
 router_order.post('/report/bestseller', orderController.getBestSeller)
//  best customer by date for shop panel
 router_order.post('/report/bestcustomer', orderController.getBestCustomerByshop)
 router_order.post('/report/shop/datewiseorder', orderController.getAllOrdersforReportShop)
 router_order.get('/verifycourierbycustomer/:order_id/:code/:status', orderController.verifycourierbycustomer)
//  get todays order for admin panel
 router_order.get('/gettodaysordersforadmin/today', orderController.getToadysOrderForAdmin)
 router_order.get('/getpaymentdetails/details', orderController.duetoLaundryDetails)
 router_order.get('/gettodaysorderlist/admin', orderController.getTodaysOrderlist)
//  get todays order list for laundry
 router_order.get('/gettodaysorderlist/laundry/:shop_id', orderController.getTodaysOrderlistLaundry)
 router_order.get('/gettodaysorderdetails/laundry/:shop_id', orderController.getToadysOrderForLaundry)

//  get order list for duetodryexpress and due from dryexpress for laundry panel
router_order.get('/dueorderlisttodryexpressbd/:shop_id',orderController.dueorderlisttodryexpressbd)
router_order.get('/dueorderlistfromdryexpressbd/:shop_id',orderController.dueorderlistfromdryexpressbd)

router_order.put('/orderstatusupdatefordisbursedbyid/:orderid',orderController.updatedisburesorderstatus)

 module.exports =  router_order