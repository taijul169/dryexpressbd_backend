const db = require('../models')
const randomstring = require("randomstring");
const multer = require("multer");
const path = require('path')
const sequelize =  require('sequelize');
const bcrypt = require('bcrypt');
//const { products } = require('../models');
// create main Model
const Courier = db.couriers;
const OrderStatus = db.orderstatus


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
}).single('photo')


// main work


const updateImageCourier = async (req,res)=>{
    if(req.file){
        let info ={
            photo:req.file.path,
        }
        console.log(info)
        const courier = await Courier.update(info,{where:{id:req.params.id}})
        res.status(200).send({courier,code:200,msg:'Success'})
    
    }
}
// 1. create Courier
const hassingPassword = async(password)=>{
    console.log("hashedPassword before",password)
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("hashedPassword after",hashedPassword)
    return hashedPassword;
}
const addCourier = async (req,res)=>{
    const courierdata = await Courier.findOne({where:{phone:req.body.phone}})
    console.log("courier data",courierdata)
    if(courierdata != null){
        res.status(403).send({code:403,msg:'Data already exist!!'})
    }else{
        if(req.file){
            let info ={
                name:req.body.name,
                phone:req.body.phone,
                shop_id:req.body.shop_id,
                address:req.body.address,
                password:await bcrypt.hash(req.body.password, 10),
                photo:req.file.path,
                city:req.body.city,
                area:req.body.area,
                nid:req.body.nid,
                isactive:req.body.published ? req.body.published :false,
                isverify:req.body.verify ? req.body.verify :false,
                jwtokenforcourier:randomstring.generate()
    
    
            }
            console.log(info)
            const courier = await Courier.create(info)
            res.status(200).send({courier,code:201,msg:'Success'})
        
            console.log(courier)
        }else{
            let info ={
                name:req.body.name,
                phone:req.body.phone,
                shop_id:req.body.shop_id,
                address:req.body.address,
                password:await bcrypt.hash(req.body.password, 10),
                photo:'',
                city:req.body.city,
                area:req.body.area,
                nid:req.body.nid,
                isactive:req.body.published ? req.body.published :false,
                isverify:req.body.verify ? req.body.verify :false,
                jwtokenforcourier:randomstring.generate()
            }
            console.log(info)
            const courier = await Courier.create(info)
            res.status(200).send({courier,code:201,msg:'Success'})
            console.log(courier)
        }
    }
   
    
  
}


// 2 get all Shops
const getAllCourier = async (req,res) =>{
    let data =  await Courier.findAll({ })
     res.status(200).send(data)

    console.log(data)
}

// 2 get all courier by shop id
const getAllCourierByshopID = async (req,res) =>{
    const shop_id = req.params.shop_id
    let data =  await Courier.findAll({ where:{shop_id} })
    data =  data.map((item,idx)=>{
        item.photo = `${req.protocol+"://"+req.headers.host}/${item.photo}`
        return item
     })
    res.status(200).send(data)

    console.log(data)
}

// 3 get pending Shop list
const getallPendingCouriers = async (req,res) =>{

    let id = req.params.id
    let courier=  await Courier.findAll({
     where:{isverify:false}
    })
    courier =  courier.map((item,idx)=>{
       item.photo = `${req.protocol+"://"+req.headers.host}/${item.photo}`
       return item
    })
    res.status(200).send(courier)

    console.log(courier)
}

// 3 get pending Courier list
const getallBlockedCouriers = async (req,res) =>{

    let id = req.params.id
    let courier=  await Courier.findAll({
     where:{isactive:true}
    })
     res.status(200).send(courier)

    console.log(courier)
}
// 3 get single Courier
const getOneCourier = async (req,res) =>{

    let id = req.params.id
    let courier=  await Courier.findOne({
     where:{id:id}
    })
    courier.photo = `${req.protocol+"://"+req.headers.host}/${courier.photo}`
    res.status(200).send(courier)
    console.log(courier)
}


//4 single Courier update
const updateCourier = async (req,res) =>{
    let id = req.params.id;
    if(req.file){
        const courier = await Courier.update(
            {
                name:req.body.name,
                phone:req.body.phone,
                shop_id:req.body.shop_id,
                address:req.body.address,
                city:req.body.city,
                area:req.body.area,
                nid:req.body.nid,
                photo:req.file.path,
                firebasetoken:req.body.firebasetoken,
            },{where:{id:id}})
            res.status(200).send({courier,code:200,msg:'Success'})
           console.log(courier)
    }
    else{
        const courier = await Courier.update({
            name:req.body.name,
            phone:req.body.phone,
            shop_id:req.body.shop_id,
            address:req.body.address,
            city:req.body.city,
            area:req.body.area,
            nid:req.body.nid,
            firebasetoken:req.body.firebasetoken,
        },{where:{id:id}})
        res.status(200).send({courier,code:200,msg:'Success'})    
    }
    
}








// 6 get published Courier 

const getActiveCourier = async (req,res) =>{
   const data =  await Courier.findAll({
       where:{isactive:true}
   })
   res.status(200).send(data)

}

