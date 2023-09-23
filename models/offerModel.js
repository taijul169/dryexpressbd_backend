

module.exports =  (sequelize, DataTypes) =>{
    const Offer = sequelize.define('offer',{
        
        name:{
            type:DataTypes.STRING,
            allowNull:false,
        },
        details:{
            type:DataTypes.STRING,
            allowNull:false,
        },
        photo:{
            type:DataTypes.STRING,
            allowNull:true,
        },
        discount_percent:{
            type:DataTypes.STRING,
            allowNull:false,
        },
        published:{
            type:DataTypes.BOOLEAN,
            defaultValue:true
        },
        startdate:{
            type:DataTypes.STRING,
            allowNull:true
        },
        expired_in:{
            type:DataTypes.STRING,
            allowNull:true
        },
        
    })

    return Offer;
}