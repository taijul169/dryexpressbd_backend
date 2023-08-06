

module.exports =  (sequelize, DataTypes) =>{
    const Shop = sequelize.define('shop',{
        name:{
            type:DataTypes.STRING
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
        shop_tin:{
            type: DataTypes.TEXT
        },
        tradelicense:{
            type: DataTypes.TEXT
        },
        ownernid:{
            type: DataTypes.TEXT
        },
        ownername:{
            type: DataTypes.TEXT
        },
        photo:{
            type:DataTypes.STRING
        },
        nidphoto:{
            type:DataTypes.STRING
        },
        tradephoto:{
            type:DataTypes.STRING
        },
        password:{
            type: DataTypes.TEXT
        },
        isactive:{
            type:DataTypes.BOOLEAN
        },
        isverify:{
            type:DataTypes.BOOLEAN
        },
        jwtokenforshop:{
          type:DataTypes.TEXT
        },
        ispackage:{
            type:DataTypes.BOOLEAN
          },
        lat:{
            type:DataTypes.STRING
        },
        long:{
            type:DataTypes.STRING
        },
        firebasetoken:{
            type:DataTypes.STRING,
            defaultValue:null
        },
        isonline:{
            type:DataTypes.BOOLEAN,
            defaultValue:1
        },
        isfeatured:{
            type:DataTypes.BOOLEAN,
            defaultValue:0
        },
        profitpercent:{
            type:DataTypes.INTEGER,
            defaultValue:0
        },
        
        
    })

    return Shop;
}