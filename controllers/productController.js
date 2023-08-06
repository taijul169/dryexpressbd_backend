
const db = require('../models')

// create main Model
const { Op } = require('sequelize');
const Product =db.products
const Review = db.reviews
const Productimage =  db.productimages
const Shop  = db.shops
const Discountuser =  db.discountusers
const Discount = db.discounts
const Servicename =db.servicenames
const Servicetype =db.servicetypes

// adding service name
const addservicename = async (req,res)=>{
    try {
        const servicename =  await Servicename.create({
            name:req.body.name
        })
        res.status(201).send({msg:success, code:201,servicename})
    } catch (error) {
        res.send(error)
    }
   

}
// getting all service names
const getallservicename = async (req,res)=>{
    const servicename =  await Servicename.findAll()
    res.status(200).send({servicename})
}

// main work
// latest add product module with multiple servie type
const addProductLatest = async (req,res)=>{
    console.log("req.bdy",req.body)
    try {
        let info ={
            shop_id:req.params.shopid,
            title:req.body.title,
            price:req.body.price[0],
            price_wash:req.body.price_wash ? req.body.price_wash: 0,
            price_drywash:req.body.price_drywash ? req.body.price_drywash: 0,
           // category:req.body.category,
            description:req.body.description,
            published:req.body.published ? req.body.published :false,
            amount:req.body.amount ? req.body.amount :1,
            category_class:req.body.category_class,
            product_image_id:req.body.product_image_id,
            isActiveDiscount:false,
            discount_percent:req.body.discount_percent ? req.body.discount_percent :null
        }
    
        //const ExistProduct =  await Servicetype.findOne({where:{name:info.title,shop_id:info.shop_id}})
        const ExistProduct =  await Product.findOne({where:{title:info.title,category_class:info.category_class,shop_id:info.shop_id}})
        if(ExistProduct){
            res.status(400).send({msg:'Product already exist!!'})
        }else{
            req.body.price = req.body.price.filter(item => item !== '')
            if(req.body.price.length>0){
                const product = await Product.create(info)

                req.body.price.map(async(currenElm,idx)=>{
                    console.log(currenElm)
                    if(currenElm){
                        const servicetype = await Servicetype.create({
                            shop_id:info.shop_id,
                            name:req.body.servicetype_name[idx],
                            service_id:req.body.service_id[idx],
                            price:currenElm,
                            product_id:product.id
                        })
                    }
                    
                   return currenElm 
                })
                res.status(201).send({product,msg:'success',code:201})
                console.log(product)
            }else{
                res.status(403).send({msg:'failed!! Please select service type',code:403})
            }
           
        }
    } catch (error) {
        console.log(error)
        res.send({error})
    }
   
    
}

// update product latest
const updateProductLatest = async (req,res) =>{
    try {
        let id = req.params.id
        if(req.body.discount_percent){
            req.body.discount_percent = req.body.discount_percent
        }
        if(req.body.isActiveDiscount){
            req.body.isActiveDiscount=true
        }else{
            req.body.isActiveDiscount=false
            req.body.discount_percent= 0
        }

        let {title,category_class,discount_percent,isActiveDiscount,description,service_id,price,servicetype_name,shop_id} = req.body
        
 
        price = price.filter(item => item !== '')
        console.log("req body",price)
        const product = await Product.update({title,category_class,discount_percent,isActiveDiscount,description},{where:{id:id}})
        if(price){
            console.log("yes im price in",price.length)
            if(price.length>0){
                // deleting first
                const deleteservice = await Servicetype.destroy({
                    where:{
                        product_id:id
                    }
                })
                console.log("deletedservice",deleteservice)
                // updating service types
                price.map(async(currenElm,idx)=>{
                    //console.log(currenElm)
                    if(currenElm){
                        const servicetype = await Servicetype.create({
                            shop_id:shop_id,
                            name:req.body.servicetype_name[idx],
                            service_id:req.body.service_id[idx],
                            price:currenElm,
                            product_id:id
                        })
                    }
                   return currenElm 
                })
             }
        }
        
        res.status(200).send({product,msg:'success',code:200})
    
    } catch (error) {
        res.status(400).send({error})
        console.log('error',error)
    }
   
}

// 3 get single product

const getOneProductByIdLatest = async (req,res) =>{

    let id = req.params.id
    let product =  await Product.findOne({
     where:{id:id},
     include:[{
        model:Productimage,
        as:'productimage'
    },
    {
        model:Servicetype,
        as:'servicetype',
        required:false
       },],

    })
    res.status(200).send(product)

}

const getSingleProductDetails =  async (req,res)=>{
    let id =  req.params.id;
    let product =  await Product.findOne({
        include:[{
            model:Productimage,
            as:'productimage'
            },
            {
                model:Servicetype,
                as:'servicetype',
                required:false
            },
            
        ],
        where:{id:id}
       })
       res.status(200).send(product)
}

//===================================================updated functions end=================================================================================











