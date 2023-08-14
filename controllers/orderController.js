const db = require('../models')
const { Op } = require('sequelize');
const Sequelize =  require('sequelize')
//const { products } = require('../models');
// create main Model
const OrderTable = db.orders
const OrderedProduct = db.orderedproduct
const Shop = db.shops
const OrderStatus = db.orderstatus
const Notification = db.notifications
const Product = db.products
const Customer =  db.customers
const Discount = db.discounts
const Review = db.reviews

const Orderedservices = db.orderedservices

// main work

// 1. create Shop
const findProfit = (data)=>{
    let totalProfit = 0;
    data.map((item,idx)=>{
       return  totalProfit = totalProfit + ((item.price* item.amount * item.profit_percent)/100)
    })
    return totalProfit
}

const findProfitlatest = (data)=>{
    let totalProfit = 0;
    data.map((item,idx)=>{
       return  totalProfit = totalProfit + ((item.price * item.profit_percent)/100)
    })
    return totalProfit
}

// const findingGlobalProfit =  async(shopid,total)=>{
//     const shopdata =  await Shop.findOne({where:{id:shopid}})
//     let profit = total -((total * shopdata.profitpercent)/100) 
//     return profit
// }
const addOrder = async (req,res)=>{
try {
let info ={
    firstname:req.body.firstname,
    lastname:req.body.lastname,
    phone:req.body.phone,
    address:req.body.address,
    area:req.body.area,
    city:req.body.city,
    isactive:req.body.isactive ? req.body.isactive:true,
    isdelivered:req.body.isdelivered ? req.body.isdelivered :false,
    paymentstatus:req.body.paymentstatus ? req.body.paymentstatus :false,
    paymentmethod:req.body.paymentmethod,
    deliverycharge:req.body.deliverycharge,
    total:req.body.total,
    user_id:req.params.userid,
    shop_id:req.body.shopid,
    currentstatus:req.body.currentstatus ? req.body.currentstatus: 'Pending',
    profitamount:findProfit(req.body.cartdata),
    discount_id:req.body.discount_id ? req.body.discount_id: null,
    contributed_profit_admin:req.body.contributed_profit_admin ? req.body.contributed_profit_admin: 0,
   // profitpercent:addOrder(req.body.shopid,req.body.total)
}
const shopdata =  await Shop.findOne({where:{id:req.body.shopid}})
console.log("profit amount:",(req.body.total-((req.body.total *shopdata.profitpercent)/100)))
info.profitamountglobal =((req.body.total*shopdata.profitpercent)/100)



// contributed profit calculation
if(info.discount_id){
  const DiscountData =  await Discount.findOne({where:{id:info.discount_id}})
  
  if(DiscountData.iscontributed === true){
    info.contributed_profit_admin = (info.profitamount - ((info.profitamount * DiscountData.contribution_percent/100)))
    info.contributed_percent = DiscountData.contribution_percent
  }
  
}
let TempData = [];

for(var x =0;x<req.body.cartdata.length;x++){
    const a = await Product.findOne({where:{id:req.body.cartdata[x].id}})
    a.amount = req.body.cartdata[x].amount
    if(a.isActiveDiscount){
        a.price = a.price -((a.discount_percent*a.price)/100)
    }
    TempData.push(a)
}
console.log("TempData:",TempData)
const order = await OrderTable.create(info)
for(let i =0;i<req.body.cartdata.length;i++){
    let info_ordered ={
        order_id:order.id,
        product_id:TempData[i].id,
        title:TempData[i].title,
        category:TempData[i].category,
        amount:TempData[i].amount,
        price:TempData[i].price,  
        profit_percent:TempData[i].profit_percent,  
    }

    const ordered = await OrderedProduct.create(info_ordered)
    //console.log("ordered in server:",ordered)
}





//res.status(200).send(order)


//console.log(ordered)

// add notification
const noti =  await Notification.create({
    order_id:order.id,
    heading:'New Order created',
    body:'New order created successfully.Please have a keen eye to the order status update',
    user_type:'shop',
    user_id:order.user_id,
    shop_id:order.shop_id,
    noti_type:'order',
    order_status:'Pending'

})
res.status(201).send({order,noti,code:201})
} catch (error) {
 console.log(error)
 res.status(400).send(error)
}


// console.log(order)
}


// orderedprouct list

// const addOrderedItem = async (req,res,orderid)=>{
//     console.log("orderid:",orderid)
    
// }


