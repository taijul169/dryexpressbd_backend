

module.exports =  (sequelize, DataTypes) =>{
    const Paymenthistory = sequelize.define('paymenthistory',{
        order_id:{
            type:DataTypes.INTEGER,
            allowNull:false
        },
        customer_id:{
            type:DataTypes.INTEGER,
            allowNull:false
        },
        shop_id:{
            type:DataTypes.INTEGER,
            allowNull:false
        },
        paymentstatus:{
            type:DataTypes.BOOLEAN,
            defaultValue:null
        },
        provider:{
            type:DataTypes.STRING,
            defaultValue:null
        },
        total_amount:{
            type:DataTypes.INTEGER,
            defaultValue:null
        },
        status:{
            type:DataTypes.STRING,
            defaultValue:null
        },
        tran_id:{
            type:DataTypes.STRING,
            defaultValue:null
        },
        error:{
            type:DataTypes.STRING,
            defaultValue:null
        },
        bank_tran_id:{
            type:DataTypes.STRING,
            defaultValue:null
        },
        tran_date:{
            type:DataTypes.STRING,
            defaultValue:null
        },
        message:{
            type:DataTypes.STRING,
            defaultValue:null
        },
        verify_sign:{
            type:DataTypes.STRING,
            defaultValue:null
        },
        
    })

    return Paymenthistory;
}