// 1. create product
const addProduct = async (req,res)=>{
    let info ={
        shop_id:req.params.shopid,
        title:req.body.title,
        price:req.body.price ? req.body.price:0,
        price_wash:req.body.price_wash ? req.body.price_wash: 0,
        price_drywash:req.body.price_drywash ? req.body.price_drywash: 0,
        category:req.body.category,
        description:req.body.description,
        published:req.body.published ? req.body.published :false,
        amount:req.body.amount ? req.body.amount :1,
        category_class:req.body.category_class,
        product_image_id:req.body.product_image_id,
        isActiveDiscount:false,
        discount_percent:req.body.discount_percent ? req.body.discount_percent :null
    }

    const ExistProduct =  await Product.findOne({where:{title:info.title,category_class:info.category_class,shop_id:info.shop_id}})
    console.log("already exist!!",ExistProduct)
    if(ExistProduct){
        res.status(400).send({msg:'Product already exist!!'})
    }else{
        const product = await Product.create(info)
        res.status(201).send({product,msg:'success',code:201})
        console.log(product)
    }
    
}


// 2 get all products

const getAllProducts = async (req,res) =>{
    let products =  await Product.findAll({
        include:[{
            model:Productimage,
            as:'productimage'
        },
        {
            model:Servicetype,
            as:'servicetype',
            required:false
           },],
    })
    products = products.map((item,index)=>{
        item.productimage.image = `${req.protocol+"://"+req.headers.host}/${item.productimage.image}`
        return item
    })
    res.status(200).send(products)
}

// 3 get all products by shop id

const getAllProductsByshopID = async (req,res) =>{
    try {
        let products =  await Product.findAll({
            include:[
                {
                model:Productimage,
                as:'productimage'
               },
               {
                model:Servicetype,
                as:'servicetype',
                required:false
               },
        ],
         where:{shop_id:req.params.shopid}
        })
        products = products.map((item,index)=>{
            item.productimage.image = `${req.protocol+"://"+req.headers.host}/${item.productimage.image}`
            return item
        })
         res.status(200).send(products)
    
        console.log(products)
    } catch (error) {
        console.log("error",error)
        res.status(200).send({error})
    }
  
}


