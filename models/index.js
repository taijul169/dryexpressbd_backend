const dbConfig =  require('../config/dbConfig.js');
const {Sequelize,DataTypes} = require('sequelize');

const sequelize = new Sequelize(
    dbConfig.DB,
    dbConfig.USER,
    dbConfig.PASSWORD, {
        host:dbConfig.HOST,
        dialect:dbConfig.dialect,
        operatorsAliases:false,
        pool:{
            max:dbConfig.pool.max,
            min:dbConfig.pool.min,
            acquire:dbConfig.pool.acquire,
            idle:dbConfig.pool.idle
        }
    }
)



sequelize.authenticate()
.then(()=>{
    console.log("connected")
})
.catch(err =>{
    console.log('Error',err)
})


const db = {

}

db.Sequelize = Sequelize;
db.sequelize =  sequelize


// table creating
db.products = require('./productModel.js')(sequelize, DataTypes)
db.reviews = require('./reviewModel.js')(sequelize, DataTypes)
db.customers = require('./customerModel.js')(sequelize, DataTypes)
db.shops = require('./shopModel.js')(sequelize, DataTypes)
db.packages = require('./packageModel.js')(sequelize, DataTypes)
db.orders = require('./orderModel.js')(sequelize, DataTypes)
db.orderedproduct = require('./orderedProductModel')(sequelize, DataTypes)
db.city = require('./cityModel')(sequelize, DataTypes)
db.productimages = require('./productImageModel')(sequelize, DataTypes)
db.admins = require('./adminModel')(sequelize, DataTypes)
db.orderstatus = require('./orderstatusModel')(sequelize,DataTypes)
db.couriers = require('./courierModel')(sequelize,DataTypes)
db.notifications =  require('./notificationModel')(sequelize, DataTypes)
db.discounts =  require('./discountModel')(sequelize, DataTypes)
db.discountusers =  require('./discountuserModel')(sequelize, DataTypes)
db.paymenthistory =  require('./paymenthistoryModel')(sequelize, DataTypes)
db.accounts =  require('./accountModel')(sequelize, DataTypes)
const Discounts=  require('./discountModel')(sequelize, DataTypes)
db.messages=  require('./messageModel')(sequelize, DataTypes)
db.registrationcodes =  require('./registrationcodeModel')(sequelize,DataTypes)
db.servicetypes = require('./servicetypeModel')(sequelize,DataTypes)
db.servicenames = require('./servicenameModel')(sequelize,DataTypes)
db.orderservicetypes = require('./orderservicetypeModel')(sequelize,DataTypes)
db.cartitems = require('./cartitemModel')(sequelize,DataTypes)
db.cartservices = require('./cartserviceModel')(sequelize,DataTypes)
db.offeruser = require('./offeruserModel')(sequelize,DataTypes)
db.orderedservices =  require('./orderedserviceModel')(sequelize,DataTypes)
db.offers = require('./offerModel')(sequelize,DataTypes)
db.coupons =  require('./couponModel')(sequelize,DataTypes)
db.memberships =  require('./membershipModel')(sequelize,DataTypes)
db.sequelize.sync({
    force:false,
})
.then(()=>{ 
    console.log("yes re-sync done!")
})

// offer and registered user relastionship

db.offers.hasMany(db.offeruser,{
    foreignKey:'offer_id',
    as:'offeruser'
})

db.offeruser.belongsTo(db.offers,{
    foreignKey:'offer_id',
    as:'offer'
})

// one to many relationship between shops and accounts
db.shops.hasMany(db.accounts,{
    foreignKey:'shop_id',
    as:'account'
})
db.accounts.belongsTo(db.shops,{
    foreignKey:'shop_id',
    as:'shop'
})

// relationship between ordereditem and ordered servies
db.orderedproduct.hasMany(db.orderedservices,{
    foreignKey:'ordereditem_id',
    as:'orderedservice'
})

db.orderedservices.belongsTo(db.orderedproduct,{
    foreignKey:'ordereditem_id',
    targetKey:'id',
    as:'orderedproduct'
})

// cartitem and cart services relationship
db.cartitems.hasMany(db.cartservices,{
    foreignKey:'cartitem_id',
    as:'cartservice'
})

db.cartservices.belongsTo(db.cartitems,{
    foreignKey:'cartitem_id',
    as:'cartitem'
})

// service type and prodduct relationship
db.products.hasMany(db.servicetypes,{
    foreignKey:'product_id',
    as:'servicetype'
})
db.servicetypes.belongsTo(db.products,{
    foreignKey:'product_id',
    as:'product'
})