// LATEST ADD ORDER FUNCTION
const addOrderlatest = async (req,res)=>{
    try {
    let info ={
        firstname:req.body.firstname,
        lastname:req.body.lastname,
        phone:req.body.phone,
        address:req.body.address,
        area:req.body.area,
        city:req.body.city,
        isactive:req.body.isactive ? req.body.isactive:true,
        isdelivered:req.body.isdelivered ? req.body.isdelivered :false,
        paymentstatus:req.body.paymentstatus ? req.body.paymentstatus :false,
        paymentmethod:req.body.paymentmethod,
        deliverycharge:req.body.deliverycharge,
        total:req.body.total,
        user_id:req.params.userid,
        shop_id:req.body.shopid,
        currentstatus:req.body.currentstatus ? req.body.currentstatus: 'Pending',
        profitamount:findProfitlatest(req.body.cartdata),
        discount_id:req.body.discount_id ? req.body.discount_id: null,
        contributed_profit_admin:req.body.contributed_profit_admin ? req.body.contributed_profit_admin: 0,
        //profitpercent:addOrder(req.body.shopid,req.body.total)
    }
    const shopdata =  await Shop.findOne({where:{id:req.body.shopid}})
    console.log("profit amount:",(req.body.total-((req.body.total *shopdata.profitpercent)/100)))
    info.profitamountglobal =((req.body.total*shopdata.profitpercent)/100)
    
    
    
    // contributed profit calculation
    if(info.discount_id){
      const DiscountData =  await Discount.findOne({where:{id:info.discount_id}})
      
      if(DiscountData.iscontributed === true){
        info.contributed_profit_admin = (info.profitamount - ((info.profitamount * DiscountData.contribution_percent/100)))
        info.contributed_percent = DiscountData.contribution_percent
      }
      
    }
    //let TempData = [];
    
    // for(var x =0;x<req.body.cartdata.length;x++){
    //     const a = await Product.findOne({where:{id:req.body.cartdata[x].product_id}})
    //     a.amount = req.body.cartdata[x].quantity
    //     if(a.isActiveDiscount){
    //         a.price = a.price -((a.discount_percent*a.price)/100)
    //     }
    //     TempData.push(a)
    // }
    
    const order = await OrderTable.create(info)
    for(let i =0;i<req.body.cartdata.length;i++){
        let info_ordered ={
            order_id:order.id,
            product_id:req.body.cartdata[i].product_id,
            title:req.body.cartdata[i].title,
            //category:req.body.cartdata[i].category,
            amount:req.body.cartdata[i].quantity,
            price:req.body.cartdata[i].price,  
            profit_percent:req.body.cartdata[i].profit_percent,  
        }
    
        const ordered = await OrderedProduct.create(info_ordered)

        req.body.cartdata[i].cartservice.map(async(curElm,idx)=>{
         const orderedservices = await Orderedservices.create({
                ordereditem_id:ordered.id,
                servicename:curElm.servicename,
                quantity:curElm.quantity,
                price:curElm.price,
                comment:curElm.comment,
                image_path:curElm.image_path,
                product_id:curElm.product_id,
                service_id:curElm.service_id,
            })
        })
        //console.log("ordered in server:",ordered)
    }
    
    
    
    // latest add order controll
    
    
    //res.status(200).send(order)
    
    
    //console.log(ordered)
    
    // add notification
    const noti =  await Notification.create({
        order_id:order.id,
        heading:'New Order created',
        body:'New order created successfully.Please have a keen eye to the order status update',
        user_type:'shop',
        user_id:order.user_id,
        shop_id:order.shop_id,
        noti_type:'order',
        order_status:'Pending'
    
    })
    res.status(201).send({order,noti,code:201})
    } catch (error) {
     console.log(error)
     res.status(400).send(error)
    }
    
    
    // console.log(order)
    }












// 2 get all orders
const getAllOrders = async (req,res) =>{
    let orders =  await OrderTable.findAll({
        order: [
            
            ['id', 'DESC'],
           
        ]
     
    })
    res.status(200).send(orders)
    orders = orders.map((item,inx)=>{
        item.createTime = item.createdAt
        return item;
    })
    console.log(orders)
}


// getAllOrdersByshopId
const getAllOrdersByshopId = async (req,res) =>{
    console.log("shop id",req.params.shopid)
    let orders =  await OrderTable.findAll({
        order: [
            ['id', 'DESC'],
        ],
     where:{shop_id:req.params.shopid},
     
    })
     res.status(200).send(orders)
     console.log(orders)
}

// getAllOrdersByshopId and status(pending, delivered, cancelled)
const getAllOrdersByStatusshopId = async (req,res) =>{
    //console.log("shop id",req.params.shopid)
    let orders =  await OrderTable.findAll({
     where:{shop_id:req.params.shopid,currentstatus:req.params.status},
     order: [
        ['id', 'ASC'],
       
    ],
    })
    res.status(200).send(orders)

    console.log(orders)
}

// for mobile dashboard
const getLengthforalltypesOrders =  async (req,res)=>{
    Product
    let allProducts=0;
    let PendingOrder=0;
    let CancelledOrder=0;
    let ReceivedOrder=0;
    let PickedupOrder=0;
    let DeliveredOrder=0;
    let allorders;
    let orderbyshopid =  await OrderTable.findAll({
        where:{shop_id:req.params.shopid}
       })
    let getproducts =  await Product.findAll({
        where:{shop_id:req.params.shopid}
       })
   allorders = orderbyshopid.length    
    orderbyshopid.map((item,idx)=>{
        if(item.currentstatus === 'Pending'){
            PendingOrder++
        }
        if(item.currentstatus === 'Cancelled'){
            CancelledOrder++
        }
        if(item.currentstatus === 'Received'){
            ReceivedOrder++
        }
        if(item.currentstatus === 'Pickedup'){
            PickedupOrder++
        }
        if(item.currentstatus === 'Delivered'){
            DeliveredOrder++
        }
    }) 
    
    res.status(200).send({
        PendingOrder,CancelledOrder,ReceivedOrder,PickedupOrder,DeliveredOrder,allorders,allProducts:getproducts.length
    })

}


