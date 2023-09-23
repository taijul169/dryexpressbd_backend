

module.exports =  (sequelize, DataTypes) =>{
    const Cartitem = sequelize.define('cartitem',{
        
        title:{
            type:DataTypes.STRING,
            allowNull:false,
        },
        quantity:{
            type:DataTypes.INTEGER,
        },
        product_id:{
            type:DataTypes.INTEGER,
            allowNull:false,
        },
        shop_id:{
            type:DataTypes.INTEGER,
            allowNull:false,
        },
        price:{
            type:DataTypes.INTEGER,
            defaultValue:0
        },
        usertoken:{
            type:DataTypes.STRING,
            allowNull:false
        },
        profit_percent:{
            type:DataTypes.INTEGER
        },
        isActiveDiscount:{
            type:DataTypes.BOOLEAN,
            defaultValue:false
        },
        discount_percent:{
            type:DataTypes.INTEGER,
            defaultValue:0
        },
        combination_item:{
            type:DataTypes.STRING,
            defaultValue:null
        },
        wrapper_type:{
            type:DataTypes.STRING,
            defaultValue:'Folding'
        },
    })

    return Cartitem;
}