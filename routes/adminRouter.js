
 const adminController  =require('../controllers/adminController');
 const router_admin  = require('express').Router()
// customer router
 router_admin.post('/addadmin', adminController.addAdmin)
 router_admin.get('/alladmins', adminController.getAlladmins)
 router_admin.get('/singleadmin/:id', adminController.getOneAdmin)
 router_admin.put('/updateadmin/:id', adminController.updateAdmin)
 router_admin.delete('/deleteadmin/:id', adminController.deleteAdmin)
//customer route authenticate
router_admin.get('/authenticate/:jwtoken',adminController.adminauthenticate);

//  login route
router_admin.post('/login',adminController.adminlogin);

 module.exports =  router_admin