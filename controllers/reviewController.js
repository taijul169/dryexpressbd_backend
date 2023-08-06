const db = require('../models')


const Review = db.reviews
const Customer = db.customers
const Shop = db.shops
// function
// 1.add review
const addReview = async(req,res)=>{
    console.log("shop id:",req.params.shop_id)

  let data = {
      rating:req.body.rating,
      description:req.body.description,
      shop_id:req.body.shop_id,
      user_id:req.body.user_id
  }

  const review = await Review.create(data)
  res.status(200).send({review,code:200,msg:'success'})
}

// 2.Get all Reviews

const getAllReviews =  async (req,res) =>{
    const reviews =  await Review.findAll({})
    res.status(200).send(reviews)
}
// 2.Get all Reviews by shop id

const getAllReviewsByShopId =  async (req,res) =>{
    const shop_id = req.params.shop_id
    console.log("shop_id",shop_id)
    let reviews =  await Review.findAll({
        include:[
            {
            model:Customer,
            as:'customer',
            attributes: ['name','createdAt','photo']
        },

    ],where:{shop_id:shop_id},
    
     }
    )
    console.log("review",reviews[1])
    reviews =  reviews.map((itemparent)=>{
        itemparent.customer.photo =`${req.protocol+"://"+req.headers.host}/${itemparent.customer.photo}`
        return itemparent
      
    })
    
    console.log("review",reviews)
    res.status(200).send(reviews)
}

// 2.Get all Reviews by user id

const getAllReviewsByUserId =  async (req,res) =>{
    const user_id = req.params.user_id
    const reviews =  await Review.findAll({where:{user_id}})
    res.status(200).send(reviews)
}
module.exports = {
    addReview,getAllReviews,getAllReviewsByShopId,getAllReviewsByUserId
}
    
