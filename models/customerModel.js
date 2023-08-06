

module.exports =  (sequelize, DataTypes) =>{
    const Customer = sequelize.define('customer',{
        name:{
            type:DataTypes.STRING   
        },
        phone:{
            type:DataTypes.STRING,
            allowNull:false,         
            unique: true
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
        photo:{
            type: DataTypes.STRING,
        },
        isactive:{
            type:DataTypes.BOOLEAN
        },
        jwtoken:{
            type:DataTypes.TEXT
        },
        firebasetoken:{
            type:DataTypes.STRING,
            defaultValue:null
        }
    })

    return Customer;
}