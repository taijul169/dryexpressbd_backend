const db = require('../models')
const { Op } = require('sequelize');
const multer = require('multer')
// create main Model
const Offer =  db.offers
const Offeruser = db.offeruser
// upload image controller
const storage =  multer.diskStorage({
 
    destination:function(req,file,cb){
        if(file){
            cb(null,'uploads');
        }   
    },
    filename: function(req,file,cb){
        if(file){
            cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname);
        }
        
    }
})
const upload  =  multer({
    storage:storage,
    limits:{fileSize:'1000000'}
}).single('photo')
const addoffer = async (req,res)=>{
    
    try {
        if(req.file){
            let info = {
                name:req.body.name,
                details:req.body.details,
                discount_percent:req.body.discount_percent?req.body.discount_percent:null,
                photo:req.file.path,
                startdate:req.body.startdate,
                expired_in:req.body.expired_in,
            }
            console.log("req.bdoy",req.body)
            const offer =   await Offer.create(info)
            res.status(201).send({data:offer,msg:'Offer Created Successfully',code:201})
           
        }else{
            let info = {
                name:req.body.name,
                details:req.body.details,
                discount_percent:req.body.discount_percent?req.body.discount_percent:null,
                photo:null,
                startdate:req.body.startdate,
                expired_in:req.body.expired_in,
            }
            console.log("req.bdoy",req.body)
            const offer =   await Offer.create(info)
            res.status(201).send({data:offer,msg:'Offer Created Successfully',code:201})
        }
       
        
    } catch (error) {
        console.log("error",error)
        res.send({error})
    }
   
}


// get all offer
const getAlloffer = async (req,res) =>{
    let offers =  await Offer.findAll()
    if(offers.length>0){
        offers.map((item,idx)=>{
            item.photo = `${req.protocol+"://"+req.headers.host}/${item.photo}`
        })
    }
    res.status(200).send(offers)
}

const getActiveSingleOffer =  async (req,res)=>{
  const data =   await Offer.findOne({
        where:{
            published:true
        },
       
    })
 if(data){
     data.photo =  `${req.protocol+"://"+req.headers.host}/${data.photo}`
 }
  res.status(200).send(data)  
}
// main work
const getActiveSingleOfferByid =  async (req,res)=>{
    const data =   await Offer.findOne({
          where:{
              id:req.params.id
          },
          include:[{
              model:Offeruser,
              as:'offeruser',
              required:false
          }]
      })
   if(data){
       data.photo =  `${req.protocol+"://"+req.headers.host}/${data.photo}`
   }
    res.status(200).send(data)  
  }
// update single offer

const updateSingleOffer = async(req,res)=>{
    try {
        if(req.file){
            let info = {
                name:req.body.name,
                details:req.body.details,
                discount_percent:req.body.discount_percent?req.body.discount_percent:null,
                photo:req.file.path,
                startdate:req.body.startdate,
                expired_in:req.body.expired_in,
                offer_id:req.body.offer_id,
                published:req.body.published,
            }
            console.log("req.bdoy",req.body)
            const offer =   await Offer.update(info,{
                where:{
                    id:info.offer_id
                }
            })
            res.status(200).send({data:offer,msg:'Offer updated Successfully',code:200})
           
        }else{
            let info = {
                name:req.body.name,
                details:req.body.details,
                discount_percent:req.body.discount_percent?req.body.discount_percent:null,
                photo:null,
                startdate:req.body.startdate,
                expired_in:req.body.expired_in,
                offer_id:req.body.offer_id,
                published:req.body.published,
            }
            console.log("req.bdoy",req.body)
            const offer =   await Offer.update(info,{
                where:{
                    id:info.offer_id
                }
            })
            res.status(200).send({data:offer,msg:'Offer updated Successfully',code:200})
        }  
        
    } catch (error) {
        console.log("error",error)
        res.send({error})
    }
}

module.exports ={
    addoffer,
    getAlloffer,
    upload,
    getActiveSingleOffer,
    updateSingleOffer,
    getActiveSingleOfferByid
}