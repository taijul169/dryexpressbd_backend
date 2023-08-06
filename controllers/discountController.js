const db = require('../models')

const { Op } = require("sequelize");
const OrderTable = db.orders
const Customer = db.customers
const Shop = db.shops
const Discount =  db.discounts
const Discountuser =  db.discountusers
const Notification =  db.notifications
// function
// 1.add review
const addDiscount = async(req,res)=>{
    try {
        let data = {
            user_id:req.body.user_id,
            user_type:req.body.user_type,
            discount_type:req.body.discount_type,
            created_by:req.body.created_by,
            discount_percent:req.body.discount_percent,
            name:req.body.name,
            expired_in:req.body.expired_in,
            iscontributed:req.body.iscontributed ? req.body.iscontributed :false,
            contribution_percent:req.body.contribution_percent? req.body.contribution_percent:0,
        }
        alreadyExistOrNot =  await Discount.findAll({where:{name:data.name,user_type:data.user_type,user_id:data.user_id}})
       if(alreadyExistOrNot.length>0){
        res.status(400).send({msg:'This Discount alreay exist!!!'})
       }else{
        const discount = await Discount.create(data)
        if(req.body.created_by == 'shop' && req.body.user_type == 'shop'){
          insertedUserToDiscount =  Discountuser.create({
              user_id:req.body.user_id,
              user_type:'shop',
              discount_id:discount.id
          })  
        }
        res.status(200).send(discount)
       }
      
    } catch (error) {
        console.log("error",error)
        res.status(401).send(error)
    }
    
 
}

// add user to discount
const addUsertoDiscount = async(req,res)=>{
    try {

        if(req.body.discount_type == 'GLOBAL'){
            const shopData = await Shop.findAll({where:{isverify:true}})
            let insertedUserToDiscount;

            shopData.map(async(item,idx)=>{
                insertedUserToDiscount =  Discountuser.create({
                    user_id:item.id,
                    user_type:'shop',
                    discount_type:'global',
                    discount_id:req.body.discount_id
                })
                // adding to notification table
                let data = {
                    heading:'Promotion',
                    body:`Dear Honourable sevice provider ${item.name}, You have a started a new promotion.please have look to your promotion section`,
                    user_type:'shop',
                    shop_id:item.id,
                    noti_type:'discount',
                    discount_id:req.body.discount_id

                }
                const notification = await Notification.create(data)   
            })
            res.status(200).send(insertedUserToDiscount)  
        }
        if(req.body.discount_type == 'INDIVIDUAL'){
            const ExistORnotData = await Discountuser.findAll({where:{discount_id:req.body.discount_id,user_id:req.body.user_id}})
            //console.log("exist data:",ExistORnotData)
            if(ExistORnotData.length>0){
                res.status(403).send({msg:'Data already exist!!'})  
            }else{
                const discountuser = await Discountuser.create({
                    user_id:req.body.user_id,
                    user_type:'shop',
                    discount_type:'individual',
                    discount_id:req.body.discount_id
                })
                 // adding notification
                let data = {
                    heading:'Promotion',
                    body:`Dear Honourable sevice provider, You have a started a new promotion.please have look to your promotion section`,
                    user_type:'shop',
                    shop_id:req.body.user_id,
                    noti_type:'discount',
                    discount_id:req.body.discount_id
                }
               
                const notification = await Notification.create(data)  
                res.status(200).send(discountuser)  
            }
      
        }
        if(req.body.discount_type == 'GLOBAL_FROM_SHOP'){
            // get all customer for a specific shop
            let data = await OrderTable.findAll({
                where: { shop_id:req.body.shop_id },
               
                attributes:['user_id'],
                include:[
                 {
                     model:Customer,
                     as:'customer',
                     attributes:['id','name','phone']
                 
                 },
                 
             ]
             })
             console.log("all customer data:",data)
             const key = 'user_id';
     
            //  const allCustomerID = [...new Map(data.map(item =>
            //    [item['key'], item])).values()];
             
             console.log("allCustomerID unique",data.length);
            
            data.map(async(item,idx)=>{
                console.log("single data for unique customer",item.customer.id)
                let insertedUserToDiscount;
                 insertedUserToDiscount = await Discountuser.create({
                    user_id:req.body.shop_id,
                    customer_id:item.customer.id,
                    user_type:'customer',
                    discount_type:'global_shop',
                    discount_id:req.body.discount_id
                })
                // adding notification
                let data = {
                    heading:'Discount',
                    body:`Dear customer, You have  a new promotion.let's get your limited discount offer :) `,
                    user_type:'customer',
                    user_id:item.user_id,
                    noti_type:'discount',
                    discount_id:req.body.discount_id
                }
                console.log("insertedUserToDiscount",insertedUserToDiscount)
                const notification = await Notification.create(data)      
            })
            res.status(200).send(insertedUserToDiscount)  
        }
        if(req.body.discount_type == 'INDIVIDUAL_FROM_SHOP'){
            console.log("req body:",req.body)
            const ExistORnotData = await Discountuser.findAll({where:{discount_id:req.body.discount_id,customer_id:req.body.user_id}})
            console.log("exist data:",ExistORnotData)
            if(ExistORnotData.length>0){
                res.status(403).send({msg:'Data already exist!!'})  
            }else{
                const discountuser = await Discountuser.create({
                    customer_id:req.body.user_id,
                    user_id:req.body.shop_id,
                    user_type:'customer',
                    discount_type:'individual_shop',
                    discount_id:req.body.discount_id
                })
                console.log('discountuser',discountuser)
                // adding notification
                let data = {
                    heading:'Discount',
                    body:`Dear customer, You have  a new promotion.let's get your limited discount offer :) `,
                    user_type:'customer',
                    user_id:req.body.user_id,
                    noti_type:'discount',
                    discount_id:req.body.discount_id
                }
                
                const notification = await Notification.create(data) 
                res.status(200).send(discountuser)  
            }
      
        }
    } catch (error) {
        console.log("error",error)
        res.status(400).send({error:error})
    }
  
  }