// find Courier  by area and city

const getActiveCourierByarea = async (req,res) =>{
    console.log("para:",req.params.city,req.params.area)

    const data=  await Courier.findAll({
        where:{isverify:true, area:`${req.params.area}`, city:`${req.params.city}` }
    })
    res.status(200).send(data)
 
 }
 
//  get Courier's products

const getCouriersproducts = async (req,res) =>{
    let id = req.params.courierid;
    
    const data = await OrderStatus.findAll({where: { deliveryboyid:id },
        order:[['id','DESC']]
    })
    res.status(200).send(data)
}


const getCouriersproductsbyfilters = async (req,res) =>{
    let id = req.params.courierid;
    let status = req.params.status;
    
    const data = await OrderStatus.findAll({where: { deliveryboyid:id,currentstatus:status }
    })
    res.status(200).send(data)
}
// 7. connect one to many relation Product and reviews
// const getProuductReviews  =  async (req,res) =>{
//     let id =  req.params.id
//     const data = await Product.findAll({
//        include:[{
//            model:Review,
//            as:'review'
//        }],
//        where: {id:id}
//     })

//     res.status(200).send(data)
// }


// const Courierlogin =  async (req,res) =>{
//     const {phone, password} =  req.body;
//     const data =  await Courier.findOne({
//         where:{phone:phone, password:password }
//     })
//     if(data == null){
//         res.status(404).send({data:{},msg:'Invalid Credentials',code:404,status:false})
//     }
//     else{
//         //console.log("data",data)
//         res.status(200).send({data,code:200, msg:'Successfully Login',status:true})
//     }
    

// }

const Courierlogin =  async (req,res) =>{
    const {phone, password} =  req.body;
    const data =  await Courier.findOne({
        where:{phone:phone }
    })

    if(data == null){
        return res.status(404).send({data:{},msg:'Invalid Credentials',code:404,status:false})
         // Compare the provided password with the stored hashed password 
    }
    else{
        const passwordMatch = await bcrypt.compare(password, data.password);
        console.log("password match:",passwordMatch)
        if(passwordMatch){
           return res.status(200).send({data,code:200, msg:'Successfully Login',status:true})
           
        }else{
            return res.status(404).send({data:{},msg:'Invalid Credentials',code:404,status:false})
        }
        
    }
    

}
// Courier authenticate by cookie
const Courierauthenticate =  async (req,res) =>{
    const sicretKey =  req.params.jwtoken;
    data =  await Courier.findOne({
        where:{jwtokenforCourier:sicretKey }
    })
    if(data == null){
        res.status(404).send('permission denied!!!!')
    }
    else{
        
        data.photo = `${req.protocol+"://"+req.headers.host}/${data.photo}`
        console.log("data",data)
        res.status(200).send(data)
    }
 

}





// Courier status update
//4 single Courier update
const Courierstatusupdate = async (req,res) =>{
    let id = req.params.id;
    const courier = await Courier.update({isverify:req.params.status},{where:{id:id}})
        res.status(200).send(courier)
    
}
// Courier blocked unblocked
const Courierblockedunblocked = async (req,res) =>{
    let id = req.params.id;
    const courier = await Courier.update({isactive:req.params.status},{where:{id:id}})
        res.status(200).send(courier)
    
}


// courier photo update
//4 single shop image upload
const updateCourierphoto = async (req,res) =>{
    let id = req.params.id;
    if(req.file){
        console.log("req.file",req.file.path)
        const shop = await Courier.update(
            {
              
              photo:req.file.path
            },{where:{id:id}})
           res.status(200).send({shop,code:200,msg:'success'})
           
    }
} 


// forgot password
const forGotPassword = async(req,res)=>{
    try {

        if(req.body.phone && req.body.password){
            const courierData =  await Courier.findOne({
                where:{
                    phone:req.body.phone
                }
            })
    
            if(courierData){
                const update  = Courier.update({
                    password:await bcrypt.hash(req.body.password, 10),
                },{
                    where:{
                        phone:req.body.phone
                    }
                }
                )
                return res.status(200).send({
                    code:200,
                    msg:'Password recovered successfully.',
                    status:true
                })
            }else{
                return res.status(400).send({
                    code:400,
                    msg:'Failed to recover your password.',
                    status:false
                })
            }
        }else{
            return res.status(400).send({
                code:400,
                msg:'Filed can not be empty!!',
                status:false
            })
        }
     
    } catch (error) {
        console.log("error",error)
        return res.status(400).send({
            error
        })
       
    }
  
  
}


   //4 single shop image upload

module.exports ={
    addCourier,
    getAllCourier,
    getOneCourier,
    updateCourier,
    getActiveCourier,
    getActiveCourierByarea,
    getCouriersproducts,
    Courierlogin,
    Courierauthenticate,
    upload,
    Courierstatusupdate,
    getallPendingCouriers,
    getallBlockedCouriers,
    Courierblockedunblocked,
    getAllCourierByshopID,
    getCouriersproductsbyfilters,
    updateCourierphoto,
    updateImageCourier,
    forGotPassword
    
    
}