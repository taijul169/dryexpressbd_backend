const db = require('../models')

// create main Model

const City =db.city

const Coupon=db.coupons


// main work

// 1. create product
const createCoupon = async (req,res)=>{
    let info ={
        name:req.body.name,
        percent:req.body.percent,
        description:req.body.description,
        isActive:req.body.isActive ? req.body.isActive :true,
    }
    const alreadyExist =  await Coupon.findOne({where:{
        name:info.name,
    }})
    if(alreadyExist){
        res.status(403).send({msg:"This data already exist!!!"})
    }else{
        const data = await Coupon.create(info)
        res.status(201).send({data,code:201,msg:'Created Successfully'})
        console.log(data)
    }

 
}


// 2 get all products
const getAllActivecoupons = async (req,res) =>{
    let coupon =  await Coupon.findAll({where:{
        isActive:true
    } 
    })
    res.status(200).send(coupon)
}
// 2 get all cities
const getAllcouponssByAdmin = async (req,res) =>{
    let coupon =  await Coupon.findAll()
     res.status(200).send(coupon)
}


// singlecouponupdate
const updatecouponbyid = async (req,res)=>{
    try {
        let info ={
            id:req.body.id,
            name:req.body.name,
            percent:req.body.percent,
            description:req.body.description,
            isActive:req.body.isActive
        }
        const coupon =  Coupon.update(info,{
            where:{
                id:info.id
            }
        })
        res.status(200).send({coupon,code:200,msg:'Updated successfully'})
    } catch (error) {
        
    }
   
}



const validateCouponCode =  async (req,res)=>{
    try {
    const data =  await Coupon.findOne({
            where:{
                name:req.body.name
            }
        })
        
       if(data && data.isActive == true){
           res.status(200).send({code:200,msg:'Valild Code'})
       }else{
        res.status(400).send({code:400,msg:'Invalid Code'})
       } 
    } catch (error) {
        console.log("error",error)
        res.send({error})
    }
}



module.exports ={
    createCoupon,
    getAllActivecoupons,
    getAllcouponssByAdmin,
    updatecouponbyid,
    validateCouponCode
    
}