const db = require('../models')
const randomstring = require("randomstring");
const multer = require("multer");
const path = require('path')
const bcrypt = require('bcrypt');

const sequelize =  require('sequelize')
const  con = db.Sequelize
const { Op } = require('sequelize');
const { QueryTypes } = require('sequelize');
//const { products } = require('../models');
// create main Model
const Shop = db.shops
const Product = db.products
const Review  =  db.reviews
const Discountuser =  db.discountusers
const Discount = db.discounts
const Account  = db.accounts
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

const uploadNID  =  multer({
    storage:storage,
    limits:{fileSize:'1000000'}
}).single('nidphoto')
const uploadTRADE  =  multer({
    storage:storage,
    limits:{fileSize:'1000000'}
}).single('tradephoto')
// main work

// 1. create Shop
const addShop = async (req,res)=>{
    if(req.file){
        let info ={
            name:req.body.name,
            phone:req.body.phone,
            address:req.body.address,
            password:await bcrypt.hash(req.body.password, 10),
            photo:req.file.path,
            city:req.body.city,
            area:req.body.area,
            shop_tin:req.body.shop_tin,
            tradelicense:req.body.tradelicense,
            ownernid:req.body.ownernid,
            ownername:req.body.ownername,
            lat:req.body.lat,
            long:req.body.long,
            isactive:req.body.published ? req.body.published :true,
            isverify:req.body.verify ? req.body.verify :false,
            ispackage:req.body.ispackage ? req.body.ispackage :false,
            jwtokenforshop:randomstring.generate()

        }
       console.log(info)
       const FindData = await Shop.findAll({where:{phone:info.phone}})
       if(FindData.length>0){
        res.status(400).send({msg:"User already exist!!",code:400})
       }else{
        const shop = await Shop.create(info)
        const account = await Account.create({shop_id:shop.id,duetolaundry:0,duefromlaundry:0})
        res.status(200).send({shop,account,code:201,msg:'success'})
        console.log(shop)
       }
       
    
       
    }else{
        let info ={
            name:req.body.name,
            phone:req.body.phone,
            address:req.body.address,
            password:await bcrypt.hash(req.body.password, 10),
            city:req.body.city,
            area:req.body.area,
            shop_tin:req.body.shop_tin,
            tradelicense:req.body.tradelicense,
            ownernid:req.body.ownernid,
            ownername:req.body.ownername,
            lat:req.body.lat,
            long:req.body.long,
            isactive:req.body.published ? req.body.published :true,
            isverify:req.body.verify ? req.body.verify :false,
            ispackage:req.body.ispackage ? req.body.ispackage :false,
            jwtokenforshop:randomstring.generate()
        }
        const FindData = await Shop.findAll({where:{phone:info.phone}})
        if(FindData.length>0){
         res.status(400).send({msg:"User already exist!!",code:400})
        }else{
            const shop = await Shop.create(info)
            const account = await Account.create({shop_id:shop.id,duetolaundry:0,duefromlaundry:0})
            res.status(200).send({shop,account,code:201,msg:'success'})
            console.log(shop)
        } 
       
    }
    
  
}



// getting all shop lists from admin panel
const getAllShopsAdmin = (req, res) => {
    Shop.findAndCountAll()
      .then(data => {
          
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving Shops."
        });
      });
};
// fetching data with pagination
const getPagination = (page, size) => {
    const limit = size ? +size : 5;
    const offset = page ? page * limit : 0;
    return { limit, offset };
};

const getPagingData = (data, page, limit) => {
    const { count: totalItems, rows: shops } = data;
    const currentPage = page ? +page : 0;
    const totalPages = Math.ceil(shops.length / limit);
    return { totalItems:shops.length, shops, totalPages, currentPage };
  };
  // Retrieve all shops from the database.
const getAllShops = (req, res) => {
    const { page, size, title } = req.query;
    var condition = title ? { title: { [Op.like]: `%${title}%` } } : null;
  
    const { limit, offset } = getPagination(page, size);
  
    Shop.findAndCountAll({ 
        where: condition, limit, offset,
        include:[{
                        model:Review,
                        as:'review',
                        attributes: ['description','rating'],
                        required:false,
                        // attributes: {
                        //     include: [
                        //       [sequelize.fn('AVG', sequelize.col('review.rating')), 'rating']
                        //     ],
                        //   },
                    },    
                    {
                        model:Discountuser,
                        as:'discountuser',
                        required: false,
                        order: [
                            ['id', 'DESC'],
                           
                        ],
                        where:{
                            isactive:true,user_type:'shop'
                        },
                       
                        include:[{
                            model:Discount,
                            as:'discount',
                            required: false,
                           
                          },
                        ],
                       

                        // attributes: ['discount_percent','isactive','user_type']
                    },],
     })
      .then(data => {
        const response = getPagingData(data, page, limit);
        // finding all featured shop and store in the featuredShop array
        response.shops = response.shops.sort((a, b) => b.isfeatured - a.isfeatured);
        res.send(response);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving Shops."
        });
      });
  };


    // get single shop by phone number and id
