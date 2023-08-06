

module.exports =  (sequelize, DataTypes) =>{
    const Productimage = sequelize.define('productimage',{
        image:{
            type:DataTypes.STRING,
            allowNull:false
        },
        name:{
            type:DataTypes.STRING,
            allowNull:false,
            unique:true
        },
        published:{
            type:DataTypes.BOOLEAN,
            defaultValue:1
        }
        ,
        category:{
            type:DataTypes.STRING
        }
    })

    return Productimage;
}