// discount and discount user relationship
db.discounts.hasMany(db.discountusers,{
    foreignKey:'discount_id',
    as:'discountuser'
})
db.discountusers.belongsTo(db.discounts,{
    foreignKey:'discount_id',
    as:'discount'
})

// one to many relationship between shops and discountusers
db.shops.hasMany(db.discountusers,{
    foreignKey:'user_id',
    as:'discountuser'
})
db.discountusers.belongsTo(db.shops,{
    foreignKey:'user_id',
    as:'shop'
})
// customer and discount users relationship
db.customers.hasMany(db.discountusers,{
    foreignKey:'customer_id',
    as:'discountuser'
})
db.discountusers.belongsTo(db.customers,{
    foreignKey:'customer_id',
    as:'customer'
})

// 
db.shops.hasMany(db.discounts,{
    foreignKey:'user_id',
    as:'discount'
})
db.discounts.belongsTo(db.shops,{
    foreignKey:'user_id',
    as:'shop'
})

// order and discounts relationship
db.orders.belongsTo(db.discounts,{
    foreignKey:'discount_id',
    as:'discount'
})
db.discounts.hasMany(db.orders,{
    foreignKey:'discount_id',
    as:'order'
})

// customer to notification relationship
db.customers.hasMany(db.notifications,{
    foreignKey:'user_id',
    as:'notification'
})
db.notifications.belongsTo(db.customers,{
    foreignKey:'user_id',
    as:'customer'
})


// order to orderstatu relationship
db.orders.hasOne(db.orderstatus,{
    foreignKey:'order_id',
    as:'orderstatus'
})
db.orderstatus.belongsTo(db.orders,{
    foreignKey:'order_id',
    as:'order'
})

// one to many relationship between orders and payment history
db.orders.hasOne(db.paymenthistory,{
    foreignKey:'order_id',
    as:'paymenthistory'
})
db.paymenthistory.belongsTo(db.orders,{
    foreignKey:'order_id',
    as:'order'
})

// 1 to many Relation
// db.products.hasMany(db.reviews,{
//     foreignKey:'product_id',
//     as:'review'
// })

// db.reviews.belongsTo(db.products,
//     {
//         foreignKey:'product_id',
//         as:'product'
//     })


    db.shops.hasMany(db.reviews,{
        foreignKey:'shop_id',
        as:'review'
    })
    
    db.reviews.belongsTo(db.shops,
        {
            foreignKey:'shop_id',
            as:'shop'
        })

//    1 to many relationship between customer and reviews
    db.customers.hasMany(db.reviews,{
        foreignKey:'user_id',
        as:'review'
    }) 
   db.reviews.belongsTo(db.customers,{
         foreignKey:'user_id',
         as:'customer'
     })
   
//1 to many Relation between shop and products
db.shops.hasMany(db.products,{
    foreignKey:'shop_id',
    as:'product'
})

db.products.belongsTo(db.shops,
    {
        foreignKey:'shop_id',
        as:'shop'
   })


 // 1 to many Relation between shop and courier
db.shops.hasMany(db.couriers,{
    foreignKey:'shop_id',
    as:'courier'
})

db.couriers.belongsTo(db.shops,
    {
        foreignKey:'shop_id',
        as:'shop'
    })



// 1 to many Relation (order with customer)
db.customers.hasMany(db.orders,{
    foreignKey:'user_id',
    as:'order'
})

db.orders.belongsTo(db.customers,
    {
        foreignKey:'user_id',
        as:'customer'
    }) 
    
    

// 1 to many relation(order id with product)

db.orders.hasMany(db.orderedproduct,{
    foreignKey:'order_id',
    as: "orderedproduct"
})

db.orderedproduct.belongsTo(db.orders,{
    foreignKey:'order_id',
    as:'order'
})




//1 to many relation(order with shop)
 db.shops.hasMany(db.orders,{
     foreignKey:'shop_id',
     as:'order'
 })
 db.orders.belongsTo(db.shops,{
     foreignKey:'shop_id',
     as:'shop'
 })
// 1 to many Relation (courier  with orders)
db.couriers.hasMany(db.orderstatus,{
    foreignKey:'deliveryboyid',
    as:'orderstatus'
})

db.orderstatus.belongsTo(db.couriers,
    {
        foreignKey:'deliveryboyid',
        as:'courier'
    }) 

// 1 to manay relationship betweeen product and productimage
db.productimages.hasMany(db.products,{
    foreignKey:'product_image_id',
    as:'product'
})
db.products.belongsTo(db.productimages,{
    foreignKey:'product_image_id',
    as:'productimage'
})  


    
module.exports = db