const getSingleShopByPhoneOrID = (req, res) => {
    
    let condition={

    }
    if(req.body.phone){
        condition.phone=req.body.phone
    }
    if(req.body.shop_id){
        condition.id =  req.body.shop_id
    }
    if(!req.body.shop_id && !req.body.phone){
        condition.shop_id =  '',
        condition.phone=''
    }
    Shop.findOne({ 
        where: condition,
        include:[{
                        model:Review,
                        as:'review',
                        attributes: ['description','rating'],
                        required:false,
                        // attributes: {
                        //     include: [
                        //       [sequelize.fn('AVG', sequelize.col('review.rating')), 'rating']
                        //     ],
                        //   },
                    },    {
                        model:Discountuser,
                        as:'discountuser',
                        required: false,
                        where:{
                            isactive:true,user_type:'shop'
                        },
                        include:[{
                            model:Discount,
                            as:'discount',
                            required: false
                        },
                        ],
                       

                        // attributes: ['discount_percent','isactive','user_type']
                    },],
     })
      .then(data => {
          if(data){
            data.photo = `${req.protocol+"://"+req.headers.host}/${data.photo}`
            res.send(data);
          }else{
            res.status(404).send({msg:"No Data Found"});
          }
        
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving Shops."
        });
      });
  };
// 2 get all Shops
// const getAllShops = async (req,res) =>{
//     let shops =  await Shop.findAll({
//         limit: 2,
//         offset: 3,
//         include:[{
//             model:Review,
//             as:'review',
             
//              attributes: ['description','rating']
//             // attributes: {
//             //     include: [
//             //       [sequelize.fn('AVG', sequelize.col('review.rating')), 'rating']
//             //     ],
//             //   },
//         }],
//     })

//       shops.forEach((item)=>{
//         let reviewData =   item.review.map((data)=>{
//             return data.rating;
//         })
//         const average = reviewData.reduce((a, b) => a + b, 0) / reviewData.length;
//         console.log("rating",average)
//         item.average =  average
//         console.log("item in each loop:",item)
        
//     })
//     res.status(200).send(shops)

//     //console.log(shops)
// }


// 3 get pending Shop list
const getallPendingshops = async (req,res) =>{

    let id = req.params.id
    let shop =  await Shop.findAll({
     where:{isverify:false}
    })
     res.status(200).send(shop)

    console.log(shop)
}

// 3 get blocked Shop list
const getallBlockedshops = async (req,res) =>{

    let id = req.params.id
    let shop =  await Shop.findAll({
     where:{isactive:false}
    })
    res.status(200).send(shop)
    console.log(shop)
}
// 3 get blocked Shop list
const getallVerifiedshops = async (req,res) =>{

    let id = req.params.id
    let shop =  await Shop.findAll({
     where:{isverify:true}
    })
    res.status(200).send(shop)
}
// 3 get single Shop
const getOneShop = async (req,res) =>{

    let id = req.params.id
    let shop =  await Shop.findOne({
     where:{id:id}
    })
    if(shop){
        shop.photo = `${req.protocol+"://"+req.headers.host}/${shop.photo}`
        shop.nidphoto = `${req.protocol+"://"+req.headers.host}/${shop.nidphoto}`
        shop.tradephoto = `${req.protocol+"://"+req.headers.host}/${shop.tradephoto}`
        res.status(200).send(shop)
    }
    
}


