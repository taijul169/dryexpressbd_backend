

module.exports =  (sequelize, DataTypes) =>{
    const Package = sequelize.define('package',{
        title:{
            type:DataTypes.STRING,
            allowNull:false
        },
        numberofitem:{
            type:DataTypes.INTEGER,
            allowNull:false
        },
        price:{
            type:DataTypes.INTEGER,
            allowNull:false
        },
        description:{
            type: DataTypes.TEXT
        },
        isactive:{
            type:DataTypes.BOOLEAN
        }
    })

    return Package;
}