// 3 get single order
const getOneOrder = async (req,res) =>{
    

    let id = req.params.id
    let order =  await OrderTable.findOne({
     where:{id:id}
    })
    if(order){
        console.log(order)
        res.status(200).send(order)
    }else{
        res.status(404).send({msg:"Data not found!!"})
    }
    
}





// 6 get published Shop 

const getActiveOrder = async (req,res) =>{

   const orders =  await OrderTable.findAll({
       where:{isactive:true},
       order: [
        ['id', 'DESC'],
       
    ],
   })
   res.status(200).send(orders)

}
const getDeliveredOrder = async (req,res) =>{

    const orders =  await OrderTable.findAll({
        where:{isdelivered:true},
        order: [
            ['id', 'DESC'],
           
        ],
    })
    res.status(200).send(orders)
 
 }

 
//  get shop's products

const getOrdersbyuserid = async (req,res) =>{
    let id = req.params.userid;
    let data = await OrderTable.findAll({
       where: { user_id:id },
       order: [
        ['id', 'DESC'],
       
      ],
    })
  
    res.status(200).send(data)
}
// get all shops by customer id
// get all shops by customer id
const getShoplistbyuserid =  async (req,res)=>{
    try {
        let id = req.params.userid;
        let data = await OrderTable.findAll({
            attributes:['id'],
            where: { user_id:id },
            order: [
             ['id', 'DESC'],
            
           ],
           include:[{
                model:Shop,
                as:'shop',
                attributes:['id','name','area','city',[Sequelize.fn('count',Sequelize.col('shop.id')),'count']],
                
                
           }],
           group:['order.shop_id']
         })
       
          const arrayUniqueByKey = [...new Map(data.map(item =>
            [item.shop['id'], item])).values()
        ];
          res.status(200).send(arrayUniqueByKey)
    } catch (error) {
        console.log(error)
    }
 
}

//  get shop's products

const getOrdersbyuseridAndShopid = async (req,res) =>{
    let id = req.params.userid;
    let data = await OrderTable.findAll({
       where: { user_id:id,shop_id:req.params.shop_id },
       order: [
        ['id', 'DESC'],
       
      ],
    })
  
    res.status(200).send(data)
}
// single customer order history with customer info
const getallorderbycustomeridandshopid = async (req,res) =>{
    try {
        let id = req.params.userid;
        let data = await Customer.findOne({
           where: { id:id },
           include:[
            {
                model:OrderTable,
                as:'order',
                where:{user_id:id,shop_id:req.params.shop_id},
                attributes:['id','createdAt','currentstatus'],
                required:false,
               
            },
            {
                model:Review,
                as:'review',
                where:{user_id:id,shop_id:req.params.shop_id},
                required:false,
            },
          ],
          
        })
        data.photo = `${req.protocol+"://"+req.headers.host}/${data.photo}`
        res.status(200).send(data)
    } catch (error) {
        res.status(404).send({msg:'Not found'})
    }
 
}

//  get customers by shop id from order table 

const getallCustomersByShopID = async (req,res) =>{
    try {
        let id = req.params.userid;
        let data = await OrderTable.findAll({
           where: { shop_id:req.params.shop_id },
          
           attributes:['user_id'],
           include:[
            {
                model:Customer,
                as:'customer',
                
            
            },
            
        ],
        })
        const key = 'user_id';

        const arrayUniqueByKey = [...new Map(data.map(item =>
          [item[key], item])).values()];
        
        //console.log(arrayUniqueByKey);
        arrayUniqueByKey.map((item,idx)=>{
              item.customer.photo  = `${req.protocol+"://"+req.headers.host}/${item.customer.photo}`
        })
        res.status(200).send(arrayUniqueByKey)
    } catch (error) {
        console.log("error",error)
    }

}