//4 single Shop update
const updateShop = async (req,res) =>{
    try {
        console.log('request from front end',req.file)
    let id = req.params.id;
   const alreadyExist = await Shop.findOne({where:{name:req.body.name,id:{ [Op.ne]: id }}})
   if(alreadyExist){     
    res.status(400).send({msg:"This name already exist!!"})
   }else{
    if(req.file){
        console.log("req.file",req.file)
        const shop = await Shop.update(
            {
                name:req.body.name,
                phone:req.body.phone,
                address:req.body.address,
                city:req.body.city,
                area:req.body.area,
                shop_tin:req.body.shop_tin,
                tradelicense:req.body.tradelicense,
                ownername:req.body.ownername,
                ownernid:req.body.ownernid,
                lat:req.body.lat,
                long:req.body.long,
                
                firebasetoken:req.body.firebasetoken,
                photo:req.file.path
            },{where:{id:id}})
           res.status(200).send({shop,code:200,msg:'success'})
           console.log(shop)
    }
    else{

        const shop = await Shop.update({
                name:req.body.name,
                phone:req.body.phone,
                address:req.body.address,
                city:req.body.city,
                area:req.body.area,
                shop_tin:req.body.shop_tin,
                tradelicense:req.body.tradelicense,
                ownername:req.body.ownername,
                ownernid:req.body.ownernid,
                lat:req.body.lat,
                long:req.body.long,
                firebasetoken:req.body.firebasetoken,
                
        },{where:{id:id}})
        res.status(200).send({shop,code:200,msg:'success'})
        
    }
   }
    } catch (error) {
        res.status(400).send({error,code:400,msg:'Failed'})
        console.log("error",error)
    }
   
   
    
}

const updateFirebasetoken =  async (req,res)=>{
    const id =  req.params.id
    const shop = await Shop.update(
        {
            firebasetoken:req.body.firebasetoken,
            
        },{where:{id:id}})
        res.status(200).send({shop,code:200,msg:'success'})

}
// update shop profit percent global
const updateprofitpercentglobal =  async (req,res)=>{
    const id =  req.params.id
    const shop = await Shop.update(
        {
            profitpercent:req.body.percent
            
        },{where:{id:id}})
        res.status(200).send({shop,code:200,msg:'success'})

}
// single shop update online/offline status
const updateShopStatusbyshop = async (req,res) =>{
    let id = req.params.id;
    let status = req.params.status;
    const shop = await Shop.update(
            {
                isonline:status
            },{where:{id:id}})
     console.log("shop status update:",shop)      
     res.status(200).send({shop,code:200,msg:'success'})
 
   } 
//4 single shop image upload
const updateShopImage = async (req,res) =>{
    let id = req.params.id;
   
    if(req.file){
        console.log("req.file",req.file)
        const shop = await Shop.update(
            {
                photo:req.file.path
            },{where:{id:id}})
            res.status(200).send({shop,code:200,msg:'success'})
           console.log(shop)
    }
   }
//4 single shop image upload
const updateShopnidphoto = async (req,res) =>{
    let id = req.params.id;
    if(req.file){
        console.log("req.file",req.file.path)
        const shop = await Shop.update(
            {
              nidphoto:req.file.path
            },{where:{id:id}})
            res.status(200).send({shop,code:200,msg:'success'})
           
    }
   } 

//4 single shop image upload
const updateShoptradephoto = async (req,res) =>{
    let id = req.params.id;
    if(req.file){
        console.log("req.file",req.file.path)
        const shop = await Shop.update(
            {
              tradephoto:req.file.path
            },{where:{id:id}})
           res.status(200).send({shop,code:200,msg:'success'})
           
    }
   } 
    

// 5 delete Shop by id
const deleteShop = async (req,res) =>{

    let id = req.params.id
   await Shop.destroy({where:{id:id}})
     res.status(200).send("Shop is deleted")

}

// 6 get published Shop 

// const getActiveShop = async (req,res) =>{
//    let shops =  await Shop.findAll({
//     include:[{
//         model:Review,
//         as:'review',
//         attributes: ['description','rating']
//         // attributes: {
//         //     include: [
//         //       [sequelize.fn('AVG', sequelize.col('review.rating')), 'rating']
//         //     ],
//         //   },
//     }],
//        where:{isactive:true}
//    })
   
       
  
// //    const reviewData =  shops.review.map((item,index)=>{
// //        return item.rating
// //    });
// //    console.log("reviewData:",reviewData)
// //    const average = reviewData => reviewData.reduce((a, b) => a + b) / reviewData.length;
// //    console.log(average(reviewData));
//     shops = shops.map((item,index)=>{
//     item.photo = `${req.protocol+"://"+req.headers.host}/${item.photo}`
//     return item
// })
// res.status(200).send(shops)

// }

