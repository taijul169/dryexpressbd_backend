 const codeController  =require('../controllers/codeController');
 

 const router  = require('express').Router()
// product router
 router.post('/addcode', codeController.addCode)
 router.get('/allcode', codeController.getAllCodes)
 router.get('/getcodebyphone', codeController.getCodebyphone)
 router.post('/verifycode', codeController.verifyCode)

 

 module.exports =  router