// get all product by shopid and category
const getAllProductsByshopIDAndCategory = async (req,res) =>{
     
       // fetching data with pagination
       const getPagination = (page, size) => {
        const limit = size ? +size : 5;
        //const offset = page ? page * limit : 0;
        const offset = page * limit
        return { limit, offset };
    };

    const getPagingData = (data, page, limit) => {
        const { count: totalItems, rows: products } = data;
        const currentPage = page ? +page : 0;
        const totalPages = Math.ceil(totalItems / limit);
        return { totalItems, products, totalPages, currentPage };
    };

    const { page, size,shopid,category } = req.query;  
    var condition = {
        shop_id:shopid,
        category_class:category,
        profit_percent:{[Op.ne]: null},
        published:true
    };
   console.log("query:",req.query)
    const { limit, offset } = getPagination(page, size);

    Product.findAndCountAll({ 
        where: condition, limit, offset,
        include:[{
        model:Productimage,
        as:'productimage',
        required:false
        },
        {
            model:Servicetype,
            as:'servicetype',
            required:false
           },
        
    ],
    })
    .then(data => {
        const response = getPagingData(data, page, limit);
        response.products = response.products.map((item,index)=>{
        item.productimage.image = `${req.protocol+"://"+req.headers.host}/${item.productimage.image}`
        return item
    })
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

// 3 get single product

const getOneProduct = async (req,res) =>{

    let id = req.params.id
    let product =  await Product.findOne({
     where:{id:id}
    })
    res.status(200).send(product)

}



// 4 single product update

const updateProduct = async (req,res) =>{
    try {
        let id = req.params.id
        if(req.body.discount_percent){
            req.body.discount_percent = req.body.discount_percent
        }
        if(req.body.isActiveDiscount){
            req.body.isActiveDiscount=true
        }else{
            req.body.isActiveDiscount=false
            req.body.discount_percent= 0
        }
        console.log("req body",req.body)
        const product = await Product.update(req.body,{where:{id:id}})
        res.status(200).send({product,msg:'success',code:200})
        console.log(product)
    } catch (error) {
        res.status(400).send({error})
        console.log('error',error)
    }
   
}

// 5 delete product by id

const deleteProduct = async (req,res) =>{

    let id = req.params.id
   await Product.destroy({where:{id:id}})
     res.status(200).send("Product is deleted")

}

// 6 get published product 

const getPublishedProduct = async (req,res) =>{

   
   const products =  await Product.findAll({include:[{
    model:Productimage,
    as:'productimage'
    }],where:{published:true} })
    products = products.map((item,index)=>{
        item.productimage.image = `${req.protocol+"://"+req.headers.host}/${item.productimage.image}`
        return item
    })
    res.status(200).send(products)
    }

// product status update

const productStatusUpdate = async(req,res) =>{
    const product_id  =  req.params.id;
    const status  =  req.params.status;
    console.log("product and status:",product_id , status)
    
    let products =  await Product.update({published:status},{where:{id:product_id}})
    res.status(200).send({products,code:200,msg:'success'})
    //console.log(product)
}

// 7 get publishedProduct by shiop id
const getPublishedProductByshopID = async (req,res) =>{

   
    let products =  await Product.findAll({
        include:[{
            model:Productimage,
            as:'productimage'
            },
            {
                model:Servicetype,
                as:'servicetype',
                required:false
            },
            
        ],

        where:{published:true , shop_id:req.params.shopid,profit_percent:{[Op.ne]: null}}
    })
    let ShopData =  await Shop.findOne({where:{id:req.params.shopid},
        include:[
            {
                model:Discountuser,
                as:'discountuser',
                required: false,
                // where:{
                //     isactive:true,user_type:'shop'
                // },
               
                include:[{
                    model:Discount,
                    as:'discount',
                    required: false,
                    where:{
                        isactive:true,user_type:'shop'
                    },
                    // order:[['id','DESC']]
                  },
                ],
               

                // attributes: ['discount_percent','isactive','user_type']
            },

           
            
        ],
        order:[['discountuser','id','DESC']]
        
    })
    console.log("shopData:",ShopData)
    products = products.map((item,index)=>{
        item.productimage.image = `${req.protocol+"://"+req.headers.host}/${item.productimage.image}`
        return item
    })
    res.status(200).send({products,shopData:ShopData})
 
 }

 // get product by category
const getProductByCategory = async (req,res) =>{
    const products =  await Product.findAll({
        where:{published:true , category:req.params.category}
    })
 
    res.status(200).send(products)
 
 }


// 7. connect one to many relation Product and reviews
const getProuductReviews  =  async (req,res) =>{
    let id =  req.params.id
    const data = await Product.findAll({
       include:[{
           model:Review,
           as:'review'
       }],
       where: {id:id}
    })

    res.status(200).send(data)
}



// find prduct by keyword
const findProductByKeyword = async(req,res)=>{

    // fetching data with pagination
     const getPagination = (page, size) => {
         const limit = size ? +size : 5;
         //const offset = page ? page * limit : 0;
         const offset = page * limit
         return { limit, offset };
     };

     const getPagingData = (data, page, limit) => {
         const { count: totalItems, rows: products } = data;
         const currentPage = page ? +page : 0;
         const totalPages = Math.ceil(totalItems / limit);
         return { totalItems, products, totalPages, currentPage };
     };

     const { page, size, title,shopid } = req.query;  
     var condition = {
         title:{[Op.like]: '%' + title + '%'},
         published:true , shop_id:shopid,profit_percent:{[Op.ne]: null}
     };

     const { limit, offset } = getPagination(page, size);

     Product.findAndCountAll({ 
         where: condition, limit, offset,
         include:[{
            model:Productimage,
            as:'productimage'
            },
            {
                model:Servicetype,
                as:'servicetype',
                required:false
            },
            
        ],
     })
     .then(data => {
         const response = getPagingData(data, page, limit);
         response.products = response.products.map((item,index)=>{
            item.productimage.image = `${req.protocol+"://"+req.headers.host}/${item.productimage.image}`
            return item
        })
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

// 7 get publishedProduct by shiop id
const getPublishedProductByshopIDforMob = async (req,res) =>{
   
  // fetching data with pagination
    const getPagination = (page, size) => {
        const limit = size ? +size : 5;
        //const offset = page ? page * limit : 0;
        const offset = page * limit
        return { limit, offset };
    };

    const getPagingData = (data, page, limit) => {
        const { count: totalItems, rows: products } = data;
        const currentPage = page ? +page : 0;
        const totalPages = Math.ceil(totalItems / limit);
        return { totalItems, products, totalPages, currentPage };
    };

    const { page, size,shopid } = req.query;  
    var condition = {
        published:true , shop_id:shopid,profit_percent:{[Op.ne]: null}
    };

    const { limit, offset } = getPagination(page, size);

    Product.findAndCountAll({ 
        where: condition, limit, offset,
        include:[{
        model:Productimage,
        as:'productimage'
        },
        {
            model:Servicetype,
            as:'servicetype',
            required:false

        },
        
    ],
    })
    .then(data => {
        const response = getPagingData(data, page, limit);
        response.products = response.products.map((item,index)=>{
        item.productimage.image = `${req.protocol+"://"+req.headers.host}/${item.productimage.image}`
        return item
       })
        
      
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


module.exports ={
    addProduct,
    getAllProducts,
    getOneProduct,
    updateProduct,
    deleteProduct,
    getPublishedProduct,
    getProuductReviews,
    getAllProductsByshopID,
    getPublishedProductByshopID,
    productStatusUpdate,
    getProductByCategory,
    getAllProductsByshopIDAndCategory,
    findProductByKeyword,
    getPublishedProductByshopIDforMob,


    addservicename,
    getallservicename,
    addProductLatest,
    getSingleProductDetails,
    getOneProductByIdLatest,
    updateProductLatest
    
}