//  get single order by order id
const getsingleOrderbyorderid = async (req,res) =>{
    try {
        let id = req.params.order_id;
        let data = await OrderTable.findAll({
           include:[{
               model:OrderedProduct,
               as:'orderedproduct',
               include:[{
                model:Orderedservices,
                as:'orderedservice'
               }]
           },
           {
               model:Shop,
               as:'shop'
           },
           {
               model:OrderStatus,
               as:'orderstatus',
               required:false
           },
           {
            model:Discount,
            as:'discount',
           }
        ] ,
      
           where: { id:id },
          
        })
        if(data){
            console.log(data)
            data[0].createdAt = new Date(data[0].createdAt).toLocaleDateString();
            data[0].shop.photo = `${req.protocol+"://"+req.headers.host}/${data[0].shop.photo}`
             let discountedTotal=0;
             if(data[0].discount){
                discountedTotal = data[0].discount.discount_percent
             }
             if(data[0].orderstatus){
                data[0].orderstatus.pickeduptimewithdate?
                data[0].orderstatus.pickeduptimewithdate =[
                   new Date(data[0].orderstatus.pickeduptimewithdate) .toLocaleDateString(),
                   new Date(data[0].orderstatus.pickeduptimewithdate) .toLocaleTimeString()
               ]
               :null 
               data[0].orderstatus.deliveredtimewithdate?
               data[0].orderstatus.deliveredtimewithdate =[
                   new Date(data[0].orderstatus.deliveredtimewithdate) .toLocaleDateString(),
                   new Date(data[0].orderstatus.deliveredtimewithdate) .toLocaleTimeString()
               ]
               :null
               data[0].orderstatus.readytodeliveredtime?
               data[0].orderstatus.readytodeliveredtime=[
                   new Date(data[0].orderstatus.readytodeliveredtime) .toLocaleDateString(),
                   new Date(data[0].orderstatus.readytodeliveredtime) .toLocaleTimeString()
               ]
               :null
               data[0].orderstatus.receivedtime?
               data[0].orderstatus.receivedtime =[
                   new Date(data[0].orderstatus.receivedtime) .toLocaleDateString(),
                   new Date(data[0].orderstatus.receivedtime) .toLocaleTimeString()
               ]
                :null
             }
            data[0].pendingTimewithDate =[new Date(data[0].createdAt) .toLocaleDateString(),new Date(data[0].createdAt) .toLocaleTimeString()] 
            res.status(200).send(data)
    
        }else{
            res.status(404).send({msg:"Data not found!!"})
        }
    } catch (error) {
        console.log("errors:",error)
        res.status(404).send({err:error})  
    }
   
    
    // res.status(200).send(data)
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

// order statusupdate
const orderStatusUpdate = async(req,res) =>{
    const order_id  =  req.params.orderid;
    const status  =  req.params.status;
    const time= String(new Date());
    const notiData = await Notification.findOne({where:{
        order_id:order_id
    }})
    if(status == 'Received'){
        const order =  await OrderTable.update({currentstatus:status},{where:{id:order_id}})
        const orderstatus =  await OrderStatus.update({currentstatus:status,receivedtime:time},{where:{order_id:order_id}})
        const noti =  await Notification.create({
            order_id:order_id,
            heading:'Order status updated',
            body:'Your order has been updated to Received',
            user_type:'customer',
            user_id:notiData.user_id,
            shop_id:notiData.shop_id,
            noti_type:'order',
            order_status:'Received'
        
        })
        res.status(200).send({order,msg:'success',code:200})
    }
    if(status == 'Canceled'){
        const order =  await OrderTable.update({currentstatus:status,},{where:{id:order_id}})
        const orderstatus =  await OrderStatus.update({currentstatus:status,receivedtime:time},{where:{order_id:order_id}})
        const noti =  await Notification.create({
            order_id:order_id,
            heading:'Order status updated',
            body:'Your order has been updated to Cancelled',
            user_type:'customer',
            user_id:notiData.user_id,
            shop_id:notiData.shop_id,
            noti_type:'order',
            order_status:'Cancelled'
        
        })
        res.status(200).send({order,msg:'success',code:200})
    }
    if(status == 'Pickedup'){
        const order =  await OrderTable.update({currentstatus:status},{where:{id:order_id}})
        const orderstatus =  await OrderStatus.update({currentstatus:status,pickeduptimewithdate:time},{where:{order_id:order_id}})
        const noti =  await Notification.create({
            order_id:order_id,
            heading:'Order status updated',
            body:'Your order has been updated to Pickedup',
            user_type:'customer',
            user_id:notiData.user_id,
            shop_id:notiData.shop_id,
            noti_type:'order',
            order_status:'Pickedup'
            
        
        })
        res.status(200).send({order,msg:'success',code:200})
    }
    if(status == 'ReadyToDelivered'){
        const order =  await OrderTable.update({currentstatus:status},{where:{id:order_id}})
        const orderstatus =  await OrderStatus.update({currentstatus:status,readytodeliveredtime:time},{where:{order_id:order_id}})
        const noti =  await Notification.create({
            order_id:order_id,
            heading:'Order status updated',
            body:'Your  order has been updated to ReadyToDelivered',
            user_type:'customer',
            user_id:notiData.user_id,
            shop_id:notiData.shop_id,
            noti_type:'order',
            order_status:'ReadyToDelivered'
        
        })
        res.status(200).send({order,msg:'success',code:200})
    }
    if(status == 'Delivered'){
        const order =  await OrderTable.update({currentstatus:status,paymentstatus:true},{where:{id:order_id}})
        const orderstatus =  await OrderStatus.update({currentstatus:status,deliveredtimewithdate:time},{where:{order_id:order_id}})
        const noti =  await Notification.create({
            order_id:order_id,
            heading:'Order status updated',
            body:'Your order has been updated to Delivered',
            user_type:'customer',
            user_id:notiData.user_id,
            shop_id:notiData.shop_id,
            noti_type:'order',
            order_status:'Delivered'
        
        })
        res.status(200).send({order,msg:'success',code:200})
    }
    //console.log(product)
}

const updatePaymentStatus =  async(req,res) =>{
    try {
        const order_id = req.params.orderid
        const status = req.params.status
        const paymentmethod = req.params.method
        if(status == 'success' && paymentmethod == 'Online'){
            const order =  await OrderTable.update({paymentstatus:true,ispaidtodryexpress:true,paymentmethod:'Online'},{where:{id:order_id}})
           
            res.status(200).send({order,code:200,msg:'success'})
        }
        
        if(status == 'failed'){
            const order =  await OrderTable.update({paymentstatus:false},{where:{id:order_id}})
            res.status(400).send({order,code:400,msg:'failed'})
        }
        // else{
        //     const order =  await OrderTable.update({paymentstatus:true,ispaidtolaundry:true,paymentmethod:'cash-on-delivery'},{where:{id:order_id}})
        //     res.status(200).send({order,code:200,msg:'success'})
        // }
    } catch (error) {
        console.log("error",error)
        //res.status(400).send({code:400,msg:'Failed'})
    }  
}
// getAllOrdersBystatus(pending, delivered, cancelled)
const getAllOrdersByStatus = async (req,res) =>{
    //console.log("shop id",req.params.shopid)
    let orders =  await OrderTable.findAll({
     where:{currentstatus:req.params.status},
     order: [
        ['id', 'DESC'],
       
      ],
    })
     res.status(200).send(orders)

    console.log(orders)
}

// ------------------------------get order list by status and shop id for mobile with pagination--------------------------------------

  // fetching data with pagination
const getPagination = (page, size) => {
    const limit = size ? +size : 5;
    const offset = page ? page * limit : 0;
    return { limit, offset };
  };


const getPagingData = (data, page, limit) => {
    const { count: totalItems, rows: orders } = data;
    const currentPage = page ? +page : 0;
    const totalPages = Math.ceil(totalItems / limit);
    return { totalItems, orders, totalPages, currentPage };
  };
  // Retrieve all Tutorials from the database.
const getAllOrdersBystatusnshopidinmobile = (req, res) => {
    const { page, size, title, status, shop_id } = req.query;
    console.log("req query:",req.query)
    var condition = title ? { title: { [Op.like]: `%${title}%` } } : null;
  
    const { limit, offset } = getPagination(page, size);
   if(status ==='All'){
    OrderTable.findAndCountAll({where: {shop_id:shop_id},limit, offset, order: [
        ['id', 'ASC'],
       
    ],})
      .then(data => {
        const response = getPagingData(data, page, limit);
        res.send(response);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving Shops."
        });
      });
   }else{
    OrderTable.findAndCountAll({ 
        where: {currentstatus:status,shop_id:shop_id}, limit, offset,
        order: [
            ['id', 'ASC'],
           
        ],
     })
      .then(data => {
        const response = getPagingData(data, page, limit);
        res.send(response);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving Shops."
        });
      });
   }
  
  };

  const getAllOrdersforReport = async (req, res) => {
    console.log("req.body data",req.body)
  
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
    await  OrderTable.findAll({where :condition ,order: [
        ['id', 'ASC'],
       
    ],})
            .then((result) =>{
                console.log("result:",result) 
                res.status(200).json(result)
            } )
            .catch((error) =>  res.status(404).json({errorInfo: error}))
  };
