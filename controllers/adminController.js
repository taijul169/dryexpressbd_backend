const db = require('../models')
const randomstring = require("randomstring");

// create main Model
const Admin = db.admins

// main work

// 1. create admin

const addAdmin = async (req,res)=>{
    try {
        let info ={
            name:req.body.name,
            phone:req.body.phone,
            role:req.body.role,
            gender:req.body.gender,
            isactive:req.body.published ? req.body.published :true,
            dateofbirth:req.body.dateofbirth,
            address:req.body.address,
            password:req.body.password,
            jwtoken:randomstring.generate()
        }
    
        const admin = await Admin.create(info)
        res.status(200).send(admin)
    
        console.log(admin)
    } catch (error) {
        console.log("db error",error.errno)
    }
    
}


// 2 get all admins

const getAlladmins = async (req,res) =>{
    let admins =  await Admin.findAll({
     
    })
     res.status(200).send(admins)

    console.log(admins)
}



// 3 get single customer
const getOneAdmin = async (req,res) =>{

    let id = req.params.id
    let admin =  await Admin.findOne({
     where:{id:id}
    })
     res.status(200).send(admin)

    console.log(admin)
}


// 4 single customer update
const updateAdmin = async (req,res) =>{

    let id = req.params.id
    const admin = await Admin.update(req.body,{where:{id:id}})
     res.status(200).send(admin)
      console.log(admin)
}

// 5 delete customer by id
const deleteAdmin = async (req,res) =>{

    let id = req.params.id
   await Admin.destroy({where:{id:id}})
     res.status(200).send("admin is deleted")

}

// 6 get published customer 

const getActiveAdmin = async (req,res) =>{

   
   const admins =  await Admin.findAll({
       where:{published:true}
   })

   res.status(200).send(admins)

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
const adminauthenticate =  async (req,res) =>{
    const sicretKey =  req.params.jwtoken;
    const data =  await Admin.findOne({
        where:{jwtoken:sicretKey }
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

const adminlogin =  async (req,res) =>{
    const {phone, password} =  req.body;
    const data =  await Admin.findOne({
        where:{phone:phone, password:password }
    })
    if(data == null){
        res.status(404).send('data not found!!!!')
    }
    else{
        //console.log("data",data)
        res.status(200).send(data)
    }    

}

module.exports ={
    addAdmin,
    getAlladmins,
    getOneAdmin,
    updateAdmin,
    deleteAdmin,
    getActiveAdmin,
    adminauthenticate,
    adminlogin 
}