// get published shop
const getActiveShop = async (req,res) =>{

    const getPaginationGetActiveShop = (page, size) => {
        const limit = size ? +size : 10;
        const offset = page ? page * limit : 0;
        return { limit, offset };
    };
    
    const getPagingDataGetActiveShop = (data, page, limit) => {
        const { count: totalItems, rows: shops } = data;
        const currentPage = page ? +page : 0;
        const totalPages = Math.ceil(totalItems / limit);
        return { totalItems, shops, totalPages, currentPage };
      };

    const { page, size, title } = req.query;

    // var condition = title ? { title: { [Op.like]: `%${title}%` } } : null;
    const { limit, offset } = getPaginationGetActiveShop(page, size);
    var condition = {
        isverify:true,
        isactive:true,
        isonline:true
    };
    Shop.findAndCountAll({ 
        
         where: condition, limit, offset,
        include:[{
                        model:Review,
                        as:'review',
                        attributes: ['description','rating'],
                        required:false
                    },    
                    {
                        model:Discountuser,
                        as:'discountuser',
                        required: false,
                        
                        include:[{
                            model:Discount,
                            as:'discount',
                            required: false, 
                            where:{
                                isactive:true,user_type:'shop'
                            },
                          },
                        ],
                        
                       

                        // attributes: ['discount_percent','isactive','user_type']
                    },
                ],
                order: [
                    ['discountuser','id', 'DESC'],
                   
                ],
                    distinct:true
     })
      .then(data => {
        const response = getPagingDataGetActiveShop(data, page, limit);
            response.shops = response.shops.map((item,index)=>{
                item.photo = `${req.protocol+"://"+req.headers.host}/${item.photo}`
                return item
            })
            console.log("response:")
        // finding all featured shop and store in the featuredShop array
        response.shops = response.shops.sort((a, b) => b.isfeatured - a.isfeatured);
        const a = parseInt(response.totalPages)
        const b = parseInt(page)+1
       
         if(a>b){
            //console.log("true")
            response.vieweditems = (response.currentPage+1)*size;  
        }else{
            response.vieweditems = response.totalItems
        }
        res.send(response);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving Shops."
        });
      });
}



// find shop  by area and city
const getActiveShopByarea = async (req,res) =>{
    try {
        console.log("para:",req.params.city,req.params.area)
         let shops =  await Shop.findAll({
             where:{isverify:true, area:`${req.params.area}`, city:`${req.params.city}`,isactive:true,isonline:true },
             include:[{
                 model:Review,
                 as:'review',
                // attributes: [[sequelize.fn('AVG', sequelize.cast(sequelize.col('rating'), 'integer')), 'avgAssetAmount']],
                 required:false
              },    
              {
                 model:Discountuser,
                 as:'discountuser',
                 
                 required: false,
                 
                 include:[{
                     model:Discount,
                     as:'discount',
                     required: false,
                     where:{
                        isactive:true,user_type:'shop'
                    },
                  },
                 ],
                
     
                 // attributes: ['discount_percent','isactive','user_type']
             },
            ],
            order:[['discountuser','id','DESC']]
         })
         shops = shops.map((item,index)=>{
             item.photo = `${req.protocol+"://"+req.headers.host}/${item.photo}`
             return item
         })
         shops = shops.sort((a, b) => b.isfeatured - a.isfeatured);
         res.status(200).send(shops)
    } catch (error) {
        console.log('error',error)
        res.status(403).send(error)
    }
   
 
 }
 



 const getPagingDataForShopByarea = (data, page, limit) => {
    const { count: totalItems, rows: shops } = data;
    const currentPage = page ? +page : 0;
    const totalPages = Math.ceil(shops.length / limit);
    return { totalItems:shops.length, shops, totalPages, currentPage };
  };
//  get shop list by area with pagination
const getActiveShopByareaUpdated = async (req,res) =>{
    const { page, size, area,city } = req.query;
    // var condition = title ? { title: { [Op.like]: `%${title}%` } } : null;
  
    const { limit, offset } = getPagination(page, size);
  
    Shop.findAndCountAll({ 
        limit, offset,
         
        include:[{
                        model:Review,
                        as:'review',
                        attributes: ['description','rating']
                        // attributes: [
                            
                        //       [sequelize.fn('AVG', sequelize.col('review.rating')), 'average_rating']
                            
                        //   ],
                    }],
                    where: {isactive:true,area:area, city:city,isonline:true,isverify:true},
                    order: [
                        ['isfeatured', 'DESC'],
                        ['id', 'ASC'],
                       
                    ],
                    
     })
      .then(data => {
        const response = getPagingData(data, page, limit);
        response.shops = response.shops.map((item,index)=>{
            item.photo = `${req.protocol+"://"+req.headers.host}/${item.photo}`
            return item
        })
        res.send(response);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving Shops."
        });
      });
} 
//  get shop's products

