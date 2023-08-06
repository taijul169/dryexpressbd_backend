

module.exports =  (sequelize, DataTypes) =>{
    const Courier = sequelize.define('courier',{
        name:{
            type:DataTypes.STRING
        },
        shop_id:{
          type:DataTypes.INTEGER
        },
        phone:{
            type:DataTypes.STRING,
            allowNull:false,
            unique:true
        },
        address:{
            type: DataTypes.TEXT
        },
        area:{
            type: DataTypes.TEXT
        },
        city:{
            type: DataTypes.TEXT
        },
        nid:{
            type: DataTypes.TEXT
        },
        photo:{
            type:DataTypes.STRING
        },
        password:{
            type: DataTypes.TEXT,
            allowNull:false
        },
        isactive:{
            type:DataTypes.BOOLEAN
        },
        isverify:{
            type:DataTypes.BOOLEAN
        },
        jwtokenforcourier:{
          type:DataTypes.TEXT
        },
        firebasetoken:{
            type:DataTypes.STRING,
            defaultValue:null
        },
  
    })

    return Courier;
}