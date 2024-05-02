const db = require('../models')
const multer = require("multer");
const path = require('path');

//const { products } = require('../models');
// create main Model
const Order = db.orders
const Orderstatus = db.orderstatus  

const Cartitem =  db.cartitems
const Cartservice = db.cartservices


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
}).single('image_path')


// add to cart

const addToCart = async (req,res)=>{
   // let a = JSON.stringify(req.body)
    //console.log("req.body.price",JSON.stringify(req.body.servicename))
    console.log("req.body.price",req.body)
    console.log("req.body.price",req.body.service_id)
    try {

        // find already exist or not
        //  let condition = {
        //  }
        //  req.body.service_id.map((currElm,idx)=>{
        //   ( {
        //     ...condition,service_id:currElm 
        //    })
           
        //  })
         
        let info ={
            quantity:req.body.quantity,
            product_id:req.body.product_id,
            shop_id:req.body.shop_id,
            title:req.body.product_title,
            usertoken:req.body.clienttoken,
            profit_percent:req.body.profit_percent,
            isActiveDiscount:req.body.isActiveDiscount,
            discount_percent:req.body.discount_percent,
            wrapper_type:req.body.wrapper_type,
            combination_item:JSON.stringify(req.body.service_id.sort())
           // price:req.body.totalprice
        }
        const alreadyExist = await Cartitem.findOne({
            where:{
                combination_item:info.combination_item,usertoken:req.body.clienttoken,product_id:req.body.product_id
            }
        })
        console.log("already exist:",alreadyExist)
        if(alreadyExist){
            console.log("already exist!!!!!")
            res.status(403).send({code:403,msg:'item already exist!!'})
        }else{
            const cartitem =  await Cartitem.create(info)
            //console.log("cartitem",cartitem)
    
            req.body.price.map(async(currElm,idx)=>{
                if(req.file){
                    const cartservice =  await Cartservice.create({
                        servicename:req.body.servicename[idx],
                        service_id:req.body.service_id[idx],
                        product_id:req.body.product_id,
                        price:currElm,
                        image_path:req.file.path,
                        quantity:req.body.service_quantity,
                        comment:req.body.comment?req.body.comment:null,
                        cartitem_id:cartitem.id
                    })
                }else{
                    const cartservice =  await Cartservice.create({
                        servicename:req.body.servicename[idx],
                        service_id:req.body.service_id[idx],
                        product_id:req.body.product_id,
                        price:currElm,
                        quantity:req.body.service_quantity,
                        comment:req.body.comment?req.body.comment:null,
                        cartitem_id:cartitem.id
                    })
                }
         
            })
            res.status(201).send({cartitem,code:201,msg:'cart added success'})
        }
        

        
    } catch (error) {
        console.log("error",error)
        res.send({error})
    }
}
// main work

// 1. create Shop

// get single cart item by id
const getsingleCartItem = async(req,res)=>{
    try {
       const  cartitem = await Cartitem.findOne({
            where:{
                id:req.params.id
            },
            include:[{
                model:Cartservice,
                as:'cartservice',
                required:false,
            },]
        })
        let price = 0;
        cartitem.cartservice.map((item, idx)=>{
            price =  price + item.price
        })
        cartitem.price =  price
        res.status(200).send({cartitem})
    } catch (error) {
        res.send(error)
    }
}
// get cartitem
const getCartItem =  async (req,res)=>{
    try {
        let totalprice = 0;
        const cartitem =  await Cartitem.findAll({
            where:{
                usertoken:req.query.clienttoken,
            },
            include:[{
                model:Cartservice,
                as:'cartservice',
                required:false,
            },  
        ],
        order: [
            
            ['id', 'DESC'],
           
        ]
        
        })
        cartitem.map((item,idx)=>{

            item.cartservice.map((currElm,index)=>{

                currElm.image_path = `${req.protocol+"://"+req.headers.host}/${currElm.image_path}`
                
                item.price = item.price + (currElm.price * currElm.quantity)
               
                item.quantity = currElm.quantity

                return currElm
            })
            if(item.isActiveDiscount == true){
                item.price = Math.round(item.price - ((item.price * item.discount_percent)/100))
            }
            totalprice = totalprice + item.price
            return item
        })

        res.status(200).send({cartitem,totalprice})
    } catch (error) {
        
    }
}


