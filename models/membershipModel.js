

module.exports =  (sequelize, DataTypes) =>{
    const Membership = sequelize.define('membership',{
        isVatAllow:{
            type:DataTypes.BOOLEAN,
            defaultValue:0
        },
        vat_percent:{
            type:DataTypes.INTEGER,
            defaultValue:0

        },
        isCouponAllow:{
            type:DataTypes.BOOLEAN,
            defaultValue:0
        },
        coupon_percent:{
            type:DataTypes.INTEGER,
            defaultValue:0

        },
        isMembershipAllow:{
            type:DataTypes.BOOLEAN,
            defaultValue:0
        },
        membership_percent:{
            type:DataTypes.INTEGER,
            defaultValue:0

        },
        isActive:{
            type:DataTypes.BOOLEAN,
            defaultValue:true
        }
    })

    return Membership;
}