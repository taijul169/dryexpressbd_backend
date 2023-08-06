

module.exports =  (sequelize, DataTypes) =>{
    const Servicetype = sequelize.define('servicetype',{
        
        name:{
            type:DataTypes.STRING,
            allowNull:false,
        },
        service_id:{
            type:DataTypes.INTEGER,

        },
        published:{
            type:DataTypes.BOOLEAN,
            defaultValue:1
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
            allowNull:false,
        }
        ,category:{
            type:DataTypes.STRING
        }
    })

    return Servicetype;
}