//  ----------------------------------------------orderlist by payment method------------------------------------
// getAllOrdersBystatus(pending, delivered, cancelled)
const getAllOrdersByPaymentMethod = async (req,res) =>{
   // console.log("req.body data",req.body)
    console.log("city",req.body.city)
   
    // let  city  =  req.body.city ? city :null
    // let area  =  req.body.area ? area :null
    let fromDate  =  new Date(req.body.fromDate)
    let toDate  =  new Date(req.body.toDate)
    let condition = {

    };
     
    if(req.body.paymentmethod){
        condition.paymentmethod=req.body.paymentmethod;
    }
    if(req.body.currentstatus){
        condition.currentstatus=req.body.currentstatus;
    }
    if(req.body.city){
        condition.city=req.body.city;
    }
    if(req.body.area){
        condition.area=req.body.area;
    }
    if(req.body.fromDate && req.body.toDate){
        condition.createdAt = {[Op.between] : [fromDate, toDate]}
    }
    await  OrderTable.findAll({where :condition ,order: [
        ['id', 'ASC'],
       
    ],})
            .then((result) =>{
                // console.log("result:",result) 
                res.status(200).json(result)
            } )
            .catch((error) =>  res.status(404).json({errorInfo: error}))

    console.log("condition:",condition)
    // if(req.body.city && req.body.area){
    //     condition =  {area:req.body.area,city:req.body.city};
    // }
    // if((req.body.fromDate) || (req.body.toDate)){

    //     condition =  {"createdAt" : {[Op.between] : [fromDate, toDate]}};
    // }
    // if(req.body.paymentmethod){
    //   console.log("dhukche")
    // }else{
    //     console.log("dhukeni")
    //     condition =  {"createdAt" : {[Op.between] : [fromDate, toDate]}};
    // }

    // await  OrderTable.findAll({where :condition })
    //         .then((result) =>{
    //             // console.log("result:",result) 
    //             res.status(200).json(result)
    //         } )
    //         .catch((error) =>  res.status(404).json({errorInfo: error}))
}

