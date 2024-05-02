 const membershipController  =require('../controllers/membershipController');

 const router  = require('express').Router()
// product router
 router.post('/createmembership', membershipController.createMembership)
 router.get('/getsingleactivemembership', membershipController.getSingleMembershipData)
 router.get('/getallmembership', membershipController.getAllMembershipData)
 router.put('/updatesinglemembership', membershipController.updatesinglemembership)
 router.delete('/singleitemdeletebyid/:id', membershipController.deleteitembyid)


 


 module.exports =  router