const db = require('../models')

// create main Model

const City =db.city




// main work

// 1. create product
const addCity = async (req,res)=>{
    let info ={
        city:req.body.city,
        area:req.body.area,
        description:req.body.description,
        published:req.body.published ? req.body.published :true,
    }
    const alreadyExist =  await City.findOne({where:{
        city:info.city,
        area:info.area
    }})
    if(alreadyExist){
        res.status(403).send({msg:"This data already exist!!!"})
    }else{
        const city = await City.create(info)
        res.status(200).send(city)
        console.log(city)
    }

 
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
    addCity,
    getAllCitys,
    updateCity,
    getAllCitysByAdmin,
    updateSingleCity
    
    
}