// find best seller by area and date in admin panel
const getBestSeller = async (req,res)=>{
    try {
         // let  city  =  req.body.city ? city :null
        // let area  =  req.body.area ? area :null
        let fromDate  =  new Date(req.body.fromDate)
        let toDate  =  new Date(req.body.toDate)
        let limit  = parseInt(req.body.limit) 
        let condition = {

        };
        
        if(req.body.paymentmethod){
            condition.paymentmethod=req.body.paymentmethod;
        }
        if(req.body.currentstatus){
            condition.currentstatus=req.body.currentstatus;
        }
        if(req.body.city){
            condition.city=req.body.city;
        }
        if(req.body.area){
            condition.area=req.body.area;
        }
        if(req.body.fromDate && req.body.toDate){
            condition.createdAt = {[Op.between] : [fromDate, toDate]}
        }

        let bestShops =  await OrderTable.findAll({
            attributes:['shop_id',[Sequelize.fn('count',Sequelize.col('shop_id')),'count'],[Sequelize.fn('sum', Sequelize.col('profitamount')), 'total_profit']],
            include:[
                {
                    model:Shop,
                    as:'shop',
                    attributes:['id','name','phone','area','city']
                
                }
            ],
            group:['order.shop_id'],
            order:Sequelize.literal('count DESC'),
            where:condition,
            limit:limit
        })
        console.log('bestshop:',bestShops)
        res.status(200).send(bestShops)
    } catch (error) {
        console.log("best seller error",error)
    }
    
}

// get all orders by date and shop id for shop report
const getAllOrdersforReportShop = async (req, res) => {
    let fromDate  =  new Date(req.body.fromDate)
    let toDate  =  new Date(req.body.toDate)
    let condition = {
        shop_id:req.body.shop_id,
    };
    
    if(req.body.paymentmethod){
        condition.paymentmethod=req.body.paymentmethod;
    }
    if(req.body.currentstatus){
        condition.currentstatus=req.body.currentstatus;
    }
    if(req.body.fromDate && req.body.toDate){
        condition.createdAt = {[Op.between] : [fromDate, toDate]}
    }

    await  OrderTable.findAll({where :condition ,order: [ ['id', 'DESC']]})
            .then((result) =>{
               console.log("result before:",result.length)
               result.map((item,idx)=>{
                
                    item.profitamount = (item.total - item.profitamount)
                    return item
                })
                console.log("result after:",result)
                res.status(200).json(result)
            })
            .catch((error) =>  res.status(404).json({errorInfo: error}))
  };

  // find best customer 
const getBestCustomerByshop = async (req,res)=>{
    console.log("req.body",req.body)
       let order =  req.body.by_order
       let limit =  +(req.body.limit)
    try {
        let fromDate  =  new Date(req.body.fromDate)
        let toDate  =  new Date(req.body.toDate)
        if(!limit || !order || !req.body.shop_id){
          res.send({msg:"Required Field!"})
        }
        let condition = {
            shop_id:req.body.shop_id,
        };
        
        if(req.body.paymentmethod){
            condition.paymentmethod=req.body.paymentmethod;
        }
        if(req.body.currentstatus){
            condition.currentstatus=req.body.currentstatus;
        }
        if(req.body.fromDate && req.body.toDate){
            condition.createdAt = {[Op.between] : [fromDate, toDate]}
        }

        let bestShops =  await OrderTable.findAll({
            attributes:['user_id',[Sequelize.fn('count',Sequelize.col('user_id')),'count'],[Sequelize.fn('sum', Sequelize.col('total')), "total_amount"]],
            include:[
                {
                    model:Customer,
                    as:'customer',
                    attributes:['id','name','phone','address']
                }
            ],
            group:['order.user_id'],
            order:Sequelize.literal(`${order} DESC`),
            where:condition,
            limit:limit
        })
        console.log('bestshop:',bestShops)
        res.status(200).send(bestShops)
    } catch (error) {
        console.log("best customer error",error)
    }
    
}

// get all order by discount id
const getAllOrdersByDiscountId = async (req,res) =>{
    //console.log("shop id",req.params.shopid)
    let orders =  await OrderTable.findAll({
     where:{discount_id:req.params.discount_id},
     order: [
        ['id', 'ASC'],
       
    ],
    })
    res.status(200).send(orders)

    console.log(orders)
}
// get all order by discount id
const getAllOrdersByDiscountIdandshopid = async (req,res) =>{
    //console.log("shop id",req.params.shopid)
    let orders =  await OrderTable.findAll({
     where:{discount_id:req.params.discount_id,shop_id:req.params.shop_id},
     order: [
        ['id', 'ASC'],
       
    ],
    })
    res.status(200).send(orders)

    console.log(orders)
}
// verify courier by customer
const verifycourierbycustomer = async(req,res)=>{
    const d = String(new Date());
    try {
        const singleorder = await  OrderStatus.findOne({where:{order_id:req.params.order_id}})
        const code =  req.params.code;
        const newcode =  Math.floor(100000 + Math.random() * 900000);
        const notiData = await Notification.findOne({where:{
            order_id:req.params.order_id
        }})
        if(singleorder){
            if(req.params.status == 'Delivered'){
                if(singleorder.securitycodedelivered == code){
               
                    const a =   await OrderStatus.update({
                           ispickedupconfirmedbycustomer:true,
                           pickeduptimewithdate:d,
                           currentstatus:req.params.status,
                       },        
                       {where: {order_id:req.params.order_id}})


                       const b =   await OrderTable.update({
                           currentstatus:req.params.status
                       },
                                
                       {where: {id:req.params.order_id}})
                       if(singleorder.paymentmethod == 'cash-on-delivery' && singleorder.paymentstatus == false){
                        const c =  OrderTable.update({
                            paymentmethod:'cash-on-delivery',
                            paymentstatus:true,
                            ispaidtolaundry:true
                          },{where: {id:req.params.order_id}}) 
                       }
                       console.log("a",a)

                       const noti =  await Notification.create({
                        order_id:req.params.order_id,
                        heading:'Order status updated',
                        body:`Your order has been updated to ${req.params.status} `,
                        user_type:'customer',
                        user_id:notiData.user_id,
                        shop_id:notiData.shop_id,
                        noti_type:'order',
                        order_status:`${req.params.status}`
                    
                    })
                       res.status(200).send({msg:'success!! Delivered confirmed!',code:200})
                   }else{
                       res.status(400).send({msg:'failed!! Code dose not match!',code:400})
                   }
            }else{
                if(singleorder.securitycode == code){
               
                    const a =   await OrderStatus.update({
                           ispickedupconfirmedbycustomer:true,
                           pickeduptimewithdate:d,
                           currentstatus:req.params.status,
                           
                       },
                                
                       {where: {order_id:req.params.order_id}})
                       const b =   await OrderTable.update({
       
                           currentstatus:req.params.status
                       },
                                
                       {where: {id:req.params.order_id}})
                       
                       const noti =  await Notification.create({
                        order_id:req.params.order_id,
                        heading:'Order status updated',
                        body:`Your order has been updated to ${req.params.status} `,
                        user_type:'customer',
                        user_id:notiData.user_id,
                        shop_id:notiData.shop_id,
                        noti_type:'order',
                        order_status:`${req.params.status}`
                    
                    })
                       res.status(200).send({msg:'success!! courier has been verified!',code:200})
                   }else{
                       res.status(400).send({msg:'failed!! courier has  not been verified!',code:400})
                   }
            }
           
        }else{
            res.status(404).send({msg:'Order not found!!',code:404})
        }
        
    } catch (error) {
        console.log("error",error)
        res.status(403).send({msg:error})
    }
  
   
}


