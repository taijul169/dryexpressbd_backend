const db = require('../models')
const { Op } = require('sequelize');
// create main Model

const City =db.city

const Offeruser =  db.offeruser

const addofferuser = async (req,res)=>{
    
    try {
        let info = {
            firstname:req.body.firstname,
            lastname:req.body.lastname,
            email:req.body.email?req.body.email:null,
            phone:req.body.phone?req.body.phone:null,
            address:req.body.address,
        }
        console.log("req.body",req.body)
        const alreadyExist  =  await Offeruser.findOne({
            where:{
               [Op.or]:[
                {
                 email:info.email
               },
               {
                phone:info.phone, 
               }
              ] ,
                
    
            }
        })
        if(alreadyExist){
            res.status(409).send({
                msg:'You are already registered!!',
                code:409
            })
        }
        else{
          const offeruser =   await Offeruser.create(info)
          res.status(201).send({data:offeruser,msg:'Registered Successfully',code:201})
        }
    } catch (error) {
        console.log("error",error)
        res.send({error})
    }
   
}


// get all registered user
const getRegiseredUser = async (req,res) =>{
    let users =  await Offeruser.findAll()
    res.status(200).send(users)
}

const getRegiseredUserwithlimit = async (req,res) =>{
    let users =  await Offeruser.findAll({
        limit:10
    })
    res.status(200).send(users)
}
// main work



module.exports ={
    addofferuser,
    getRegiseredUser,
    getRegiseredUserwithlimit
    
    
}