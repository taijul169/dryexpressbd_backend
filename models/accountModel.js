

module.exports =  (sequelize, DataTypes) =>{
    const Account = sequelize.define('account',{
      
        shop_id:{
            type:DataTypes.INTEGER,
            allowNull:false
        },
        duetolaundry:{
            type:DataTypes.INTEGER
        },
        duefromlaundry:{
            type:DataTypes.INTEGER
        },
        lastupdaedAt:{
            type:DataTypes.STRING
        },

        
        
    })

    return Account;
}