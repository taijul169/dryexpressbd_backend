const db = require('../models')
const randomstring = require("randomstring");
const multer = require("multer")
// create main Model
const Customer = db.customers
const path = require('path')
const bcrypt = require('bcrypt');
// main work
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

// 1. create customer

const addCustomer = async (req,res)=>{
    try {
        if(req.file){
            let info ={
                name:req.body.name,
                phone:req.body.phone,
                gender:req.body.gender,
                isactive:req.body.published ? req.body.published :true,
                dateofbirth:req.body.dateofbirth,
                address:req.body.address,
                password:await bcrypt.hash(req.body.password, 10),
                photo:req.file.path,
                jwtoken:randomstring.generate(),
                firebasetoken:req.body.firebasetoken ?req.body.firebasetoken:null
            }
            const FindCustomer =  await Customer.findOne({where:{phone:info.phone}})
            console.log("Findcustomer",FindCustomer)
            if(FindCustomer){
                res.status(400).send({msg:"Customer already exist!!"})
            }else{
                const customer = await Customer.create(info)
                res.status(200).send(customer)
                console.log(customer)
            }
        }else{
            let info ={
                name:req.body.name,
                phone:req.body.phone,
                gender:req.body.gender,
                isactive:req.body.published ? req.body.published :true,
                dateofbirth:req.body.dateofbirth,
                address:req.body.address,
                password:await bcrypt.hash(req.body.password, 10),
                jwtoken:randomstring.generate(),
                firebasetoken:req.body.firebasetoken ?req.body.firebasetoken:null
            }
            const FindCustomer =  await Customer.findOne({where:{phone:info.phone}})
            console.log("Findcustomer",FindCustomer)
            if(FindCustomer){
                res.status(400).send({customer:null,msg:"Customer already exist!!",code:400,status:false})
            }else{
                const customer = await Customer.create(info)
                res.status(201).send({customer,msg:'success',code:201,status:true})
                console.log(customer)
            }
        }
    } catch (error) {
        console.log("db error",error)
    }
    
}
const NumberExistOrNot = async(req,res) =>{
    const phone = req.params.phone
    let customer =  await Customer.findOne({
        where:{phone:phone}
       })
    if(customer){
        res.status(400).send({msg:'user already exist!!',code:400,status:false}) 
    }
    else{
        res.status(200).send({msg:'OK',code:200,status:true})
    }   
}

// 2 get all customers

const getAllCustomers = async (req,res) =>{
    let customers =  await Customer.findAll({})
    customers.map((item,inx)=>{
        item.photo = item.photo = `${req.protocol+"://"+req.headers.host}/${item.photo}`
        return item;                
    })
     res.status(200).send(customers)
     
    console.log(customers)
}

// 3 get single customer
const getOneCustomer = async (req,res) =>{
    let id = req.params.id
    let customer =  await Customer.findOne({
     where:{id:id}
    })
    if(customer){
        customer.photo = `${req.protocol+"://"+req.headers.host}/${customer.photo}`
        res.status(200).send(customer)
        console.log(customer)
    }else{
        res.status(404).send({msg:"User Not found with this ID!!!"})
    }

}


// 4 single customer update
const updateCustomer = async (req,res) =>{
    let id = req.params.id
    if(req.file){
        let info ={
            name:req.body.name,
            phone:req.body.phone,
            gender:req.body.gender,
            dateofbirth:req.body.dateofbirth,
            address:req.body.address,
            photo:req.file.path,
            firebasetoken:req.body.firebasetoken
        }
        const customer = await Customer.update(info,{where:{id:id}})
        res.status(200).send({code:200,msg:'Success',status:true})
        
    }else{
        let info ={
            name:req.body.name,
            phone:req.body.phone,
            gender:req.body.gender,
            dateofbirth:req.body.dateofbirth,
            address:req.body.address,
            firebasetoken:req.body.firebasetoken
           
        }
        const customer = await Customer.update(info,{where:{id:id}})
        res.status(200).send({code:200,msg:'Success',status:true})
        
    }
    
}


// 5 single customer status update
const updateCustomerstatus = async (req,res) =>{
    let id = req.params.id;
    const customer = await Customer.update({isactive: req.params.status},{where:{id:id}})
    res.status(200).send({customer,code:200,msg:'Success'})
   
}


// 5 delete customer by id
const deleteCustomer = async (req,res) =>{

    let id = req.params.id
   await Customer.destroy({where:{id:id}})
     res.status(200).send("Customer is deleted")

}

// 6 get published customer 

const getActiveCustomer = async (req,res) =>{

   
   const customers =  await Customer.findAll({
       where:{published:true}
   })

   res.status(200).send(customers)

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
// shop authenticate by cookie
const customerauthenticate =  async (req,res) =>{
    const sicretKey =  req.params.jwtoken;
    const data =  await Customer.findOne({
        where:{jwtoken:`${sicretKey}` }
    })
    console.log("customer authentication data:",data)
    if(data == null){
        res.status(404).send('permission denied!!!!')
    }
    else{
        
         data.photo = `${req.protocol+"://"+req.headers.host}/${data.photo}`
        res.status(200).send(data)
    }
    

}

const customerlogin =  async (req,res) =>{
    // const {phone, password} =  req.body;
    // const data =  await Customer.findOne({
    //     where:{phone:phone, password:password }
    // })
    // if(data == null){
    //     res.status(401).send({
    //         code:401,
    //         msg:'Invlaid Credentials',
    //         status:false,
    //         data:{}
    //     })
    // }
    // else{
    //     const jwtoken = randomstring.generate()
    //     const updatecustomer =  Customer.update({jwtoken:jwtoken},{
    //          where:{
    //              id:data.id
    //          }
    //      })
    //      data.jwtoken = jwtoken
    //     //console.log("data",data)
    //     res.status(200).send({
    //         code:200,
    //         msg:'Successfully Login',
    //         status:true,
    //         data:data
    //     })
    // }
    const {phone, password} =  req.body;
    const data =  await Customer.findOne({
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
            return res.status(401).send({data:{},msg:'Invalid Credentials',code:401,status:false})
        }
        
    }

}


// forgot password
const forGotPassword = async(req,res)=>{
    
    try {
        if(req.body.phone && req.body.password){
            const CustomerData =  await Customer.findOne({
                where:{
                    phone:req.body.phone
                }
            })
    
            if(CustomerData){
                const update  = Customer.update({
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
                    msg:'Not Registered yet!! Failed to recover your password.',
                    status:false
                })
            }
        }
        else{
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


module.exports ={
    addCustomer,
    getAllCustomers,
    getOneCustomer,
    updateCustomer,
    deleteCustomer,
    getActiveCustomer,
    customerauthenticate,
    customerlogin,
    updateCustomerstatus,
    NumberExistOrNot,
    upload,
    forGotPassword
   
    
}