

module.exports =  (sequelize, DataTypes) =>{
    const City = sequelize.define('city',{
        city:{
            type:DataTypes.STRING,
            allowNull:false
        },
        area:{
            type:DataTypes.STRING,
            allowNull:false,
            unique:true
        },
        description:{
            type: DataTypes.TEXT
        },
        published:{
            type:DataTypes.BOOLEAN
        }
    })

    return City;
}