const getshopsproducts = async (req,res) =>{
    let id = req.params.shopid;
    
    const data = await Shop.findAll({
       include:[{
           model:Product,
           as:'product'
       } ] ,
       where: { id:id }
    })
    
    data = data.map((item,index)=>{
        item.productimage.image = `${req.protocol+"://"+req.headers.host}/${item.productimage.image}`
        return item
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


const shoplogin =  async (req,res) =>{
    // const {phone, password} =  req.body;
    // let data =  await Shop.findOne({
    //     where:{phone:phone, password:password }
    // })
    // //console.log("login data from server:",data.isactive)
    // if(data == null){
    //     res.status(403).send('Invalid Credentials!!!!')
    // }else{
    //     if(data.isactive === false){
    //         res.status(401).send('You are temporary blocked !!')
    //     }
    //     else{
    //           data.photo = `${req.protocol+"://"+req.headers.host}/${data.photo}`
    //         //console.log("data",data)
    //         res.status(200).send(data)
    //     }
    // }

    const {phone, password} =  req.body;
    const data =  await Shop.findOne({
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
            data.photo = `${req.protocol+"://"+req.headers.host}/${data.photo}`
           return res.status(200).send({data,code:200, msg:'Successfully Login',status:true})
           
        }else{
            return res.status(401).send({data:{},msg:'Invalid Credentials',code:401,status:false})
        }
        
    }
   
}

const NumberExistOrNot = async(req,res) =>{
    const phone = req.params.phone
    let shop =  await Shop.findOne({
        where:{phone:phone}
       })
    if(shop){
        res.status(400).send({msg:'user already exist!!'}) 
    }
    else{
        res.status(200).send({msg:'OK'})
    }   
}
// shop authenticate by cookie
const shopauthenticate =  async (req,res) =>{
    const sicretKey =  req.params.jwtoken;
    const data =  await Shop.findOne({
        where:{jwtokenforshop:sicretKey }
    })
    if(data == null){
        res.status(404).send('permission denied!!!!')
    }
    else{
        
        data.photo = `${req.protocol+"://"+req.headers.host}/${data.photo}`
        data.nidphoto = `${req.protocol+"://"+req.headers.host}/${data.nidphoto}`
        data.tradephoto = `${req.protocol+"://"+req.headers.host}/${data.tradephoto}`
        console.log("data",data)
        res.status(200).send(data)
    }
    

}


// shop status update
//4 single Shop update
const shopstatusupdate = async (req,res) =>{
    let id = req.params.id;
    const shop = await Shop.update({isverify:req.params.status},{where:{id:id}})
    res.status(200).send({shop,code:200,msg:'success'})
    
}
// shop blocked unblocked
const shopblockedunblocked = async (req,res) =>{
    let id = req.params.id;
    const shop = await Shop.update({isactive:req.params.status},{where:{id:id}})
    res.status(200).send({shop,code:200,msg:'success'})
    
}

// find shop  user location(lat,long)
const getActiveShopByUserLocation = async (req,res) =>{
    try {
        function distance(lat1, lon1, lat2, lon2, unit) {
            var radlat1 = Math.PI * lat1/180
            var radlat2 = Math.PI * lat2/180
            var theta = lon1-lon2
            var radtheta = Math.PI * theta/180
            var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
            // console.log("distance:",dist)
            if (dist > 1) {
                dist = 1;
            }
            dist = Math.acos(dist)
            dist = dist * 180/Math.PI
            dist = dist * 60 * 1.1515
            // console.log("distance round:",dist)
            if (unit=="K") { dist = dist * 1.609344 }
            if (unit=="N") { dist = dist * 0.8684 }
            return dist
            }
            // sample data
            var data = [
                {
                    "code": "0010",
                    "lat": "23.7955",
                    "lng": "90.3989",
                    "location": "Banani DOHS"
                },
                {
                    "code": "0011",
                    "lat": "23.7937",
                    "lng": "90.4041",
                    "location": "Ataturk Tower"
                },
                {
                    "code": "0012",
                    "lat": "23.7931",
                    "lng": "90.4030",
                    "location": "Super Market"
                },
                {
                    "code": "0012",
                    "lat": "23.7956486",
                    "lng": "90.3633851",
                    "location": "Mirpur 2"
                },
                {
                "code": "0001",
                "lat": "1.2821",
                "lng": "103.8172",
                "location": "Stop 1"
               },
               {
                "code": "0003",
                "lat": "1.2777380589964",
                "lng": "103.83749709165197",
                "location": "Stop 2"
              },
             {
                "code": "0002",
                "lat": "1.2783",
                "lng": "103.8376",
                "location": "Stop 3"
            }
             ];
            //  var poslat = 23.8103;
            //  var poslng = 90.4125;
    
             let shopList =  await Shop.findAll({where:{isverify:true,isonline:true,isactive:true},
                 
                 include:[{
                            model:Review,
                            as:'review',
                            required:false,
                            // attributes: ['rating',[sequelize.fn('AVG', sequelize.cast(sequelize.col('rating'), 'integer')), 'avgrating']]
                        },
                        {
                            model:Discountuser,
                            as:'discountuser',
                            required: false,
                            
                            include:[{
                                model:Discount,
                                as:'discount',
                                where:{
                                    isactive:true,user_type:'shop'
                                },
                                required: false,
                                
                            },
                            
                            ],
                           
                           
                            // attributes: ['discount_percent','isactive','user_type']
                        },
                    ],
                    order: [
                        ['discountuser','id', 'DESC'],
                       
                       ],
                })
                console.log("all shop list:",shopList)
                shopList = shopList.map(x => x.get({ plain: true }))
                // projects.forEach(
                //     (project) => {
                //       project.cat = "miaw";
                //     }
                //   );
                 shopList.map((item,index)=>{
                    item.photo = `${req.protocol+"://"+req.headers.host}/${item.photo}`
                    return item
                    
                })
            // console.log("shoplist",shopList)   
       
            let ShopData =[]
            // var poslat = 1.28210155945393;
            // var poslng = 103.81722480263163;
          
    
            for (var i = 0; i < shopList.length; i++) {
                // if this location is within 0.1KM of the user, add it to the list
                if (distance(req.params.lat,req.params.long, shopList[i].lat, shopList[i].long, "K") <= 5) {
                    shopList[i].distance =  distance(req.params.lat,req.params.long, shopList[i].lat, shopList[i].long, "K").toFixed(2)
                    ShopData.push(shopList[i])
                    console.log("shop list in for loop:",shopList[i])
                    //console.log("sdfsdfsdfdsf",data[i].location)
                   // html += '<p>' + data[i].location + ' - ' + data[i].code + '</p>';
                }
            }
        ShopData = ShopData.sort((a, b) => b.isfeatured - a.isfeatured);
        res.status(200).send(ShopData)
    } catch (error) {
        console.log("error",error)
        res.status(200).send(error)
    }

     
 
 }

  // fetching data with pagination
//   const getPaginationforReport = (page, size) => {
//     const limit = size ? +size : 5;
//     const offset = page ? page * limit : 0;
//     return { limit, offset };
//   };


// const getPagingDataforReport = (data, page, limit) => {
//     const { count: totalItems, rows: shops } = data;
//     const currentPage = page ? +page : 0;
//     const totalPages = Math.ceil(totalItems / limit);
//     return { totalItems, shops, totalPages, currentPage };
//   };
  // Retrieve all Tutorials from the database.
const getAllShopsforReport = async (req, res) => {
    console.log("req.body data",req.body)
    // const { page, size, title } = req.query;
    // var condition = title ? { title: { [Op.like]: `%${title}%` } } : null;
  
    // const { limit, offset } = getPaginationforReport(page, size);
    let city,area,fromDate, toDate
     city  =  req.body.city ? city :null
     area  =  req.body.area ? area :null
     fromDate  =  new Date(req.body.fromDate)
     toDate  =  new Date(req.body.toDate)
     let condition;
       
    if(req.body.city && req.body.area){
        condition =  {"createdAt" : {[Op.between] : [fromDate, toDate]},area:req.body.area,city:req.body.city};
    }
    if((req.body.fromDate ==='') || (req.body.toDate === '')){
        condition =  {area:req.body.area,city:req.body.city};
    }
    else{
        condition =  {"createdAt" : {[Op.between] : [fromDate, toDate]}};
    }
    await  Shop.findAll({where :condition })
            .then((result) =>{
                console.log("result:",result) 
                res.status(200).json(result)
            } )
            .catch((error) =>  res.status(404).json({errorInfo: error}))
  };
// make shop featured or not featured
const updateShopFeaturedStatusbyAdmin = async (req,res) =>{
    try {
        let id = req.params.id;
        let status = req.params.status;
        const shop = await Shop.update(
                {
                    isfeatured:status
                },{where:{id:id}})
                res.status(200).send({shop,code:200,msg:'success'}) 
    } catch (error) {   
        res.status(400).send(error)
    }
   
 
   } 
// get all shops by city and city for mobile
  // Retrieve all shops from the database.
  const getAllShopsByCityAreaForMob = (req, res) => {

    const getPagination = (page, size) => {
        const limit = size ? +size : 5;
        const offset = page ? page * limit : 0;
        return { limit, offset };
    };
    
    const getPagingData = (data, page, limit) => {
        const { count: totalItems, rows: shops } = data;
        const currentPage = page ? +page : 0;
        const totalPages = Math.ceil(totalItems / limit);
        return { totalItems, shops, totalPages, currentPage };
      };
    const { page, size,city,area } = req.query;
    var condition = {
        city:city,
        area:area,
        isonline:true,
        isverify:true,
        isactive:true
    };
  
    const { limit, offset } = getPagination(page, size);
  
    Shop.findAndCountAll({ 
        where: condition, limit, offset,
        include:[{
                        model:Review,
                        as:'review',
                        attributes: ['description','rating'],
                        required:false,
                        // attributes: {
                        //     include: [
                        //       [sequelize.fn('AVG', sequelize.col('review.rating')), 'rating']
                        //     ],
                        //   },
                    },    {
                        model:Discountuser,
                        as:'discountuser',
                        required: false,
                        where:{
                            isactive:true,user_type:'shop'
                        },
                        include:[{
                            model:Discount,
                            as:'discount',
                            required: false
                         },
                        ],
                       

                        // attributes: ['discount_percent','isactive','user_type']
                    },],
                    distinct: true
     })
      .then(data => {
        const response = getPagingData(data, page, limit);
        response.shops.map((item,index)=>{
            item.photo = `${req.protocol+"://"+req.headers.host}/${item.photo}`
            return item
            
        })
        // finding all featured shop and store in the featuredShop array
        response.shops = response.shops.sort((a, b) => b.isfeatured - a.isfeatured);

        const a = parseInt(response.totalPages)
        const b = parseInt(page)+1
       
         if(a>b){
            //console.log("true")
            response.vieweditems = (response.currentPage+1)*size;  
        }else{
            response.vieweditems = response.totalItems
        }
        res.send(response);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving Shops."
        });
      });
  };   
// find shop  user location(lat,long)
const getActiveShopByUserLocationForMob = async (req,res) =>{
    try {

        function distance(lat1, lon1, lat2, lon2, unit) {
            var radlat1 = Math.PI * lat1/180
            var radlat2 = Math.PI * lat2/180
            var theta = lon1-lon2
            var radtheta = Math.PI * theta/180
            var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
            // console.log("distance:",dist)
            if (dist > 1) {
                dist = 1;
            }
            dist = Math.acos(dist)
            dist = dist * 180/Math.PI
            dist = dist * 60 * 1.1515
            // console.log("distance round:",dist)
            if (unit=="K") { dist = dist * 1.609344 }
            if (unit=="N") { dist = dist * 0.8684 }
            return dist
            }
            

        const getPagination = (page, size) => {
            const limit = size ? +size : 50;
            const offset = page ? page * limit : 0;
            return { limit, offset };
        };
        
        const getPagingData = (data, page, limit) => {
            const { count: totalItems, rows: shops } = data;
            const currentPage = page ? +page : 0;
            const totalPages = Math.ceil(totalItems / limit);
            return { totalItems, shops, totalPages, currentPage };
          };
        const { page, size,lat,lng } = req.query;
        var condition = {
            isverify:true,
            isactive:true,
            isonline:true
        };
      
        const { limit, offset } = getPagination(page, size);
      
        Shop.findAndCountAll({ 
            where: condition, limit, offset,
            include:[{
                            model:Review,
                            as:'review',
                            attributes: ['description','rating'],
                            required:false,
                            // attributes: {
                            //     include: [
                            //       [sequelize.fn('AVG', sequelize.col('review.rating')), 'rating']
                            //     ],
                            //   },
                        },    {
                            model:Discountuser,
                            as:'discountuser',
                            required: false,
                            
                            include:[{
                                model:Discount,
                                as:'discount',
                                required: false,
                                where:{
                                    isactive:true,user_type:'shop'
                                },
                            },
                            ],
                           
    
                            // attributes: ['discount_percent','isactive','user_type']
                        },],
                        distinct: true
         })
          .then(data => {
              let shopList=[];
            const response = getPagingData(data, page, limit);
            
            // finding all featured shop and store in the featuredShop array
            response.shops = response.shops.sort((a, b) => b.isfeatured - a.isfeatured);
      
         shopList = response.shops
        
         shopList = shopList.map(x => x.get({ plain: true }))
            // projects.forEach(
            //     (project) => {
            //       project.cat = "miaw";
            //     }
            //   );
         shopList.map((item,index)=>{
                item.photo = `${req.protocol+"://"+req.headers.host}/${item.photo}`
                return item
                
            })
            console.log("response:",shopList)   
        // console.log("shoplist",shopList)   
   
        let ShopData =[]
        // var poslat = 1.28210155945393;
        // var poslng = 103.81722480263163;
      

        for (var i = 0; i < shopList.length; i++) {
            // if this location is within 0.1KM of the user, add it to the list
            if (distance(lat,lng, shopList[i].lat, shopList[i].long, "K") <= 5) {
                shopList[i].distance =  distance(lat,lng, shopList[i].lat, shopList[i].long, "K").toFixed(2)
                ShopData.push(shopList[i])
                console.log("shop list in for loop:",shopList[i])
                //console.log("sdfsdfsdfdsf",data[i].location)
               // html += '<p>' + data[i].location + ' - ' + data[i].code + '</p>';
            }
        }
           ShopData = ShopData.sort((a, b) => b.isfeatured - a.isfeatured);
            // res.status(200).send(ShopData)
            response.shops = ShopData
            const a = parseInt(response.totalPages)
            const b = parseInt(page)+1
           
             if(a>b){
                //console.log("true")
                response.vieweditems = (response.currentPage+1)*size;  
            }else{
                response.vieweditems = response.totalItems
            }
            res.send(response);
          })
          .catch(err => {
              console.log("error:",err)
            res.status(500).send({
              message:
                err.message || "Some error occurred while retrieving Shops."
            });
          });
              

            
    } catch (error) {

        console.log("error",error)
        res.status(200).send(error)
    }

     
 
 }

// get featured data
 const getActiveFeaturedData = async (req,res) =>{
    try {
       
         let shops =  await Shop.findAll({
             where:{isverify:true,isfeatured:true,isactive:true,isonline:true },
             include:[{
                 model:Review,
                 as:'review',
                // attributes: [[sequelize.fn('AVG', sequelize.cast(sequelize.col('rating'), 'integer')), 'avgAssetAmount']],
                 required:false
              },    
              {
                 model:Discountuser,
                 as:'discountuser',
                 required: false,
                 
                 include:[{
                     model:Discount,
                     as:'discount',
                     where:{
                        isactive:true,user_type:'shop'
                    },
                     required: false
                  },
                 ],
                
     
                 // attributes: ['discount_percent','isactive','user_type']
             },
            ],
         })
         shops = shops.map((item,index)=>{
             item.photo = `${req.protocol+"://"+req.headers.host}/${item.photo}`
             return item
         })
         shops = shops.sort((a, b) => b.isfeatured - a.isfeatured);
         res.status(200).send(shops)
    } catch (error) {
        console.log('error',error)
        res.status(400).send(error)
    }
   
 
 }
 
 // forgot password
const forGotPassword = async(req,res)=>{
    
    try {
        if(req.body.phone && req.body.password){
            const ShopData =  await Shop.findOne({
                where:{
                    phone:req.body.phone
                }
            })
    
            if(ShopData){
                const update  = Shop.update({
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
    addShop,
    getAllShops,
    getOneShop,
    updateShop,
    deleteShop,
    getActiveShop,
    getActiveShopByarea,
    getshopsproducts,
    shoplogin,
    shopauthenticate,
    upload,
    shopstatusupdate,
    getallPendingshops,
    getallBlockedshops,
    shopblockedunblocked,
    NumberExistOrNot,
    getActiveShopByareaUpdated,
    getAllShopsAdmin,
    getActiveShopByUserLocation,
    getallVerifiedshops,
    getAllShopsforReport,
    updateShopImage,
    updateShopnidphoto,
    uploadNID,
    updateShoptradephoto,
    uploadTRADE,
    updateShopStatusbyshop,
    updateShopFeaturedStatusbyAdmin,
    getSingleShopByPhoneOrID,
    getAllShopsByCityAreaForMob,
    getActiveShopByUserLocationForMob,
    getActiveFeaturedData,
    updateFirebasetoken,
    updateprofitpercentglobal,
    forGotPassword
      
}