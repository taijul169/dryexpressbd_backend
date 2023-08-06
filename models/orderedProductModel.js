

module.exports =  (sequelize, DataTypes) =>{
    const OrderedProduct = sequelize.define('orderedproduct',{
        order_id:{  
            type:DataTypes.INTEGER,
        },
        product_id:{
            type:DataTypes.INTEGER
        },
        title:{
            type:DataTypes.STRING,
        },
        amount:{
            type:DataTypes.INTEGER,
            allowNull:false
        },
        category:{
            type: DataTypes.TEXT
        },
        price:{
            type: DataTypes.INTEGER
        },
        profit_percent:{
            type: DataTypes.INTEGER
        },
        isActiveDiscount:{
            type:DataTypes.BOOLEAN,
            defaultValue:null
        }
        
    })

    return OrderedProduct;
}