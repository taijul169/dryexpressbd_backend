const db = require('../models')

// create main Model

const RegiCode = db.registrationcodes




// main work

// 1. create product
const addCode = async (req,res)=>{
    let info ={
        code:Math.floor(100000 + Math.random() * 900000),
        phone:req.body.phone,
        isactive:req.body.isactive ? req.body.isactive :true,
    }
    const code = await RegiCode.create(info)
    res.status(200).send(code)
    // const alreadyExist =  await City.findOne({where:{
    //     city:info.city,
    //     area:info.area
    // }})
    // if(alreadyExist){
    //     res.status(403).send({msg:"This data already exist!!!"})
    // }else{
       
    //     console.log(city)
    // }

 
}


// 2 get all products
const getAllCodes = async (req,res) =>{
    let code =  await RegiCode.findAll()
    res.status(200).send(code)
}
// get code by phone number
const getCodebyphone = async (req,res) =>{
    const {phone} = req.query
    let city =  await RegiCode.findAll({
        where:{
            phone:phone
        }
    })
    let code = city[city.length-1]
    res.status(200).send(code)
}

const verifyCode = async(req,res)=>{

    const {phone,code} = req.body
    let city =  await RegiCode.findAll({
        where:{
            phone:phone
        }
    })
    let data = city[city.length-1]
    if(code == data.code){
        res.status(200).send({msg:'success',code:200})
    }else{
        res.status(400).send({msg:'failed',code:400})
    }
}


module.exports ={
    addCode,
    getAllCodes,
    getCodebyphone,
    verifyCode  
    
}