// get todays order
const getToadysOrderForAdmin = async(req,res)=>{
 

    const TODAY_START = new Date().setHours(0, 0, 0, 0);
    const NOW = new Date();

    const orders = await OrderTable.findAll({where:{
        createdAt:{ 
            [Op.gt]: TODAY_START,
            [Op.lt]: NOW
          },

       // createdAt:'2023-04-09 04:34:39'
    }
    ,
    attributes:[[Sequelize.fn('count',Sequelize.col('id')),'count']],
})
    const total  = await OrderTable.findAll({
        attributes:[[Sequelize.fn('sum', Sequelize.col('total')), 'total_sale']],
    })
    const totalShop =  await Shop.findAll({
        attributes:[[Sequelize.fn('count',Sequelize.col('id')),'count']],
    })

    const totalDuetoLaundry =  await OrderTable.findAll({
        where:{
            paymentmethod:'Online',
            ispaidtolaundry:false,
            paymentstatus:true,
            ispaidtodryexpress:true
        }
       ,
        attributes:['id',[Sequelize.fn('count',Sequelize.col('id')),'count'],[Sequelize.fn('sum', Sequelize.col('profitamount')), 'total_profit'],[Sequelize.fn('sum', Sequelize.col('total')), 'total']],
    })

    const totalDueFromLaundry =  await OrderTable.findAll({
        where:{
            paymentmethod:'cash-on-delivery',
            ispaidtolaundry:true,
            paymentstatus:true,
            ispaidtodryexpress:false
        }
       ,
        attributes:['id',[Sequelize.fn('count',Sequelize.col('id')),'count'],[Sequelize.fn('sum', Sequelize.col('profitamount')), 'total_profit'],[Sequelize.fn('sum', Sequelize.col('total')), 'total']],
    })
    console.log("length:",totalDuetoLaundry.length)

    res.status(200).send({orders,total,totalShop,totalDuetoLaundry,totalDueFromLaundry})
   
}

// see total due and payment to laundry from admin
const duetoLaundryDetails = async (req,res)=>{
    try {
      
        let condition = {
            paymentstatus:true,
            //ispaidtolaundry:false,
            paymentmethod:'Online',
            ispaidtodryexpress:true,
        };
        let unpaidData =  await OrderTable.findAll({
            attributes:[[Sequelize.fn('count',Sequelize.col('shop_id')),'count'],[Sequelize.fn('sum', Sequelize.col('profitamount')), 'total_profit'],[Sequelize.fn('sum', Sequelize.col('total')), 'total']],
            include:[
                {
                    model:Shop,
                    as:'shop',
                    attributes:['id','name','phone','area','city']
                
                }
            ],
            group:['order.shop_id'],
            order:Sequelize.literal('count DESC'),
            where:condition,
        })



        // where ispaidtolaundry:true
        let paidtoLaundryData =  await OrderTable.findAll({
            attributes:[[Sequelize.fn('count',Sequelize.col('shop_id')),'count'],[Sequelize.fn('sum', Sequelize.col('profitamount')), 'total_profit'],[Sequelize.fn('sum', Sequelize.col('total')), 'total']],
            include:[
                {
                    model:Shop,
                    as:'shop',
                    attributes:['id','name','phone','area','city']
                
                }
            ],
            group:['order.shop_id'],
            order:Sequelize.literal('count DESC'),
            where:{
                paymentstatus:true,
                ispaidtolaundry:true,
                paymentmethod:'cash-on-delivery',
                ispaidtodryexpress:false,

            },
        })
        res.status(200).send({unpaidData,paidtoLaundryData})
    } catch (error) {
        res.status(400).send(error)
        console.log("best seller error",error)
    }
    
}
// order list for today --admin
const getTodaysOrderlist =  async (req,res)=>{

    const TODAY_START = new Date().setHours(0, 0, 0, 0);
    const NOW = new Date();

    const orders = await OrderTable.findAll({where:{
        createdAt:{ 
            [Op.gt]: TODAY_START,
            [Op.lt]: NOW
          },

       // createdAt:'2023-04-09 04:34:39'
    }
    ,
})
res.status(200).send(orders)
}




