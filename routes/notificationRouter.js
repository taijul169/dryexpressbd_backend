
 const notificationController = require('../controllers/notificationController');
 const router_notification  = require('express').Router()
 router_notification.post('/addnotification', notificationController.addNotification)
 router_notification.get('/getallnotification', notificationController.getAllNotification)
 router_notification.get('/getsinglenotification/:notification_id', notificationController.getSingleNotification)
 router_notification.get('/getallnotificationbyuseridnusertype/:user_id/:user_type/:status', notificationController.getAllNotificationByUseridAndUserType)
 router_notification.put('/notificationstatusupdatebyid/:notification_id/:status', notificationController.notificationStatusUpdate)
 router_notification.put('/allnotificationupdatebyusertypenid/:user_id/:user_type', notificationController.notificationStatusUpdateforAllbyuseridandtype)


 module.exports =  router_notification