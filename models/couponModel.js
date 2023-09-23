

module.exports =  (sequelize, DataTypes) =>{
    const Coupon = sequelize.define('coupon',{
        name:{
            type:DataTypes.STRING,
            allowNull:false,
            unique:true

        },
        percent:{
            type:DataTypes.INTEGER,
            allowNull:false,
            
        },
        description:{
            type: DataTypes.TEXT
        },
        isActive:{
            type:DataTypes.BOOLEAN
        }
    })

    return Coupon;
}