const deleteCartItem =async(req,res)=>{
    try {
      const delelteResponse =  await Cartitem.destroy({
            where:{
                id:req.params.id
            }
        })
        const delelteResponseserviceType =  await Cartservice.destroy({
            where:{
                cartitem_id:req.params.id
            }
        })
        res.status(200).send({
            delelteResponse,delelteResponseserviceType,
            code:200,msg:'success'
        })
    } catch (error) {
        console.log("error",error)
    }
}

const updateCartQuantity  = async (req,res)=>{
   try {
    const update =   await Cartitem.update({
           quantity:req.body.quantity
       },{where:{
           id:req.body.id
       }})
       const updatecartservice =   await Cartservice.update({
        quantity:req.body.quantity
    },{where:{
        cartitem_id:req.body.id
    }})  
       
     res.status(200).send({
         code:200,
         msg:"Updated Succesffully",
         status:true
     })  
   } catch (error) {
       res.send(error)
       console.log("error",error)
   }
} 

// deleting cart item when order has been placed
const deleteCartItembytoken  = async(req,res)=>{
    try {
        const cartitemDatabytoken  =  await Cartitem.findAll({
            where:{
                usertoken:req.query.usertoken
            }
            
        })
        cartitemDatabytoken.map(async(item,idx)=>{
            const delelteResponse =  await Cartitem.destroy({
                where:{
                    id:item.id
                }
            })
            const delelteResponseserviceType =  await Cartservice.destroy({
                where:{
                    cartitem_id:item.id
                }
            })
        })

        res.status(200).send({msg:'success',code:200})
    } catch (error) {
        res.status(403).send({msg:'Failed',code:403,error})
    }
}


const addAccept = async (req,res)=>{
    try {
        const newcode =  Math.floor(100000 + Math.random() * 900000);
        let info ={
            pickupdate:req.body.pickupdate,
            pickuptime:req.body.pickuptime,
            deliveryboyid:req.body.deliveryboyid,
            order_id: req.body.order_id,
            currentstatus:req.body.status,
            reason:req.body.reason,
            estimatedtime:req.body.estimatedtime,
            securitycode:newcode,
        }
        const orderstatus = await Orderstatus.create(info)
        res.status(200).send({orderstatus,code:201,msg:'success'})
    } catch (error) {
        console.log(error)
        res.status(400).send({msg:'Bad Request!!' ,error})
    }
    
}


// get order status by order id
const getOrderStatus = async (req,res)=>{
    let orderstatus =  await Orderstatus.findOne({
        where:{order_id:req.params.order_id}
        })
        res.status(200).send(orderstatus)
}





//  get single order by order id





// order statusupdate
const orderStatusUpdate = async(req,res) =>{
    const order_id  =  req.params.order_id;
    const status  =  req.params.status;
    console.log("order id",order_id)
    if(status == 'ReadyToDelivered'){
        const newcode =  Math.floor(100000 + Math.random() * 900000);
        const orderstatus =  await Orderstatus.update({currentstatus:status,securitycodedelivered:newcode},{where:{order_id}})
        res.status(200).send({orderstatus,code:200,msg:'success'})
    }else{
        const orderstatus =  await Orderstatus.update({currentstatus:status},{where:{order_id}})
        res.status(200).send({orderstatus,code:200,msg:'success'})
    }
    //console.log(product)
}

// order statusupdate
const orderStatusUpdateforcancel = async(req,res) =>{
    const order_id  =  req.params.order_id;
    const status  =  req.params.status;
    const orderstatus =  await Orderstatus.update({currentstatus:status,reason:req.body.reason},{where:{order_id}})
    console.log("orders staus:",orderstatus)
    res.status(200).send({orderstatus,code:200,msg:'success'})
    //console.log(product)
}

module.exports ={
    addToCart,
    upload,
    getCartItem,
    deleteCartItem,
    deleteCartItembytoken,
    getsingleCartItem,
    updateCartQuantity
}