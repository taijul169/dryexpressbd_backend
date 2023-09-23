 const accountController  = require('../controllers/accountController');
 const router  = require('express').Router()
// product router
 router.post('/addaccount', accountController.addAccount)
 router.get('/allaccounts', accountController.getAllAccounts)
 router.get('/getaccountbyshopid/:shopid', accountController.getAllAccountsbyshopid)
 router.put('/updateAccountsbyshop/:shopid', accountController.updateAccountsbyshop)
 router.get('/getsingletransaction/:id', accountController.getsingletransaction)
 router.get('/getalltransactionbyshopid', accountController.getAllAccountsByShopID)


 

 module.exports =  router