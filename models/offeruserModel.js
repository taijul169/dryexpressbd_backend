

module.exports =  (sequelize, DataTypes) =>{
    const Offeruser = sequelize.define('offeruser',{
        
        firstname:{
            type:DataTypes.STRING,
            allowNull:true,
        },
        lastname:{
            type:DataTypes.STRING,
            allowNull:true,
        },
        phone:{
            type:DataTypes.STRING,
            allowNull:true,
        },
        address:{
            type:DataTypes.STRING,
            allowNull:true,
        },
        email:{
            type:DataTypes.STRING,
            allowNull:true
        },
        offer_id:{
            type:DataTypes.INTEGER,
            allowNull:true
        },
        
    })

    return Offeruser;
}