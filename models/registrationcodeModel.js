

module.exports =  (sequelize, DataTypes) =>{
    const Regicode = sequelize.define('registrationcode',{
        phone:{
            type:DataTypes.STRING,
            allowNull:false
        },
        code:{
            type:DataTypes.INTEGER,
            allowNull:false,
        },
        isactive:{
            type:DataTypes.BOOLEAN
        }
    })

    return Regicode;
}