// get todyas order list for laundry panel
const getTodaysOrderlistLaundry =  async (req,res)=>{

    const TODAY_START = new Date().setHours(0, 0, 0, 0);
    const NOW = new Date();

    const orders = await OrderTable.findAll({where:{
        createdAt:{ 
            [Op.gt]: TODAY_START,
            [Op.lt]: NOW
          },
          shop_id:req.params.shop_id

       // createdAt:'2023-04-09 04:34:39'
    }
    ,
  })
  res.status(200).send(orders)
}




// get todays order for laundry with details
const getToadysOrderForLaundry = async(req,res)=>{
 

    const TODAY_START = new Date().setHours(0, 0, 0, 0);
    const NOW = new Date();

    const orders = await OrderTable.findAll({where:{
        createdAt:{ 
            [Op.gt]: TODAY_START,
            [Op.lt]: NOW
          },
          shop_id:req.params.shop_id

       // createdAt:'2023-04-09 04:34:39'
    }
    ,
    attributes:[[Sequelize.fn('count',Sequelize.col('id')),'count']],
})
    const total  = await OrderTable.findAll({
        attributes:[[Sequelize.fn('sum', Sequelize.col('total')), 'total_sale']],
        where:{
            shop_id:req.params.shop_id
        }
    })
    const totalDuetoDryexpressbd =  await OrderTable.findAll({
        where:{
            paymentmethod:'cash-on-delivery',
            ispaidtolaundry:true,
            ispaidtodryexpress:false,
            paymentstatus:true,
            shop_id:req.params.shop_id
        }
       ,
        attributes:['id',[Sequelize.fn('count',Sequelize.col('id')),'count'],[Sequelize.fn('sum', Sequelize.col('profitamount')), 'total_profit'],[Sequelize.fn('sum', Sequelize.col('total')), 'total']],
    })

    const totalDueFromDryexpressbd =  await OrderTable.findAll({
        where:{
            paymentmethod:'Online',
            ispaidtolaundry:false,
            ispaidtodryexpress:true,
            paymentstatus:true,
            shop_id:req.params.shop_id
        }
       ,
        attributes:['id',[Sequelize.fn('count',Sequelize.col('id')),'count'],[Sequelize.fn('sum', Sequelize.col('profitamount')), 'total_profit'],[Sequelize.fn('sum', Sequelize.col('total')), 'total']],
    })


    //console.log("length:",totalDuetoLaundry.length)
    console.log("total Due to dryepressbd",totalDuetoDryexpressbd)
    console.log("total Due from dryepressbd",totalDueFromDryexpressbd)
    
    res.status(200).send({orders,total,totalDuetoDryexpressbd,totalDueFromDryexpressbd})
   
}

// for laudnry
const dueorderlistfromdryexpressbd = async(req,res)=>{
    const orderlist = await OrderTable.findAll({
        where:{
            paymentmethod:'online',
            ispaidtolaundry:false,
            ispaidtodryexpress:true,
            paymentstatus:true,
            shop_id:req.params.shop_id
        }
    })
    res.status(200).send(orderlist)
} 

// for laudnry
const dueorderlisttodryexpressbd = async(req,res)=>{
    const orderlist = await OrderTable.findAll({
        where:{
            paymentmethod:'cash-on-delivery',
            ispaidtolaundry:true,
            ispaidtodryexpress:false,
            paymentstatus:true,
            shop_id:req.params.shop_id
        }
    })
    res.status(200).send(orderlist)
}

module.exports ={
    addOrder,
    getAllOrders,
    getOneOrder,
    getActiveOrder,
    getOrdersbyuserid,
    getDeliveredOrder,
    getsingleOrderbyorderid,
    getAllOrdersByshopId,
    orderStatusUpdate,
    getAllOrdersByStatusshopId,
    getAllOrdersByStatus,
    getAllOrdersBystatusnshopidinmobile,
    getAllOrdersforReport,
    getAllOrdersByPaymentMethod,
    getBestSeller,
    getLengthforalltypesOrders,
    getAllOrdersforReportShop,
    getBestCustomerByshop,
    getOrdersbyuseridAndShopid,
    getallCustomersByShopID,
    getAllOrdersByDiscountId,
    getAllOrdersByDiscountIdandshopid,
    getShoplistbyuserid,
    getallorderbycustomeridandshopid,
    verifycourierbycustomer,
    updatePaymentStatus,
    getToadysOrderForAdmin,
    duetoLaundryDetails,
    getTodaysOrderlist,
    getTodaysOrderlistLaundry,
    getToadysOrderForLaundry,
    dueorderlistfromdryexpressbd,
    dueorderlisttodryexpressbd,
    addOrderlatest,
   

}