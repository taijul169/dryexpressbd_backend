
 const reviewController  =require('../controllers/reviewController');
 const router_review  = require('express').Router()
 router_review.post('/addreview', reviewController.addReview)
 router_review.get('/getallreview', reviewController.getAllReviews)
 router_review.get('/getallreviewbyshopid/:shop_id', reviewController.getAllReviewsByShopId)
 router_review.get('/getallreviewbyuserid/:user_id', reviewController.getAllReviewsByUserId)


 module.exports =  router_review