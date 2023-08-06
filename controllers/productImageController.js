const db = require('../models')
const randomstring = require("randomstring");
const multer = require("multer");
const path = require('path')
const sequelize =  require('sequelize')
//const { products } = require('../models');
// create main Model
const Productimage = db.productimages
const Product = db.products

// upload image controller
const storage =  multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'uploads');
    },
    filename: function(req,file,cb){
        cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname);
    }
    
})

const upload  =  multer({
    storage:storage,
    limits:{fileSize:'1000000'}
}).single('image')


// main work

// 1. create Shop

const addProductImage = async (req,res)=>{
    if(req.file){
        let info ={
            name:req.body.name,
            category:req.body.category,
            image:req.file.path,
        }
        
        const productimg = await Productimage.create(info)
        res.status(200).send(productimg)
    
        
    }
    else{
        res.status(400).send({msg:'select image please'})
    }  
  
}


// 2 get all Shops
const getAllImages = async (req,res) =>{
    let productimgs =  await Productimage.findAll()
    productimgs = productimgs.map((item,index)=>{
        item.image = `${req.protocol+"://"+req.headers.host}/${item.image}`
        return item
    })
    res.status(200).send(productimgs)
     
    
}

// update service
const updateProduct = async (req,res) =>{

    let id = req.params.id
    const productupdated = await Productimage.update({published:req.params.status},{where:{id:id}})
    res.status(200).send(productupdated)
   
}






module.exports ={
    getAllImages,
    upload,
    addProductImage,
    updateProduct 
    
}