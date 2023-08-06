

module.exports =  (sequelize, DataTypes) =>{
    const Orderservicetype = sequelize.define('orderservicetype',{
        
        title:{
            type:DataTypes.STRING,
            allowNull:false,
        },
        service_id:{
            type:DataTypes.INTEGER,

        },
        product_id:{
            type:DataTypes.INTEGER,
            allowNull:false,
        },
        order_id:{
            type:DataTypes.INTEGER,
            allowNull:false,
        },
        price:{
            type:DataTypes.INTEGER,
            allowNull:false,
        }
        ,category:{
            type:DataTypes.STRING
        }
    })

    return Orderservicetype;
}