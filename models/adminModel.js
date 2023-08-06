

module.exports =  (sequelize, DataTypes) =>{
    const Admin = sequelize.define('admin',{
        name:{
            type:DataTypes.STRING 
        },
        phone:{
            type:DataTypes.STRING,
            allowNull:false,         
            unique: true
        },
        role:{
            type:DataTypes.STRING
        },
        gender:{
            type: DataTypes.TEXT,
        },
        dateofbirth:{
            type: DataTypes.TEXT,
        },
        address:{
            type: DataTypes.TEXT,
        },
        password:{
            type: DataTypes.TEXT,
        },
        isactive:{
            type:DataTypes.BOOLEAN
        },
        jwtoken:{
            type:DataTypes.TEXT
        }
    })

    return Admin;
}