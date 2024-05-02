

module.exports =  (sequelize, DataTypes) =>{
    const Product = sequelize.define('product',{
        title:{
            type:DataTypes.STRING,
            allowNull:false
        },
        price:{
            type:DataTypes.INTEGER,
            allowNull:false
        },
        price_wash:{
            type:DataTypes.INTEGER,
            allowNull:false
        },
        price_drywash:{
            type:DataTypes.INTEGER,
            allowNull:false
        },
        category:{
            type:DataTypes.STRING
        },
        description:{
            type: DataTypes.TEXT
        },
        shop_id:{
            type:DataTypes.INTEGER
        },
        category_class:{
            type:DataTypes.STRING
        },
        published:{
            type:DataTypes.BOOLEAN
        },
        amount:{
            type:DataTypes.INTEGER
        },
        product_image_id:{
            type:DataTypes.INTEGER
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
            defaultValue:0,
            allowNull:false
        }

    })

    return Product;
}