

module.exports =  (sequelize, DataTypes) =>{
    const Servicename = sequelize.define('servicename',{
        
        name:{
            type:DataTypes.STRING,
            allowNull:false,
            unique:true
        },
        published:{
            type:DataTypes.BOOLEAN,
            defaultValue:1
        }
        
       
    })

    return Servicename;
}