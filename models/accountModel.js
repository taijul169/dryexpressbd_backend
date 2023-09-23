
const getTime =  ()=>{
    const d = new Date();
    let time = d.getTime();
    return time
}
module.exports =  (sequelize, DataTypes) =>{
    const Account = sequelize.define('account',{
      
        shop_id:{
            type:DataTypes.INTEGER,
            allowNull:false
        },
        amount:{
            type:DataTypes.INTEGER,
            allowNull:false
        },
        paidtolaundry:{
            type:DataTypes.BOOLEAN,
        },
        confirmedbylaundry:{
            type:DataTypes.BOOLEAN,
            defaultValue:false
        },
        paymentmethod:{
            type:DataTypes.STRING,
            defaultValue:null
        },
        createdTime:{
            type:DataTypes.STRING,
            defaultValue:getTime()
        },
        updatedTime:{
            type:DataTypes.STRING,
            defaultValue:null
        },
        orderid:{
            type:DataTypes.STRING,
        },   
        
    })

    return Account;
}