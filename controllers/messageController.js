const db = require('../models')

const Message = db.messages




// main work

// 1. create product
const addMessage = async (req,res)=>{
    try {
        let info ={
            message:req.body.message,
            user_type:req.body.user_type,
            customer_id:req.body.customer_id,
            shop_id:req.body.shop_id,
            receiver:req.body.receiver,
        }
        console.log("info:",info)
        const message = await Message.create(info)
        res.status(200).send(message)
        console.log(message)
    } catch (error) {
        console.log(error)
    }
 
   

}

const getMessageByshopidandcustomerid = async(req,res)=>{
   let message = await Message.findAll({
        where:{
            customer_id:req.params.customer_id,
            shop_id:req.params.shop_id
        }
    })
    res.status(200).send(message)
}


// 2 get all products
const getAllCitys = async (req,res) =>{
    let city =  await City.findAll({where:{
        published:true
    } 
    })
    res.status(200).send(city)
}
// 2 get all cities
const getAllCitysByAdmin = async (req,res) =>{
    let city =  await City.findAll()
     res.status(200).send(city)
}






// 3 get single product

const getOneProduct = async (req,res) =>{

    let id = req.params.id
    let product =  await Product.findOne({
     where:{id:id}
    })
     res.status(200).send(product)

}

// 4 single product update

const updateCity = async (req,res) =>{
    let id = req.params.id
    const cityUpdate = await City.update({published:req.params.status},{where:{id:id}})
    res.status(200).send(cityUpdate)
  
}

const updateSingleCity = async (req,res) =>{
    const cityUpdate = await City.update(req.body,{where:{id:req.body.cityid}})
    res.status(200).send(cityUpdate)
  
}
// 5 delete product by id

const deleteProduct = async (req,res) =>{

    let id = req.params.id
   await Product.destroy({where:{id:id}})
     res.status(200).send("Product is deleted")

}

// 6 get published product 

const getPublishedProduct = async (req,res) =>{

   
   const products =  await Product.findAll({
       where:{published:true}
   })

   res.status(200).send(products)
}

// product status update

const productStatusUpdate = async(req,res) =>{
    const product_id  =  req.params.id;
    const status  =  req.params.status;
    console.log("product and status:",product_id , status)
    
    const products =  await Product.update({published:status},{where:{id:product_id}})
    res.status(200).send(products)
    //console.log(product)
}

// 7 get publishedProduct by shiop id
const getPublishedProductByshopID = async (req,res) =>{

   
    const products =  await Product.findAll({
        where:{published:true , shop_id:req.params.shopid}
    })
 
    res.status(200).send(products)
 
 }

module.exports ={
    addMessage,
    getMessageByshopidandcustomerid,
    getAllCitys,
    updateCity,
    getAllCitysByAdmin,
    updateSingleCity
    
    
}