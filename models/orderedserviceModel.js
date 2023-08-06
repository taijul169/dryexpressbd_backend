

module.exports =  (sequelize, DataTypes) =>{
    const Orderedservices = sequelize.define('orderedservice',{
        
        servicename:{
            type:DataTypes.STRING,
            allowNull:false,
        },
        quantity:{
            type:DataTypes.INTEGER,
            allowNull:false
        },
        product_id:{
            type:DataTypes.INTEGER,
            allowNull:false,
        },
        ordereditem_id:{
            type:DataTypes.INTEGER,
            allowNull:false,
        },
        price:{
            type:DataTypes.INTEGER,
            defaultValue:0
        },
        service_id:{
            type:DataTypes.INTEGER,
            allowNull:false
        },
        image_path:{
            type:DataTypes.STRING,
            allowNull:true,
        },
        comment:{
            type:DataTypes.STRING,
            allowNull:true,
        },
    },
    // indexes: [
    //     {
    //         unique: true,
    //         fields: ['service_id', 'cartitem_id','user_type','discount_type','customer_id'],
    //         name:'unique_discount_user'
    //     },
       
    // ]
    
    )

    return Orderedservices;
}