// 2.Get all Reviews
const getAllDiscunts =  async (req,res) =>{
    const discounts =  await Discount.findAll()
    discounts.map(async(item)=>{
        var countDownDate = new Date(item.expired_in).getTime();
        // Update the count down every 1 second
        // Get today's date and time
        var now = new Date().getTime();
            
        // Find the distance between now and the count down date
        var distance = countDownDate - now;
        console.log("distance",distance)
        if(distance<0){
            var values = {isactive:false};
            var condition = { where :{id:item.id} }; 
           // options = { multi: true };
            const updateDiscount =  await Discount.update(values, condition)
            console.log("updateDiscount:",updateDiscount)
            
        }
       return item 
   
})
    res.status(200).send(discounts)
}
// 2.Get all Reviews by shop id

const getAllDiscountsByUserID =  async (req,res) =>{
    const user_id = req.params.user_id;
    let discouts =  await Discountuser.findAll({
        where:{[Op.or]: [
             { 
             user_id:user_id,
              user_type:{
                  [Op.eq]:'shop'
              } 
            },
            {
                user_id:user_id,
                user_type:{
                    [Op.eq]:'customer'
                } 
            }
          ]},  
        include:[{
            model:Discount,
            as:'discount',
            required:false,
            order: [  
                ['discount','id', 'DESC'],
            ]

        },
        
    ],
    order: [
        ['id', 'DESC'],
       
    ],
    
    })

    //console.log("discount list:",discouts)
     discouts = [...new Map(discouts.map(item =>
        [item["discount_id"], item])).values()];

    let onlyId =discouts.map((item,idx)=>{
        return item.discount_id
    })
    //console.log("onlyid",onlyId)
    let discountUnassigned =  await Discount.findAll({
        where:{[Op.or]: [
             { 
             user_id:user_id,
              user_type:{
                  [Op.eq]:'shop'
              } 
            },
            {
                user_id:user_id,
                user_type:{
                    [Op.eq]:'customer'
                } 
            }
          ],
          id: {[Op.notIn]:onlyId}
        },
    //     include:[{
    //         model:Discount,
    //         as:'discount',
    //         required:true
    //     },
    // ],
    
    })
    res.status(200).send({discouts,discountUnassigned})
}


const getAllUsersByDiscountID =  async (req,res) =>{
    try {
        let includeData={};
        if(req.params.user_type == 'customer'){
            includeData ={
                model:Customer,
                as:'customer',
                attributes:['id','name','phone','address']
            }
        }else{
            includeData ={
                model:Shop,
                as:'shop',
                attributes:['id','name','phone','address','area','city','isverify']
            }
        }
        const discouts =  await Discountuser.findAll({
            where:{discount_id:req.params.discount_id},
            include:[includeData],
            
        })
        res.status(200).send(discouts)
    } catch (error) {
        console.log("error",error)
    }
   
}
// 2.Get all Reviews by user id

const getSingleDiscountId =  async (req,res) =>{
    const discount =  await Discount.findOne({where:{id:req.params.id}})
    console.log("discount",discount)
    res.status(200).send(discount)
}
const updateSingleDiscount = async (req,res)=>{
    try {
        const updateDiscount =  await Discount.update(req.body,{where:{id:req.params.id}})
        res.status(200).send(updateDiscount)
    } catch (error) {
        res.status(400).send({error})
    }
   
}


// customer discount by customer id 
const getAllDiscountsByCustomerID =  async (req,res) =>{
    const customer_id = req.params.customer_id;
    let customerDiscount =  await Discountuser.findAll({
        where:{ 
              customer_id:customer_id,
              user_type:'customer'
            },
       
        include:[{
            model:Discount,
            as:'discount',
            required:true,
            where:{isactive:true},
            order:[['Discount','id','DESC']]
        },
    ],
    order:[['id','DESC']]
    
    })
    res.status(200).send(customerDiscount)
}
// customer discount by customer id 
const getAllDiscountsByCustomerIDInDashboard =  async (req,res) =>{
    const customer_id = req.params.customer_id;
    let customerDiscount =  await Discountuser.findAll({
        where:{ 
             
              customer_id:customer_id,
              user_type:'customer'
            },
       
        include:[{
            model:Discount,
            as:'discount',
            required:false,
        },
        {
            model:Shop,
            as:'shop',
            required:false,
        },
    ],
    
    })
    res.status(200).send(customerDiscount)
}

// discount automatically updated
// automatically update isactive field in disouct table





module.exports = {
    addDiscount,getAllDiscunts,getAllDiscountsByUserID,getSingleDiscountId,updateSingleDiscount,addUsertoDiscount,getAllUsersByDiscountID,getAllDiscountsByCustomerID,
    getAllDiscountsByCustomerIDInDashboard
}
    
